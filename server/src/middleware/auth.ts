import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
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

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  // Middleware that doesn't require auth but adds user if available
  next();
}

