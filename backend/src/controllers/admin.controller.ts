import { Request, Response } from 'express';
import { query } from '../config/db';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { rows } = await query(
            `SELECT u.id, u.email, u.name, u.role, u.created_at, s.tier, s.status as subscription_status 
             FROM users u 
             LEFT JOIN subscriptions s ON u.id = s.user_id 
             ORDER BY u.created_at DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const userCount = await query('SELECT COUNT(*) FROM users');
        const subCount = await query("SELECT COUNT(*) FROM subscriptions WHERE status = 'active'");
        const proCount = await query("SELECT COUNT(*) FROM subscriptions WHERE tier = 'pro' AND status = 'active'");

        res.json({
            totalUsers: parseInt(userCount.rows[0].count),
            activeSubscriptions: parseInt(subCount.rows[0].count),
            proUsers: parseInt(proCount.rows[0].count)
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
