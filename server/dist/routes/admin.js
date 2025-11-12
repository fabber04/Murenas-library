import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
export function adminRouter() {
    const router = Router();
    // Admin index
    router.get('/', requireAdmin, (req, res) => {
        res.render('admin/index', { title: 'Admin Dashboard' });
    });
    router.get('/submissions', requireAdmin, (req, res) => {
        res.render('admin/submissions', { title: 'Material Submissions' });
    });
    router.get('/security-reports', requireAdmin, (req, res) => {
        res.render('admin/security-reports', { title: 'Security Reports' });
    });
    router.get('/announcements', requireAdmin, (req, res) => {
        res.render('admin/announcements', { title: 'Announcements' });
    });
    return router;
}
