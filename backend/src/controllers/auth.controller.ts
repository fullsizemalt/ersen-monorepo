import { Request, Response } from 'express';
import { getAuthorizationUrl, getProfileFromCode, getLogoutUrl } from '../services/workos';
import { query } from '../config/db';
import jwt from 'jsonwebtoken';

export const login = (req: Request, res: Response) => {
    const providerParam = (req.query.provider as string) || 'google';

    const providerMap: Record<string, string> = {
        'google': 'GoogleOAuth',
        'github': 'GitHubOAuth',
        'apple': 'AppleOAuth',
        'microsoft': 'MicrosoftOAuth'
    };

    const provider = providerMap[providerParam] || providerParam;
    const url = getAuthorizationUrl(provider);
    res.redirect(url);
};

export const callback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        const workosUser = await getProfileFromCode(code);

        // Upsert user
        const { rows } = await query(
            `INSERT INTO users (email, name, avatar_url, workos_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = $2, avatar_url = $3, workos_id = $4
       RETURNING *`,
            [
                workosUser.email,
                `${workosUser.firstName || ''} ${workosUser.lastName || ''}`.trim() || workosUser.email.split('@')[0],
                (workosUser.rawAttributes as any)?.picture || (workosUser.rawAttributes as any)?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + workosUser.email,
                workosUser.id
            ]
        );

        const user = rows[0];

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
    } catch (error) {
        console.error('Auth callback error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const me = async (req: Request, res: Response) => {
    // @ts-ignore - userId attached by middleware
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const { rows } = await query(
            `SELECT u.*, s.tier 
             FROM users u 
             LEFT JOIN subscriptions s ON u.id = s.user_id 
             WHERE u.id = $1`,
            [userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Default to free if no subscription record
        const user = rows[0];
        if (!user.tier) user.tier = 'free';

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
};

export const devLogin = async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }

    try {
        // Upsert dev user
        const { rows } = await query(
            `INSERT INTO users (email, name, avatar_url, workos_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = $2, avatar_url = $3, workos_id = $4
       RETURNING *`,
            ['dev@example.com', 'Dev User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev', 'dev_user_id']
        );

        const user = rows[0];

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ message: 'Logged in as Dev User', user });
    } catch (error) {
        console.error('Dev login error:', error);
        res.status(500).json({ error: 'Dev login failed' });
    }
};

export const cliLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // In a real app, you'd verify the password. 
    // For this MVP, we'll allow any password if the email exists, 
    // OR create the user if they don't exist (auto-register for CLI).
    // WARNING: This is insecure for production but fits the "Personal OS" rapid dev context.

    try {
        // Upsert user
        const { rows } = await query(
            `INSERT INTO users (email, name, avatar_url, workos_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET name = $2
       RETURNING *`,
            [
                email,
                email.split('@')[0],
                'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
                `cli_${Date.now()}`
            ]
        );

        const user = rows[0];

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' } // Longer expiry for CLI
        );

        res.json({ token, user });
    } catch (error) {
        console.error('CLI login error:', error);
        res.status(500).json({ error: 'CLI login failed' });
    }
};
