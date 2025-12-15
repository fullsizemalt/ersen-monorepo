import { Request, Response } from 'express';
import { query } from '../config/db';

export const getCatalog = async (req: Request, res: Response) => {
    try {
        const { rows } = await query('SELECT * FROM widget_templates ORDER BY tier, name');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const getActiveWidgets = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    try {
        const { rows } = await query(
            `SELECT aw.*, wt.slug, wt.name, wt.component_key 
       FROM active_widgets aw
       JOIN widget_templates wt ON aw.template_id = wt.id
       WHERE aw.user_id = $1`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const installWidget = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { templateId, position } = req.body;

    try {
        // Check subscription tier limits
        const subRes = await query('SELECT tier FROM subscriptions WHERE user_id = $1', [userId]);
        const userTier = subRes.rows[0]?.tier || 'free';

        const countRes = await query('SELECT COUNT(*) FROM active_widgets WHERE user_id = $1', [userId]);
        const widgetCount = parseInt(countRes.rows[0].count);

        let limit = 5;
        if (userTier === 'standard') limit = 20;
        if (userTier === 'pro') limit = 50;

        if (widgetCount >= limit) {
            return res.status(403).json({ error: `Widget limit reached for ${userTier} tier` });
        }

        // Check widget tier requirement
        const templateRes = await query('SELECT tier FROM widget_templates WHERE id = $1', [templateId]);
        if (templateRes.rows.length === 0) {
            return res.status(404).json({ error: 'Widget template not found' });
        }
        const widgetTier = templateRes.rows[0].tier;

        const tiers = ['free', 'standard', 'pro'];
        if (tiers.indexOf(userTier) < tiers.indexOf(widgetTier)) {
            return res.status(403).json({ error: `This widget requires ${widgetTier} tier` });
        }

        // Install
        const { rows } = await query(
            `INSERT INTO active_widgets (user_id, template_id, position)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [userId, templateId, position || { x: 0, y: 0, w: 1, h: 1 }]
        );

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Installation failed' });
    }
};

export const uninstallWidget = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { id } = req.params;

    try {
        await query('DELETE FROM active_widgets WHERE id = $1 AND user_id = $2', [id, userId]);
        res.json({ message: 'Widget uninstalled' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
};

export const updateWidget = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { id } = req.params;
    const { config, position } = req.body;

    try {
        // Verify ownership
        const check = await query('SELECT * FROM active_widgets WHERE id = $1 AND user_id = $2', [id, userId]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Widget not found' });
        }

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (config) {
            updates.push(`config = $${idx}`);
            values.push(config);
            idx++;
        }
        if (position) {
            updates.push(`position = $${idx}`);
            values.push(position);
            idx++;
        }

        if (updates.length === 0) {
            return res.json(check.rows[0]);
        }

        values.push(id);
        values.push(userId);

        const { rows } = await query(
            `UPDATE active_widgets 
       SET ${updates.join(', ')} 
       WHERE id = $${idx} AND user_id = $${idx + 1} 
       RETURNING *`,
            values
        );

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Update failed' });
    }
};
