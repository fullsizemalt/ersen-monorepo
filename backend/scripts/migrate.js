const fs = require('fs');
const path = require('path');
// Try to load .env if it exists, but don't crash if it doesn't (production relies on container env)
try { require('dotenv').config({ path: path.join(__dirname, '../.env') }); } catch (e) { }
const { Pool } = require('pg');

console.log('DEBUG: Environment keys:', Object.keys(process.env));
console.log('DEBUG: DATABASE_URL is:', process.env.DATABASE_URL);

// Handle special characters in password by letting pg parse it internally or passing as object if needed.
// The issue might be specific to how pg-connection-string handles the complex password.
// Let's try passing the connectionString directly to Pool, which uses pg-connection-string internally.
// If that fails, we might need to URL encode the password.

// Manually parse the connection string to handle special characters in password
let poolConfig;
try {
    const url = new URL(process.env.DATABASE_URL);
    poolConfig = {
        user: url.username,
        password: decodeURIComponent(url.password),
        host: url.hostname,
        port: url.port,
        database: url.pathname.split('/')[1],
        ssl: false // Internal Docker network connection
    };
} catch (e) {
    console.error('Failed to parse DATABASE_URL with URL API, attempting regex fallback:', e);
    // Fallback for unencoded passwords: postgresql://user:password@host:port/database
    const match = process.env.DATABASE_URL.match(/postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
        poolConfig = {
            user: match[1],
            password: match[2], // Take the raw password
            host: match[3],
            port: match[4],
            database: match[5],
            ssl: false // Internal Docker network connection
        };
    } else {
        console.error('Regex fallback failed. Using raw connection string.');
        poolConfig = { connectionString: process.env.DATABASE_URL };
    }
}

const pool = new Pool(poolConfig);

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Running migration...');
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await client.query('BEGIN');
        await client.query(schemaSql);
        await client.query('COMMIT');

        console.log('Migration completed successfully');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Migration failed', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
