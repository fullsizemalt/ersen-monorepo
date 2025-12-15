import { Request, Response, NextFunction } from 'express';
import db from '../lib/db';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.session_token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const session = await db.query(
        `SELECT u.* FROM users u
     JOIN sessions s ON s.user_id = u.id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
        [token]
    );

    if (session.rows.length === 0) {
        return res.status(401).json({ error: 'Session expired' });
    }

    req.user = session.rows[0];
    next();
}
