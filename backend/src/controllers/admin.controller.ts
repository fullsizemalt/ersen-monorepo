import { Request, Response } from 'express';
import { query } from '../config/db';
import { listCoupons, createCoupon, applyCouponToCustomer, deleteCoupon } from '../services/stripe';

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

export const getCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await listCoupons();
        res.json(coupons.data);
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
};

export const createCouponEndpoint = async (req: Request, res: Response) => {
    try {
        const coupon = await createCoupon(req.body);
        res.json(coupon);
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({ error: 'Failed to create coupon' });
    }
};

export const deleteCouponEndpoint = async (req: Request, res: Response) => {
    try {
        await deleteCoupon(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
};

export const applyCouponEndpoint = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { couponId } = req.body;

    try {
        const { rows } = await query('SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1', [userId]);
        const customerId = rows[0]?.stripe_customer_id;

        if (!customerId) {
            return res.status(404).json({ error: 'Customer not found (no subscription record)' });
        }

        const customer = await applyCouponToCustomer(customerId, couponId);
        res.json(customer);
    } catch (error) {
        console.error('Apply coupon error:', error);
        res.status(500).json({ error: 'Failed to apply coupon' });
    }
};
