import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Manually parse the connection string to handle special characters in password
let poolConfig: any;
try {
    const url = new URL(process.env.DATABASE_URL!);
    poolConfig = {
        user: url.username,
        password: decodeURIComponent(url.password),
        host: url.hostname,
        port: parseInt(url.port),
        database: url.pathname.split('/')[1],
        ssl: false // Internal Docker network connection
    };
} catch (e) {
    console.error('Failed to parse DATABASE_URL with URL API, attempting regex fallback:', e);
    // Fallback for unencoded passwords: postgresql://user:password@host:port/database
    const match = process.env.DATABASE_URL?.match(/postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+)/);
    if (match) {
        poolConfig = {
            user: match[1],
            password: match[2], // Take the raw password
            host: match[3],
            port: parseInt(match[4]),
            database: match[5],
            ssl: false // Internal Docker network connection
        };
        console.log('DEBUG: Using regex fallback for DB connection');
    } else {
        console.error('Regex fallback failed. Using raw connection string.');
        poolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: false
        };
    }
}

console.log('DEBUG: Pool config created with user:', poolConfig?.user || 'unknown', 'host:', poolConfig?.host || 'unknown');
const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
