import { Router, Request, Response } from 'express';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../db/prisma.js';

export function adminRouter() {
  const router = Router();

  // Admin index
  router.get('/', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/index', { title: 'Admin Dashboard' });
  });

  // List all submissions
  router.get('/submissions', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const status = (req.query.status as string) || 'all';
      const where = status !== 'all' ? { status } : {};
      
      const submissions = await prisma.materialSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      });

      const stats = {
        pending: await prisma.materialSubmission.count({ where: { status: 'pending' } }),
        approved: await prisma.materialSubmission.count({ where: { status: 'approved' } }),
        rejected: await prisma.materialSubmission.count({ where: { status: 'rejected' } }),
        total: await prisma.materialSubmission.count()
      };

      res.render('admin/submissions', { 
        title: 'Material Submissions',
        submissions,
        stats,
        currentStatus: status,
        success: req.query.success ? decodeURIComponent(req.query.success as string) : undefined,
        error: req.query.error ? decodeURIComponent(req.query.error as string) : undefined
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.render('admin/submissions', { 
        title: 'Material Submissions',
        submissions: [],
        stats: { pending: 0, approved: 0, rejected: 0, total: 0 },
        currentStatus: 'all',
        error: 'Failed to load submissions'
      });
    }
  });

  // Approve a single submission
  router.post('/submissions/:id/approve', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      await prisma.materialSubmission.update({
        where: { id: req.params.id },
        data: {
          status: 'approved',
          reviewerId: req.session?.user?.id,
          reviewNote: req.body.note || null
        }
      });
      res.redirect('/admin/submissions?status=pending&success=Submission approved');
    } catch (error) {
      console.error('Error approving submission:', error);
      res.redirect('/admin/submissions?error=Failed to approve submission');
    }
  });

  // Reject a single submission
  router.post('/submissions/:id/reject', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      await prisma.materialSubmission.update({
        where: { id: req.params.id },
        data: {
          status: 'rejected',
          reviewerId: req.session?.user?.id,
          reviewNote: req.body.note || 'Rejected by administrator'
        }
      });
      res.redirect('/admin/submissions?status=pending&success=Submission rejected');
    } catch (error) {
      console.error('Error rejecting submission:', error);
      res.redirect('/admin/submissions?error=Failed to reject submission');
    }
  });

  // Approve all pending submissions
  router.post('/submissions/approve-all', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const result = await prisma.materialSubmission.updateMany({
        where: { status: 'pending' },
        data: {
          status: 'approved',
          reviewerId: req.session?.user?.id,
          reviewNote: 'Bulk approved by administrator'
        }
      });
      res.redirect(`/admin/submissions?success=${result.count} submissions approved`);
    } catch (error) {
      console.error('Error approving all submissions:', error);
      res.redirect('/admin/submissions?error=Failed to approve submissions');
    }
  });

  router.get('/security-reports', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/security-reports', { title: 'Security Reports' });
  });

  router.get('/announcements', requireAdmin, (req: Request, res: Response) => {
    res.render('admin/announcements', { title: 'Announcements' });
  });

  return router;
}
