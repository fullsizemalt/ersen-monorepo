# WorkOS SSO Integration Specification

## Overview

**WorkOS** provides enterprise-grade authentication with minimal code. Instead of managing multiple OAuth providers, email verification, and enterprise SAML configurations, WorkOS handles everything through a single unified API.

---

## Why WorkOS?

### vs Custom OAuth
| Feature | Custom OAuth | WorkOS |
|---------|--------------|--------|
| Google Login | 50+ lines | 5 lines |
| GitHub Login | 50+ lines | 5 lines |
| Magic Links | 200+ lines | 5 lines |
| Enterprise SSO (SAML) | Not feasible | Built-in |
| User Management | Custom DB + code | Dashboard included |
| Session Management | Roll your own | Managed |
| Security Audits | Your responsibility | SOC 2 certified |

### vs Other Auth Providers
- **Auth0**: $240/month for 1000 MAUs, complex pricing
- **WorkOS**: $0 for up to 1M MAUs, simple pricing
- **Clerk**: Good for consumer apps, limited enterprise features
- **WorkOS**: Built for B2B SaaS, enterprise-first

---

## Setup

### 1. Install SDK

```bash
npm install @workos-inc/node
```

### 2. Environment Variables

```bash
# .env
WORKOS_API_KEY=sk_live_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://daemon.runfoo.run/auth/callback
```

### 3. Initialize WorkOS

```typescript
// src/lib/workos.ts
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(process.env.WORKOS_API_KEY);

export const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;
export const WORKOS_REDIRECT_URI = process.env.WORKOS_REDIRECT_URI;
```

---

## Authentication Flows

### Flow 1: Google OAuth

**Login Button (Frontend)**:
```tsx
// src/components/Login.tsx
export const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-btn">
      <GoogleIcon />
      Continue with Google
    </button>
  );
};
```

**Backend Routes**:
```typescript
// backend/src/routes/auth.ts
import { workos, WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI } from '../lib/workos';

// Redirect to Google
app.get('/auth/google', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'GoogleOAuth',
    redirectUri: WORKOS_REDIRECT_URI,
    clientId: WORKOS_CLIENT_ID
  });

  res.redirect(authorizationUrl);
});

// Handle callback
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const { user } = await workos.userManagement.authenticateWithCode({
      code: code as string,
      clientId: WORKOS_CLIENT_ID
    });

    // Create or update user in database
    const dbUser = await db.users.upsert({
      where: { email: user.email },
      update: {
        name: `${user.firstName} ${user.lastName}`,
        avatar_url: user.profilePictureUrl,
        updated_at: new Date()
      },
      create: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        avatar_url: user.profilePictureUrl,
        workos_id: user.id
      }
    });

    // Create session
    const session = await createSession(dbUser.id);

    // Set cookie
    res.cookie('session_token', session.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Auth error:', error);
    res.redirect('/login?error=authentication_failed');
  }
});
```

---

## Migration from Current Auth

### Step 1: Install WorkOS Alongside Current Auth
```typescript
// Keep existing auth working
app.post('/auth/login', existingLoginHandler);

// Add WorkOS routes
app.get('/auth/google', workosGoogleHandler);
app.get('/auth/callback', workosCallbackHandler);
```

### Step 2: Add "Continue with Google" Button
```tsx
<button onClick={() => window.location.href = '/auth/google'}>
  Continue with Google
</button>
```

**Timeline**: 1-2 days for full implementation

**Status**: Ready to implement ✅
