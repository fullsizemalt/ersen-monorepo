import { Router, Request, Response } from 'express';
import {
    getProviderAuthUrl,
    exchangeCodeForTokens,
    saveIntegration,
    deleteIntegration,
    getUserIntegrations,
    getIntegration,
    refreshAccessToken,
} from '../services/oauth.service';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Get user's connected integrations
router.get('/', requireAuth, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const integrations = await getUserIntegrations(userId);
        res.json({ integrations });
    } catch (error) {
        console.error('Error fetching integrations:', error);
        res.status(500).json({ error: 'Failed to fetch integrations' });
    }
});

// Check if specific provider is connected
router.get('/:provider/status', requireAuth, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { provider } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const integration = await getIntegration(userId, provider);
        res.json({ connected: !!integration });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check integration status' });
    }
});

// Start OAuth flow
router.get('/:provider/authorize', requireAuth, (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { provider } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const authUrl = getProviderAuthUrl(provider, userId);
        res.json({ authUrl });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

// OAuth callback
router.get('/:provider/callback', async (req: Request, res: Response) => {
    const { provider } = req.params;
    const { code, state, error } = req.query;

    if (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?integration_error=${error}`);
    }

    if (!code || !state) {
        return res.redirect(`${process.env.FRONTEND_URL}/dashboard?integration_error=missing_params`);
    }

    try {
        const stateData = JSON.parse(Buffer.from(state as string, 'base64').toString());
        const { userId } = stateData;

        const tokens = await exchangeCodeForTokens(provider, code as string);
        await saveIntegration(userId, provider, tokens.accessToken, tokens.refreshToken, tokens.expiresIn);

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?integration_success=${provider}`);
    } catch (error: any) {
        console.error('OAuth callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?integration_error=${encodeURIComponent(error.message)}`);
    }
});

// Disconnect integration
router.delete('/:provider', requireAuth, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;
    const { provider } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        await deleteIntegration(userId, provider);
        res.json({ message: `Disconnected from ${provider}` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to disconnect integration' });
    }
});

// Spotify: Get currently playing track
router.get('/spotify/now-playing', requireAuth, async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        let integration = await getIntegration(userId, 'spotify');
        if (!integration) {
            return res.status(404).json({ error: 'Spotify not connected' });
        }

        // Check if token needs refresh
        if (integration.expiresAt && new Date(integration.expiresAt) < new Date()) {
            const newToken = await refreshAccessToken(userId, 'spotify');
            if (!newToken) {
                return res.status(401).json({ error: 'Failed to refresh token' });
            }
            integration = await getIntegration(userId, 'spotify');
        }

        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${integration!.accessToken}`,
            },
        });

        if (response.status === 204) {
            return res.json({ is_playing: false });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Spotify API error' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Spotify now-playing error:', error);
        res.status(500).json({ error: 'Failed to fetch playback' });
    }
});

export default router;
