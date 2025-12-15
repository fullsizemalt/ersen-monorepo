import { query } from '../config/db';

// OAuth provider configurations
const OAUTH_PROVIDERS: Record<string, {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scopes: string[];
}> = {
    spotify: {
        authUrl: 'https://accounts.spotify.com/authorize',
        tokenUrl: 'https://accounts.spotify.com/api/token',
        clientId: process.env.SPOTIFY_CLIENT_ID || '',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
        scopes: ['user-read-currently-playing', 'user-read-playback-state', 'user-top-read'],
    },
    github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        scopes: ['read:user', 'repo'],
    },
    google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/gmail.readonly'],
    },
};


const REDIRECT_BASE = process.env.BACKEND_URL || process.env.FRONTEND_URL || 'http://localhost:3000';


export const getProviderAuthUrl = (provider: string, userId: number): string => {
    const config = OAUTH_PROVIDERS[provider];
    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    const state = Buffer.from(JSON.stringify({ userId, provider })).toString('base64');
    const redirectUri = `${REDIRECT_BASE}/api/integrations/${provider}/callback`;

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: config.scopes.join(' '),
        state,
    });

    // Provider-specific params
    if (provider === 'google') {
        params.set('access_type', 'offline');
        params.set('prompt', 'consent');
    }

    return `${config.authUrl}?${params.toString()}`;
};

export const exchangeCodeForTokens = async (
    provider: string,
    code: string
): Promise<{ accessToken: string; refreshToken?: string; expiresIn?: number }> => {
    const config = OAUTH_PROVIDERS[provider];
    if (!config) {
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }

    const redirectUri = `${REDIRECT_BASE}/api/integrations/${provider}/callback`;

    const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
    });

    const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        },
        body: body.toString(),
    });

    const data = await response.json() as {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
        error?: string;
        error_description?: string;
    };

    if (data.error) {
        throw new Error(`OAuth error: ${data.error_description || data.error}`);
    }

    return {
        accessToken: data.access_token || '',
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
    };
};

export const saveIntegration = async (
    userId: number,
    provider: string,
    accessToken: string,
    refreshToken?: string,
    expiresIn?: number
): Promise<void> => {
    const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000)
        : null;

    await query(
        `INSERT INTO integrations (user_id, provider, access_token, refresh_token, expires_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, provider) DO UPDATE
         SET access_token = $3, refresh_token = COALESCE($4, integrations.refresh_token), expires_at = $5`,
        [userId, provider, accessToken, refreshToken, expiresAt]
    );
};

export const getIntegration = async (
    userId: number,
    provider: string
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date } | null> => {
    const { rows } = await query(
        `SELECT access_token, refresh_token, expires_at FROM integrations WHERE user_id = $1 AND provider = $2`,
        [userId, provider]
    );

    if (rows.length === 0) return null;

    return {
        accessToken: rows[0].access_token,
        refreshToken: rows[0].refresh_token,
        expiresAt: rows[0].expires_at,
    };
};

export const deleteIntegration = async (userId: number, provider: string): Promise<void> => {
    await query(`DELETE FROM integrations WHERE user_id = $1 AND provider = $2`, [userId, provider]);
};

export const getUserIntegrations = async (userId: number): Promise<string[]> => {
    const { rows } = await query(
        `SELECT provider FROM integrations WHERE user_id = $1`,
        [userId]
    );
    return rows.map(r => r.provider);
};

export const refreshAccessToken = async (
    userId: number,
    provider: string
): Promise<string | null> => {
    const integration = await getIntegration(userId, provider);
    if (!integration || !integration.refreshToken) return null;

    const config = OAUTH_PROVIDERS[provider];
    if (!config) return null;

    const body = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: integration.refreshToken,
    });

    try {
        const response = await fetch(config.tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
            body: body.toString(),
        });

        const data = await response.json() as {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
            error?: string;
        };
        if (data.error) return null;

        await saveIntegration(
            userId,
            provider,
            data.access_token || '',
            data.refresh_token,
            data.expires_in
        );

        return data.access_token || null;
    } catch {
        return null;
    }
};
