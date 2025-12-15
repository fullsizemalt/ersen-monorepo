import { WorkOS } from '@workos-inc/node';
import dotenv from 'dotenv';

dotenv.config();

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID || '';

export const getAuthorizationUrl = (provider: string = 'google') => {
    return workos.sso.getAuthorizationUrl({
        clientId,
        redirectUri: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/api/auth/callback`,
        provider,
    });
};

export const getProfileFromCode = async (code: string) => {
    const { profile } = await workos.sso.getProfileAndToken({
        clientId,
        code,
    });
    return profile;
};

export const getLogoutUrl = (sessionId: string) => {
    return workos.userManagement.getLogoutUrl({ sessionId });
}
