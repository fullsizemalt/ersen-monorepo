const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function upgrade() {
    const client = await pool.connect();
    try {
        console.log('Upgrading Dev User to Pro...');

        // Get user ID
        const userRes = await client.query("SELECT id FROM users WHERE email = 'dev@example.com'");
        if (userRes.rows.length === 0) {
            console.error('Dev user not found!');
            return;
        }
        const userId = userRes.rows[0].id;

        // Update subscription
        await client.query(
            "INSERT INTO subscriptions (user_id, tier, status) VALUES ($1, 'pro', 'active') ON CONFLICT (user_id) DO UPDATE SET tier = 'pro', status = 'active'",
            [userId]
        );

        console.log('Successfully upgraded Dev User to Pro tier!');
    } catch (err) {
        console.error('Upgrade failed', err);
    } finally {
        client.release();
        await pool.end();
    }
}

upgrade();
