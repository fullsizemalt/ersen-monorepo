const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

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

console.log('DEBUG: Pool config created. Initializing pool...');
const pool = new Pool(poolConfig);
console.log('DEBUG: Pool initialized.');

const widgets = [
    // Free Tier (12 Widgets)
    { slug: 'clock', name: 'Clock', tier: 'free', description: 'Digital clock with date' },
    { slug: 'task-manager', name: 'Task Manager', tier: 'free', description: 'Simple todo list' },
    { slug: 'sticky-notes', name: 'Sticky Notes', tier: 'free', description: 'Quick notes' },
    { slug: 'weather', name: 'Weather', tier: 'free', description: 'Local forecast' },
    { slug: 'calculator', name: 'Calculator', tier: 'free', description: 'Basic calculator' },
    { slug: 'pomodoro', name: 'Pomodoro', tier: 'free', description: 'Focus timer' },
    { slug: 'quote', name: 'Daily Quote', tier: 'free', description: 'Inspiration' },
    { slug: 'habit-tracker', name: 'Habit Tracker', tier: 'free', description: 'Track streaks' },
    { slug: 'mood-tracker', name: 'Mood Tracker', tier: 'free', description: 'Log your mood' },
    { slug: 'toybox', name: 'Toybox', tier: 'free', description: 'Fun interactive elements' },
    { slug: 'heatmap', name: 'Activity Heatmap', tier: 'free', description: 'Visualize activity' },
    { slug: 'ai-assistant', name: 'AI Assistant', tier: 'free', description: 'Chat with AI' },

    // Standard Tier
    { slug: 'gmail', name: 'Gmail', tier: 'standard', description: 'View emails' },
    { slug: 'google-calendar', name: 'Google Calendar', tier: 'standard', description: 'Upcoming events' },
    { slug: 'github', name: 'GitHub', tier: 'standard', description: 'PRs and Issues' },
    { slug: 'spotify', name: 'Spotify', tier: 'standard', description: 'Now playing' },
    { slug: 'obsidian', name: 'Obsidian', tier: 'standard', description: 'Note sync' },
    { slug: 'kanban', name: 'Kanban Board', tier: 'standard', description: 'Project management' },
    { slug: 'music-download', name: 'Music Downloader', tier: 'standard', description: 'Get tracks' },
    { slug: 'news-feed', name: 'News Feed', tier: 'standard', description: 'Top headlines' },
    { slug: 'stock-ticker', name: 'Stock Ticker', tier: 'standard', description: 'Market watch' },
    { slug: 'crypto-tracker', name: 'Crypto Tracker', tier: 'standard', description: 'Coin prices' },

    // Pro Tier
    { slug: 'grafana', name: 'Grafana', tier: 'pro', description: 'Metrics dashboard' },
    { slug: 'prometheus', name: 'Prometheus', tier: 'pro', description: 'System monitoring' },
    { slug: 'jellyfin', name: 'Jellyfin', tier: 'pro', description: 'Media server' },
    { slug: 'plex', name: 'Plex', tier: 'pro', description: 'Media streaming' },
    { slug: 'audiobookshelf', name: 'Audiobookshelf', tier: 'pro', description: 'Audiobook player' },
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('Seeding widgets...');
        await client.query('BEGIN');

        for (const w of widgets) {
            await client.query(
                `INSERT INTO widget_templates (slug, name, description, tier, component_key)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (slug) DO UPDATE 
         SET name = $2, description = $3, tier = $4, component_key = $5`,
                [w.slug, w.name, w.description, w.tier, w.slug] // using slug as component_key for now
            );
        }

        await client.query('COMMIT');
        console.log('Seeding completed');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Seeding failed', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
