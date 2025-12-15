
import { query, pool } from '../src/config/db';
import dotenv from 'dotenv';

dotenv.config();

// Mock environment variables for testing
process.env.STRIPE_PRICE_STANDARD = 'price_standard_test';
process.env.STRIPE_PRICE_PRO = 'price_pro_test';

async function updateSubscription(customerId: string, priceId: string, status: string) {
    let tier = 'free';
    if (priceId === process.env.STRIPE_PRICE_STANDARD) tier = 'standard';
    if (priceId === process.env.STRIPE_PRICE_PRO) tier = 'pro';

    console.log(`Updating subscription for customer ${customerId} to tier: ${tier} (Price: ${priceId})`);

    await query(
        `UPDATE subscriptions 
         SET tier = $1, status = $2, current_period_end = NOW() + interval '1 month'
         WHERE stripe_customer_id = $3`,
        [tier, status, customerId]
    );
}

async function runTest() {
    const testUserId = 'test-webhook-user-' + Date.now();
    const testCustomerId = 'cus_test_' + Date.now();

    try {
        console.log('--- Starting Webhook Logic Test ---');

        // 1. Create Test User
        console.log('Creating test user...');
        // We need to insert into users table first. 
        // Assuming users table has id, email, etc.
        // Let's check schema first or just try inserting.
        // Actually, let's just insert into subscriptions if foreign key allows, 
        // but likely we need a user.

        // Let's try to find an existing user or create one.
        // For safety, let's just create a dummy user in users table if possible.
        // If users table is managed by WorkOS sync or similar, we might need to be careful.
        // Let's assume we can insert a dummy user.

        await query(`INSERT INTO users (id, email, name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
            [testUserId, 'test@example.com', 'Test User']);

        // 2. Create Initial Subscription (Free)
        console.log('Creating initial free subscription...');
        await query(
            `INSERT INTO subscriptions (user_id, stripe_customer_id, tier, status)
             VALUES ($1, $2, 'free', 'active')`,
            [testUserId, testCustomerId]
        );

        // 3. Verify Initial State
        let res = await query('SELECT * FROM subscriptions WHERE stripe_customer_id = $1', [testCustomerId]);
        console.log('Initial State:', res.rows[0]);

        if (res.rows[0].tier !== 'free') throw new Error('Initial tier should be free');

        // 4. Simulate Webhook Update (Upgrade to Standard)
        console.log('Simulating upgrade to Standard...');
        await updateSubscription(testCustomerId, 'price_standard_test', 'active');

        // 5. Verify Update
        res = await query('SELECT * FROM subscriptions WHERE stripe_customer_id = $1', [testCustomerId]);
        console.log('Updated State:', res.rows[0]);

        if (res.rows[0].tier !== 'standard') throw new Error('Failed to update to standard tier');

        // 6. Simulate Webhook Update (Upgrade to Pro)
        console.log('Simulating upgrade to Pro...');
        await updateSubscription(testCustomerId, 'price_pro_test', 'active');

        // 7. Verify Update
        res = await query('SELECT * FROM subscriptions WHERE stripe_customer_id = $1', [testCustomerId]);
        console.log('Updated State:', res.rows[0]);

        if (res.rows[0].tier !== 'pro') throw new Error('Failed to update to pro tier');

        console.log('✅ Webhook logic test passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Cleanup
        console.log('Cleaning up...');
        await query('DELETE FROM subscriptions WHERE stripe_customer_id = $1', [testCustomerId]);
        await query('DELETE FROM users WHERE id = $1', [testUserId]);
        await pool.end();
    }
}

runTest();
