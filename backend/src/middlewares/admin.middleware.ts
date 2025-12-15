import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admins only' });
        }

        // @ts-ignore
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
