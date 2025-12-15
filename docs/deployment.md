# Deployment Guide

## Prerequisites
- VPS with Ubuntu 20.04+ (or similar)
- Docker and Docker Compose installed
- Domain name pointed to VPS IP
- Stripe Account (for payments)
- WorkOS Account (for auth)

## Environment Variables
Ensure the following environment variables are set in your `.env` file on the server:

```env
# Backend
PORT=3000
DATABASE_URL=postgresql://user:password@db:5432/daemon
JWT_SECRET=your_jwt_secret
FRONTEND_URL=https://your-domain.com
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STANDARD=price_...
STRIPE_PRICE_PRO=price_...

# Frontend (Build time)
VITE_API_URL=https://your-domain.com/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
```

## Deployment Steps

1. **Clone the Repository**
   ```bash
   git clone <your-repo-url>
   cd DAEMON2
   ```

2. **Build and Run with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

3. **Database Migration**
   The application should automatically migrate on start, but you can manually seed widgets:
   ```bash
   docker-compose exec backend node scripts/seed.js
   ```

4. **Nginx Configuration (Optional but Recommended)**
   Set up Nginx as a reverse proxy to handle SSL and route traffic to port 3000 (backend) and 80 (frontend).

## Webhooks
- **Stripe**: Configure the webhook URL to `https://your-domain.com/api/subscriptions/webhook` and select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
- **WorkOS**: Configure redirect URI to `https://your-domain.com/api/auth/callback`.

## Troubleshooting
- Check logs: `docker-compose logs -f`
- Database access: `docker-compose exec db psql -U user -d daemon`
