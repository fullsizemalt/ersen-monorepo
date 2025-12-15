import { Request, Response } from 'express';
import Stripe from 'stripe';
import { query } from '../config/db';
import stripe from '../services/stripe';

export const handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        // req.body must be raw buffer here
        event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret as string);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                // Update subscription status
                // We might need to fetch the subscription details to know the tier
                if (session.subscription) {
                    const sub = await stripe.subscriptions.retrieve(session.subscription as string);
                    await updateSubscription(session.customer as string, sub);
                }
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await updateSubscription(subscription.customer as string, subscription);
                break;
            }
        }
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

async function updateSubscription(customerId: string, subscription: Stripe.Subscription) {
    // Map Stripe Price ID to Tier
    // Ideally this mapping is in config or DB. For now hardcode or infer.
    // Let's assume metadata or price lookup.
    // For simplicity, let's assume standard/pro price IDs are in env.

    const priceId = subscription.items.data[0].price.id;
    let tier = 'free';
    if (priceId === process.env.STRIPE_PRICE_STANDARD) tier = 'standard';
    if (priceId === process.env.STRIPE_PRICE_PRO) tier = 'pro';

    await query(
        `UPDATE subscriptions 
         SET stripe_subscription_id = $1, tier = $2, status = $3, current_period_end = to_timestamp($4)
         WHERE stripe_customer_id = $5`,
        [subscription.id, tier, subscription.status, subscription.current_period_end, customerId]
    );
}
