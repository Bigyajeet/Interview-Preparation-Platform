import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-interview-key-2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

export const requireAdminOrMod = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'MODERATOR')) {
    res.status(403).json({ error: 'Access denied: Admin or Moderator role required' });
    return;
  }
  next();
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch {
    }
  }
  next();
};

export { JWT_SECRET };
