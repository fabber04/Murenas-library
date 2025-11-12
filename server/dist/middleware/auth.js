export function requireAuth(req, res, next) {
    if (!req.session?.user) {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    next();
}
export function requireAdmin(req, res, next) {
    if (!req.session?.user) {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            title: 'Access Denied',
            message: 'You do not have permission to access this page.'
        });
    }
    next();
}
export function optionalAuth(req, res, next) {
    // Middleware that doesn't require auth but adds user if available
    next();
}
