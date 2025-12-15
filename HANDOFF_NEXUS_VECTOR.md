# DAEMON v2 Deployment Handoff - Nexus Vector Agent

## Current Status

**Backend:** ✅ Running and healthy on port 3000  
**Database:** ✅ Connected and seeded  
**Frontend:** ✅ Built and running  
**Issue:** ❌ Traefik not routing `/api/*` requests to backend (returns 404)

## Problem Summary

The DAEMON v2 application is deployed at `/srv/containers/daemon` on nexus-vector. The backend container is running successfully, but Traefik is not routing API requests to it. The issue is that the backend container is NOT connected to the `traefik-public` network, which prevents Traefik from discovering and routing to it.

## Immediate Fix Required

### Step 1: Connect Backend to Traefik Network

```bash
cd /srv/containers/daemon
docker network connect traefik-public daemon-backend-1
docker network connect traefik-public daemon-frontend-1
```

### Step 2: Restart Traefik

```bash
docker restart traefik
```

### Step 3: Verify Network Connectivity

```bash
# Check backend is on both networks
docker inspect daemon-backend-1 | grep -A 30 Networks

# Should show BOTH:
# - daemon_daemon-network
# - traefik-public
```

### Step 4: Test API Endpoint

```bash
curl -I https://daemon.runfoo.run/api/auth/login?provider=google
# Should return: HTTP/2 302 (redirect to WorkOS)
# NOT: HTTP/2 404
```

## Environment Details

### File Locations
- **Deployment Directory:** `/srv/containers/daemon`
- **Docker Compose:** `/srv/containers/daemon/docker-compose.yml`
- **Environment File:** `/srv/containers/daemon/.env`

### Container Names
- `daemon-db-1` - PostgreSQL database
- `daemon-backend-1` - Express API server (port 3000)
- `daemon-frontend-1` - React SPA (nginx on port 80)

### Networks
- `daemon_daemon-network` - Internal communication between services
- `traefik-public` - External network for Traefik routing (REQUIRED)

### Environment Variables (in .env)
```bash
FRONTEND_URL=https://daemon.runfoo.run
BACKEND_URL=https://daemon.runfoo.run
VITE_API_URL=https://daemon.runfoo.run/api
WORKOS_API_KEY=sk_test_REDACTED
WORKOS_CLIENT_ID=client_01KB49R9E3YEQ12GB6FQZFRTP2
DB_PASSWORD=yl5nWkbyF+DhYQ+ZnFdtN/wnzcglEDa+q+rjC0nXXEc=
JWT_SECRET=iYmp+BAkhyVIpygJI7/3fxeoe9O7STVPJl68cn27ibOokYhjuOnDiYZDVT87Hixi
```

## Traefik Configuration

The `docker-compose.yml` has the following Traefik labels:

### Backend Labels
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=traefik-public"
  - "traefik.http.routers.daemon-api.rule=Host(`daemon.runfoo.run`) && PathPrefix(`/api`, `/auth`)"
  - "traefik.http.routers.daemon-api.entrypoints=websecure"
  - "traefik.http.routers.daemon-api.tls.certresolver=myresolver"
  - "traefik.http.services.daemon-api.loadbalancer.server.port=3000"
```

### Frontend Labels
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.docker.network=traefik-public"
  - "traefik.http.routers.daemon-web.rule=Host(`daemon.runfoo.run`) && !PathPrefix(`/api`, `/auth`)"
  - "traefik.http.routers.daemon-web.entrypoints=websecure"
  - "traefik.http.routers.daemon-web.tls.certresolver=myresolver"
  - "traefik.http.services.daemon-web.loadbalancer.server.port=80"
```

## Known Issues & Fixes Applied

### 1. Database Password with Special Characters
**Issue:** The auto-generated password contains `+`, `/`, `=` which breaks URL parsing  
**Fix Applied:** Modified `migrate.js`, `seed.js`, and `src/config/db.ts` to use regex fallback parsing

### 2. SSL Connection Error
**Issue:** PostgreSQL doesn't support SSL in Docker network  
**Fix Applied:** Set `ssl: false` in all database connection configs

### 3. Container Recreation
**Issue:** `docker compose up -d` doesn't always recreate containers when network config changes  
**Solution:** Use `docker compose up -d --force-recreate` or manually connect networks

## Verification Checklist

After applying the fix, verify:

- [ ] Backend container connected to `traefik-public` network
- [ ] Frontend container connected to `traefik-public` network
- [ ] Traefik restarted and recognizing services
- [ ] `curl https://daemon.runfoo.run/api/auth/login?provider=google` returns 302 redirect
- [ ] Frontend loads at `https://daemon.runfoo.run`
- [ ] Login buttons redirect to WorkOS

## Troubleshooting Commands

### Check Container Status
```bash
docker ps | grep daemon
docker logs daemon-backend-1 --tail 50
docker logs daemon-frontend-1 --tail 50
```

### Check Networks
```bash
docker network ls
docker network inspect traefik-public
docker network inspect daemon_daemon-network
```

### Check Traefik Routing
```bash
docker logs traefik --tail 100
# Look for daemon-api and daemon-web router registrations
```

### Manual Network Connection (if needed)
```bash
# If containers were recreated and lost network connection
docker network connect traefik-public daemon-backend-1
docker network connect traefik-public daemon-frontend-1
docker restart traefik
```

### Force Full Restart
```bash
cd /srv/containers/daemon
docker compose down
docker compose up -d
# Then manually connect networks as shown above
```

## Expected Behavior After Fix

1. **Frontend:** `https://daemon.runfoo.run` → React app loads
2. **API Health:** `https://daemon.runfoo.run/api/auth/login?provider=google` → 302 redirect to WorkOS
3. **Login Flow:** Click "Continue with Google" → Redirects to WorkOS → Returns to dashboard
4. **Backend Logs:** Morgan logs show incoming requests

## WorkOS Configuration

The backend is configured with WorkOS Standalone SSO:
- **Provider:** GoogleOAuth, GitHubOAuth (AppleOAuth disabled in UI)
- **Redirect URI:** `https://daemon.runfoo.run/api/auth/callback`
- **GitHub OAuth Callback:** `https://auth.workos.com/sso/oauth/github/BbgrrMcvLh6seRx4YuCP5NkKh/callback`

User needs to configure GitHub OAuth credentials in WorkOS Dashboard if not already done.

## Contact Information

If you encounter issues:
1. Check backend logs for database connection errors
2. Check Traefik logs for routing issues
3. Verify all containers are on `traefik-public` network
4. Ensure `.env` file has correct values

## Notes for Future Deployments

To avoid this issue in future deployments:
1. Always use `docker compose up -d --force-recreate` when changing network configuration
2. Verify network connectivity with `docker inspect` before testing
3. Check Traefik logs to confirm router registration
4. The `docker-compose.yml` in the repo is correct - the issue was runtime network connectivity, not configuration
