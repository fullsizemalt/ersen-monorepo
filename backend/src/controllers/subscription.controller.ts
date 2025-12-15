import { Request, Response } from 'express';
import { createCheckoutSession, createCustomer } from '../services/stripe';
import { query } from '../config/db';

export const checkout = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    // @ts-ignore
    const userEmail = req.user?.email;
    const { tier } = req.body;

    if (!userId || !tier) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let priceId = '';
    if (tier === 'standard') priceId = process.env.STRIPE_PRICE_STANDARD || 'price_standard_placeholder';
    if (tier === 'pro') priceId = process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder';

    if (!priceId) {
        return res.status(400).json({ error: 'Invalid tier' });
    }

    try {
        // Check if user has a subscription record
        const { rows } = await query('SELECT * FROM subscriptions WHERE user_id = $1', [userId]);
        let customerId = rows[0]?.stripe_customer_id;

        if (!customerId) {
            // Create Stripe customer
            const customer = await createCustomer(userEmail, 'User ' + userId);
            customerId = customer.id;

            // Create subscription record
            await query(
                `INSERT INTO subscriptions (user_id, stripe_customer_id, tier, status)
         VALUES ($1, $2, 'free', 'active')
         ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = $2`,
                [userId, customerId]
            );
        }

        const session = await createCheckoutSession(
            customerId,
            priceId,
            `${process.env.FRONTEND_URL}/dashboard?success=true`,
            `${process.env.FRONTEND_URL}/marketplace?canceled=true`
        );

        res.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
};

export const portal = async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
        const { rows } = await query('SELECT stripe_customer_id FROM subscriptions WHERE user_id = $1', [userId]);
        const customerId = rows[0]?.stripe_customer_id;

        if (!customerId) {
            return res.status(404).json({ error: 'No subscription found' });
        }

        // @ts-ignore
        const { createPortalSession } = await import('../services/stripe');
        const session = await createPortalSession(
            customerId,
            `${process.env.FRONTEND_URL}/dashboard`
        );

        res.json({ url: session.url });
    } catch (error) {
        console.error('Portal error:', error);
        res.status(500).json({ error: 'Failed to create portal session' });
    }
};
