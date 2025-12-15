import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    name: string;
    avatar_url: string;
    tier: 'free' | 'standard' | 'pro';
    role?: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (provider?: string) => void;
    devLogin: () => Promise<void>;
    localDevBypass: () => void;
    logout: () => void;
}

// Mock user for frontend-only development (no backend needed)
const MOCK_DEV_USER: User = {
    id: 1,
    email: 'dev@daemon.local',
    name: 'Dev User',
    avatar_url: '',
    tier: 'pro', // Pro tier to see all widgets
    role: 'admin',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        // Check for local dev bypass first
        const localBypass = localStorage.getItem('daemon_dev_bypass');
        if (localBypass === 'true') {
            console.log('🔧 Dev bypass active - using mock user');
            setUser(MOCK_DEV_USER);
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (provider: string = 'google') => {
        window.location.href = `/api/auth/login?provider=${provider}`;
    };

    const devLogin = async () => {
        try {
            const { data } = await api.post('/auth/dev-login');
            if (data.success) {
                // Refresh user data
                await checkAuth();
            }
        } catch (error) {
            console.error('Dev login failed', error);
        }
    };

    /**
     * Frontend-only dev bypass - works without backend
     * Sets a mock user directly in state
     */
    const localDevBypass = () => {
        console.log('🔧 Activating local dev bypass');
        localStorage.setItem('daemon_dev_bypass', 'true');
        setUser(MOCK_DEV_USER);
    };

    const logout = async () => {
        // Clear local bypass
        localStorage.removeItem('daemon_dev_bypass');

        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Backend might not be running, that's ok
            console.log('Logout request failed (backend may be offline)');
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, devLogin, localDevBypass, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
