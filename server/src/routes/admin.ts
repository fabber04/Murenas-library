import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/auth.js';

export function adminRouter() {
  const router = Router();

  // Admin index
  router.get('/', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/index', { title: 'Admin Dashboard' });
  });

  router.get('/submissions', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/submissions', { title: 'Material Submissions' });
  });

  router.get('/security-reports', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/security-reports', { title: 'Security Reports' });
  });

  router.get('/announcements', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/announcements', { title: 'Announcements' });
  });

  return router;
}
