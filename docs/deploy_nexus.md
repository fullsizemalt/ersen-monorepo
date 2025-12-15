# Deployment to nexus-vector

## Step 1: Create Repository on Forgejo

1. Go to https://git.runfoo.run
2. Create a new repository named `daemon`
3. Copy the repository URL (e.g., `https://git.runfoo.run/malty/daemon.git`)

## Step 2: Push Code to Forgejo

```bash
cd /Users/ten/ANTIGRAVITY/DAEMON2
git remote add forgejo https://git.runfoo.run/YOUR_USERNAME/daemon.git
git push forgejo master
```

## Step 3: Deploy on nexus-vector

SSH into nexus-vector:
```bash
ssh admin@nexus-vector
```

Clone the repository:
```bash
cd /srv/containers
git clone https://git.runfoo.run/YOUR_USERNAME/daemon.git
cd daemon
```

Create `.env` file:
```bash
nano .env
```

Paste the following (update with real values):
```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_min_32_chars
FRONTEND_URL=https://daemon.runfoo.run
VITE_API_URL=https://daemon.runfoo.run/api

# WorkOS - Get from https://dashboard.workos.com
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...

# Stripe - Get from https://dashboard.stripe.com
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STANDARD=price_...
STRIPE_PRICE_PRO=price_...
```

Deploy with Docker Compose:
```bash
docker-compose up -d --build
```

## Step 4: Configure Traefik

Create Traefik labels file at `/srv/containers/daemon/docker-compose.override.yml`:

```yaml
version: '3.8'

services:
  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.daemon.rule=Host(`daemon.runfoo.run`)"
      - "traefik.http.routers.daemon.entrypoints=websecure"
      - "traefik.http.routers.daemon.tls.certresolver=letsencrypt"
      - "traefik.http.services.daemon.loadbalancer.server.port=80"
    networks:
      - traefik-public
      - daemon-network

networks:
  traefik-public:
    external: true
  daemon-network:
    driver: bridge
```

Restart:
```bash
docker-compose up -d
```

## Step 5: Update Mobile App

Update the Capacitor config to point to production:
```typescript
// frontend/capacitor.config.ts
server: {
  url: 'https://daemon.runfoo.run',
  cleartext: false
}
```

Rebuild and reinstall the Android app.

## Monitoring

View logs:
```bash
docker-compose logs -f
```

Check status:
```bash
docker-compose ps
```
