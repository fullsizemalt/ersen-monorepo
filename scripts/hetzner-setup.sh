#!/bin/bash
# Ersen Production Setup Script for Hetzner VPS

set -e

echo "=== Ersen Production Setup ==="

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 
   exit 1
fi

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
fi

# Install Docker Compose plugin if not present
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    apt install -y docker-compose-plugin
fi

# Create application directory
APP_DIR="/srv/containers/ersen"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone repo if not present
if [ ! -d ".git" ]; then
    echo "Cloning repository..."
    git clone https://github.com/fullsizemalt/ersen-monorepo.git .
fi

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')
    JWT_SECRET=$(openssl rand -hex 32)
    
    cat > .env << EOF
# Generated $(date)
DB_PASSWORD=$DB_PASSWORD
JWT_SECRET=$JWT_SECRET
ACME_EMAIL=admin@ersen.xyz

# Add these manually:
# WORKOS_API_KEY=
# WORKOS_CLIENT_ID=
# STRIPE_SECRET_KEY=
# STRIPE_PRICE_STANDARD=
# STRIPE_PRICE_PRO=
EOF
    
    echo "Created .env file - please add remaining secrets!"
fi

# Build and start
echo "Building containers..."
docker compose -f docker-compose.prod.yml build

echo "Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo ""
echo "=== Setup Complete ==="
echo "Services starting at:"
echo "  Frontend: https://ersen.xyz"
echo "  API:      https://api.ersen.xyz"
echo ""
echo "Next steps:"
echo "  1. Point ersen.xyz and api.ersen.xyz DNS to this server's IP"
echo "  2. Edit .env and add WorkOS/Stripe secrets"
echo "  3. docker compose -f docker-compose.prod.yml restart"
