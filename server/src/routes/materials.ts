import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import fetch from 'node-fetch';
import { prisma } from '../db/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

type RouterOptions = { uploadsDir: string };

export function materialsRouter(opts: RouterOptions) {
  const router = Router();
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, opts.uploadsDir),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    }
  });
  const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
      cb(null, allowed.includes(file.mimetype));
    }
  });

  async function verifyCaptcha(token: string | undefined, ip: string | undefined) {
    if (process.env.ANONYMOUS_UPLOADS_ENABLED === 'false') return true;
    const provider = process.env.CAPTCHA_PROVIDER?.toLowerCase();
    if (!provider) return true; // not configured -> allow (dev convenience)
    const secret = process.env.CAPTCHA_SECRET_KEY || '';
    try {
      if (provider === 'hcaptcha') {
        const resp = await fetch('https://hcaptcha.com/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret, response: token || '', remoteip: ip || '' })
        });
        const data = (await resp.json()) as { success?: boolean };
        return Boolean(data.success);
      }
      if (provider === 'recaptcha') {
        const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ secret, response: token || '', remoteip: ip || '' })
        });
        const data = (await resp.json()) as { success?: boolean };
        return Boolean(data.success);
      }
    } catch {
      return false;
    }
    return false;
  }

  // Anonymous submissions
  router.post(
    '/submissions',
    upload.single('file'),
    body('title').isString().isLength({ min: 3 }).trim(),
    body('course_id').isString().trim(),
    body('year').isInt({ min: 2000, max: 2100 }).toInt(),
    body('type').isIn(['notes', 'solution', 'exam_paper', 'textbook']).trim(),
    body('captcha_token').optional().isString().trim(),
    async (req: AuthRequest, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('upload', { 
          title: 'Submit Study Material',
          error: 'Please check your input and try again.',
          formData: req.body
        });
      }
      if (!req.file) {
        return res.render('upload', { 
          title: 'Submit Study Material',
          error: 'Please select a file to upload.',
          formData: req.body
        });
      }

      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
      const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

      const passed = await verifyCaptcha(req.body.captcha_token as string | undefined, ip);
      if (!passed) {
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.render('upload', { 
          title: 'Submit Study Material',
          error: 'CAPTCHA verification failed. Please try again.',
          formData: req.body
        });
      }

      try {
        await prisma.materialSubmission.create({
          data: {
            userId: req.session?.user?.id || null,
            title: req.body.title as string,
            courseId: req.body.course_id as string,
            year: Number(req.body.year),
            type: req.body.type as string,
            filePath: req.file.path,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            ipHash
          }
        });
        return res.redirect('/materials/submit?success=' + encodeURIComponent('Material submitted successfully! It will be reviewed by an administrator.'));
      } catch (e) {
        try { fs.unlinkSync(req.file.path); } catch {}
        return res.render('upload', { 
          title: 'Submit Study Material',
          error: 'Failed to save submission. Please try again.',
          formData: req.body
        });
      }
    }
  );

  return router;
}


