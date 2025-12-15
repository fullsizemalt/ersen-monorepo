# Post-Deployment Configuration Guide

## Step 1: Configure Environment Variables on nexus-vector

SSH into nexus-vector:
```bash
ssh admin@nexus-vector
cd /srv/containers/daemon
nano .env
```

Update the following values:

### WorkOS Configuration
1. Go to https://dashboard.workos.com
2. Create a new project or select existing
3. Get your API Key and Client ID
4. Update in `.env`:
```env
WORKOS_API_KEY=sk_live_YOUR_KEY_HERE
WORKOS_CLIENT_ID=client_YOUR_ID_HERE
```

### Stripe Configuration
1. Go to https://dashboard.stripe.com
2. Get your Secret Key from Developers > API Keys
3. Create webhook endpoint at https://daemon.runfoo.run/api/subscriptions/webhook
4. Get webhook secret
5. Create products and get price IDs
6. Update in `.env`:
```env
STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
STRIPE_PRICE_STANDARD=price_YOUR_STANDARD_PRICE_ID
STRIPE_PRICE_PRO=price_YOUR_PRO_PRICE_ID
```

After editing, restart:
```bash
docker-compose restart
```

## Step 2: Set Up Forgejo Actions Secrets

1. Go to https://git.runfoo.run/malty/daemon/settings/secrets
2. Add the following secrets:
   - `DEPLOY_HOST`: `nexus-vector` (or IP address)
   - `DEPLOY_USER`: `admin`
   - `DEPLOY_KEY`: Your SSH private key (paste entire key)

To get your SSH key:
```bash
cat ~/.ssh/id_rsa
```

## Step 3: Rebuild and Deploy Mobile App

### Build the production AAB:
```bash
cd /Users/ten/ANTIGRAVITY/DAEMON2/frontend
npx cap sync android
cd android
./gradlew bundleRelease
```

### Install on your phone:
```bash
cd /Users/ten/ANTIGRAVITY/DAEMON2
bash scripts/install_aab.sh
```

## Step 4: Verify Deployment

### Check the web app:
Open https://daemon.runfoo.run in your browser

### Check logs:
```bash
ssh admin@nexus-vector
cd /srv/containers/daemon
docker-compose logs -f
```

### Test the mobile app:
1. Open DAEMON app on your phone
2. Try the Dev Login
3. Test widget installation
4. Verify Pro features

## Step 5: Configure WorkOS Redirect URI

In WorkOS dashboard:
1. Go to Redirects
2. Add: `https://daemon.runfoo.run/api/auth/callback`

## Step 6: Configure Stripe Webhook

In Stripe dashboard:
1. Go to Developers > Webhooks
2. Add endpoint: `https://daemon.runfoo.run/api/subscriptions/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Troubleshooting

### App shows blank screen:
- Check that containers are running: `docker-compose ps`
- Check logs: `docker-compose logs frontend`
- Verify Traefik routing: `docker logs traefik`

### Database errors:
- Check connection: `docker-compose exec db psql -U daemon -d daemon`
- Run migrations: `docker-compose exec backend npm run db:migrate`
- Seed data: `docker-compose exec backend npm run db:seed`

### Mobile app can't connect:
- Verify you're on Tailscale or same network
- Check API URL in browser: https://daemon.runfoo.run/api/auth/me
- Clear app data and reinstall

## Future Deployments

Once CI/CD is configured, simply:
```bash
git push forgejo master
```

The Forgejo Actions workflow will automatically deploy to nexus-vector!
