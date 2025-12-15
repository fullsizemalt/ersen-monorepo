#!/bin/bash

# DAEMON 2.0 Deployment Script for nexus-vector
# This script will deploy DAEMON 2.0 to replace v1 at daemon.runfoo.run

set -e

echo "🚀 DAEMON 2.0 Deployment Script"
echo "================================"
echo ""

# Step 1: Create repo on Forgejo (manual step)
echo "📝 Step 1: Create Repository on Forgejo"
echo "   1. Go to https://git.runfoo.run"
echo "   2. Click 'New Repository'"
echo "   3. Name it 'daemon'"
echo "   4. Click 'Create Repository'"
echo ""
read -p "Press Enter when you've created the repository..."

# Step 2: Push code
echo ""
echo "📤 Step 2: Pushing code to Forgejo..."
git remote add forgejo https://git.runfoo.run/malty/daemon.git 2>/dev/null || git remote set-url forgejo https://git.runfoo.run/malty/daemon.git
git push forgejo master

# Step 3: SSH into nexus-vector and deploy
echo ""
echo "🔧 Step 3: Deploying to nexus-vector..."
echo ""

ssh admin@nexus-vector << 'ENDSSH'
set -e

# Stop and remove old v1
echo "Stopping old DAEMON v1..."
cd /srv/containers/daemon
docker-compose down
cd ..
mv daemon daemon-v1-backup

# Clone new v2
echo "Cloning DAEMON 2.0..."
git clone https://git.runfoo.run/malty/daemon.git
cd daemon

# Create .env file
echo "Creating .env file..."
cat > .env << 'EOF'
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 48)
FRONTEND_URL=https://daemon.runfoo.run
BACKEND_URL=https://daemon.runfoo.run
VITE_API_URL=https://daemon.runfoo.run/api

# WorkOS Credentials
WORKOS_API_KEY=sk_test_REDACTED
WORKOS_CLIENT_ID=client_01KB49R9E3YEQ12GB6FQZFRTP2

# TODO: Add your Stripe credentials  
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STANDARD=price_...
STRIPE_PRICE_PRO=price_...
EOF

echo "⚠️  IMPORTANT: Edit /srv/containers/daemon/.env and add your WorkOS and Stripe credentials"
echo ""

# Build and start
echo "Building and starting containers..."
docker-compose up -d --build

echo ""
echo "✅ Deployment complete!"
echo "   - Frontend: https://daemon.runfoo.run"
echo "   - Backend API: https://daemon.runfoo.run/api"
echo ""
echo "📋 Next steps:"
echo "   1. Edit /srv/containers/daemon/.env with real credentials"
echo "   2. Restart: docker-compose restart"
echo "   3. Check logs: docker-compose logs -f"
ENDSSH

echo ""
echo "🎉 DAEMON 2.0 is now deployed!"
echo ""
echo "📱 To update the mobile app:"
echo "   1. Update frontend/capacitor.config.ts to use https://daemon.runfoo.run"
echo "   2. Rebuild: cd frontend/android && ./gradlew bundleRelease"
echo "   3. Reinstall: bash /Users/ten/ANTIGRAVITY/DAEMON2/scripts/install_aab.sh"
