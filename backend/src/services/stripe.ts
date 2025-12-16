import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16', // Use latest API version
});

export const createCheckoutSession = async (customerId: string, priceId: string, successUrl: string, cancelUrl: string) => {
    return stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
    });
};

export const createCustomer = async (email: string, name: string) => {
    return stripe.customers.create({
        email,
        name,
    });
};

export const createPortalSession = async (customerId: string, returnUrl: string) => {
    return stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });
};

// Coupon Management
export const listCoupons = async (limit = 10) => {
    return stripe.coupons.list({ limit });
};

export const createCoupon = async (params: Stripe.CouponCreateParams) => {
    return stripe.coupons.create(params);
};

export const deleteCoupon = async (couponId: string) => {
    return stripe.coupons.del(couponId);
};

export const applyCouponToCustomer = async (customerId: string, couponId: string) => {
    return stripe.customers.update(customerId, {
        coupon: couponId
    });
};

export const getSubscription = async (subscriptionId: string) => {
    return stripe.subscriptions.retrieve(subscriptionId);
};

export default stripe;
