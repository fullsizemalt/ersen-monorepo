#!/bin/bash
# Ersen Production Setup Script for Hetzner VPS
# Includes security hardening to match existing ecosystem

set -e

# Configuration
DEPLOY_USER="deploy"
APP_DIR="/srv/containers/ersen"

echo "=== Ersen Production Setup ==="
echo ""

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 
   exit 1
fi

# =====================
# SECURITY HARDENING
# =====================
echo "[1/7] Security hardening..."

# Create deploy user if doesn't exist
if ! id "$DEPLOY_USER" &>/dev/null; then
    echo "Creating deploy user..."
    useradd -m -s /bin/bash "$DEPLOY_USER"
    
    # Copy SSH keys from root
    mkdir -p /home/$DEPLOY_USER/.ssh
    cp ~/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    chmod 700 /home/$DEPLOY_USER/.ssh
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
fi

# Add deploy user to docker group (created later)
usermod -aG docker $DEPLOY_USER 2>/dev/null || true

# Passwordless sudo for deploy user
echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$DEPLOY_USER
chmod 440 /etc/sudoers.d/$DEPLOY_USER

# Harden SSH
echo "Hardening SSH..."
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config

# Restart SSH (don't lock ourselves out)
systemctl restart sshd || systemctl restart ssh

# =====================
# SYSTEM SETUP
# =====================
echo "[2/7] Updating system..."
apt update && apt upgrade -y

# Install essentials
apt install -y curl git ufw fail2ban htop

# =====================
# FIREWALL
# =====================
echo "[3/7] Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# =====================
# FAIL2BAN
# =====================
echo "[4/7] Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# =====================
# DOCKER
# =====================
echo "[5/7] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
fi

# Add deploy user to docker group
usermod -aG docker $DEPLOY_USER

# Enable Docker
systemctl enable docker
systemctl start docker

# =====================
# APPLICATION
# =====================
echo "[6/7] Setting up application..."

# Create app directory
mkdir -p "$APP_DIR"
chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR"

# Clone repo if not present
if [ ! -d "$APP_DIR/.git" ]; then
    echo "Cloning repository..."
    sudo -u $DEPLOY_USER git clone https://github.com/fullsizemalt/ersen-monorepo.git "$APP_DIR"
fi

# Create .env file if not exists
if [ ! -f "$APP_DIR/.env" ]; then
    echo "Creating .env file..."
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '/+=')
    JWT_SECRET=$(openssl rand -hex 32)
    
    cat > "$APP_DIR/.env" << EOF
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
    
    chown $DEPLOY_USER:$DEPLOY_USER "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
fi

# =====================
# DEPLOY
# =====================
echo "[7/7] Deploying application..."
cd "$APP_DIR"

# Build and start as deploy user
sudo -u $DEPLOY_USER docker compose -f docker-compose.prod.yml build
sudo -u $DEPLOY_USER docker compose -f docker-compose.prod.yml up -d

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Server hardened:"
echo "  ✓ User 'deploy' created with passwordless sudo"
echo "  ✓ SSH root login disabled, password auth disabled"
echo "  ✓ UFW firewall enabled (22, 80, 443)"
echo "  ✓ Fail2ban enabled"
echo ""
echo "Application deployed:"
echo "  Frontend: https://ersen.xyz"
echo "  API:      https://api.ersen.xyz"
echo ""
echo "Next steps:"
echo "  1. Point DNS: ersen.xyz → 159.69.219.254"
echo "  2. Point DNS: api.ersen.xyz → 159.69.219.254"
echo "  3. SSH as: ssh deploy@159.69.219.254"
echo "  4. Edit secrets: nano $APP_DIR/.env"
echo "  5. Restart: cd $APP_DIR && docker compose -f docker-compose.prod.yml restart"
