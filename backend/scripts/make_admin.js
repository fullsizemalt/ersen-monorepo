const { Pool } = require('pg');
const path = require('path');
try { require('dotenv').config({ path: path.join(__dirname, '../.env') }); } catch (e) { }

// Handle special characters in password (same logic as migrate.js)
let poolConfig;
try {
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
        user: url.username,
        password: decodeURIComponent(url.password),
        host: url.hostname,
        port: url.port,
        database: url.pathname.split('/')[1],
        ssl: false
    };
};
} catch (e) {
    const match = process.env.DATABASE_URL.match(/postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
        poolConfig = {
            user: match[1],
            password: match[2],
            host: match[3],
            port: parseInt(match[4]),
            database: match[5],
            ssl: false
        };
    } else {
        poolConfig = { connectionString: process.env.DATABASE_URL };
    }
}

const pool = new Pool(poolConfig);

async function makeAdmin() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address: node scripts/make_admin.js <email>');
        process.exit(1);
    }

    const client = await pool.connect();
    try {
        console.log(`Promoting ${email} to Admin...`);

        const res = await client.query(
            "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *",
            [email]
        );

        if (res.rows.length === 0) {
            console.error('User not found!');
        } else {
            console.log(`Successfully promoted ${res.rows[0].name} (${email}) to Admin!`);
        }
    } catch (err) {
        console.error('Operation failed', err);
    } finally {
        client.release();
        await pool.end();
    }
}

makeAdmin();
