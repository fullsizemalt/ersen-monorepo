import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface UseIntegrationResult {
    connected: boolean;
    loading: boolean;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useIntegration(provider: string): UseIntegrationResult {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/integrations/${provider}/status`);
            setConnected(data.connected);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to check integration status');
            setConnected(false);
        } finally {
            setLoading(false);
        }
    }, [provider]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    // Check for OAuth callback params in URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const integrationSuccess = params.get('integration_success');
        const integrationError = params.get('integration_error');

        if (integrationSuccess === provider) {
            setConnected(true);
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
        }

        if (integrationError) {
            setError(decodeURIComponent(integrationError));
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [provider]);

    const connect = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/integrations/${provider}/authorize`);
            // Redirect to OAuth provider
            window.location.href = data.authUrl;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to start connection');
            setLoading(false);
        }
    };

    const disconnect = async () => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/integrations/${provider}`);
            setConnected(false);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to disconnect');
        } finally {
            setLoading(false);
        }
    };

    return {
        connected,
        loading,
        error,
        connect,
        disconnect,
        refresh: checkStatus,
    };
}

// Hook to get all user integrations
export function useIntegrations(): {
    integrations: string[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
} {
    const [integrations, setIntegrations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchIntegrations = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/integrations');
            setIntegrations(data.integrations || []);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch integrations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIntegrations();
    }, [fetchIntegrations]);

    return { integrations, loading, error, refresh: fetchIntegrations };
}
