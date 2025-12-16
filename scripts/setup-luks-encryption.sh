#!/bin/bash
# LUKS Encryption for Ersen PostgreSQL Data
# 
# WARNING: This script will cause database downtime!
# Run with sudo on nexus-vector
#
# Prerequisites:
# - cryptsetup installed (apt install cryptsetup)
# - Backup of postgres_data volume completed
# - 30 minutes of scheduled maintenance window

set -e

# Configuration
ENCRYPTED_DEVICE="/dev/sda"  # Adjust to your VPS block device
LUKS_VOLUME_NAME="ersen_encrypted"
MOUNT_POINT="/mnt/encrypted_postgres"
DOCKER_COMPOSE_DIR="/srv/containers/ersen"
KEY_FILE="/root/.ersen_luks_key"  # Store securely!

echo "=========================================="
echo "ERSEN LUKS Encryption Setup"
echo "=========================================="
echo ""
echo "This script will:"
echo "1. Stop Ersen containers"
echo "2. Backup existing PostgreSQL data"
echo "3. Create LUKS encrypted volume"
echo "4. Migrate data to encrypted volume"
echo "5. Update Docker Compose to use encrypted mount"
echo ""
echo "Press CTRL+C to abort, Enter to continue..."
read

# Step 1: Stop containers
echo "[1/6] Stopping Ersen containers..."
cd $DOCKER_COMPOSE_DIR
docker compose -f docker-compose.prod.yml down

# Step 2: Backup existing data
echo "[2/6] Backing up PostgreSQL data..."
BACKUP_DIR="/root/ersen_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR
docker run --rm -v ersen_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .
echo "Backup saved to: $BACKUP_DIR/postgres_data.tar.gz"

# Step 3: Generate encryption key
echo "[3/6] Generating encryption key..."
if [ ! -f "$KEY_FILE" ]; then
    dd if=/dev/urandom of=$KEY_FILE bs=4096 count=1
    chmod 600 $KEY_FILE
    echo "Key file created at: $KEY_FILE"
    echo ""
    echo "!!! IMPORTANT !!!"
    echo "Backup this key file securely! Without it, data is UNRECOVERABLE!"
    echo "Consider copying to a secure offline location."
    echo ""
fi

# Step 4: Create encrypted volume (using file-based loop device for Docker volumes)
echo "[4/6] Creating encrypted volume..."
ENCRYPTED_FILE="/var/lib/ersen_encrypted.img"
VOLUME_SIZE="10G"  # Adjust as needed

if [ ! -f "$ENCRYPTED_FILE" ]; then
    # Create sparse file
    truncate -s $VOLUME_SIZE $ENCRYPTED_FILE
    
    # Setup LUKS
    cryptsetup luksFormat --batch-mode --key-file=$KEY_FILE $ENCRYPTED_FILE
    echo "LUKS volume formatted."
fi

# Open encrypted volume
cryptsetup luksOpen --key-file=$KEY_FILE $ENCRYPTED_FILE $LUKS_VOLUME_NAME

# Create filesystem
if ! blkid /dev/mapper/$LUKS_VOLUME_NAME | grep -q ext4; then
    mkfs.ext4 /dev/mapper/$LUKS_VOLUME_NAME
fi

# Mount
mkdir -p $MOUNT_POINT
mount /dev/mapper/$LUKS_VOLUME_NAME $MOUNT_POINT

# Step 5: Migrate data
echo "[5/6] Migrating PostgreSQL data to encrypted volume..."
tar xzf $BACKUP_DIR/postgres_data.tar.gz -C $MOUNT_POINT

# Set ownership for postgres user (UID 70 in alpine postgres image)
chown -R 70:70 $MOUNT_POINT

# Step 6: Update docker-compose to use bind mount
echo "[6/6] Updating Docker Compose configuration..."
# Create override file for encrypted volume
cat > $DOCKER_COMPOSE_DIR/docker-compose.encrypted.yml << 'EOF'
version: '3.8'
services:
  db:
    volumes:
      - /mnt/encrypted_postgres:/var/lib/postgresql/data
EOF

echo ""
echo "=========================================="
echo "LUKS Encryption Setup Complete!"
echo "=========================================="
echo ""
echo "To start Ersen with encrypted storage:"
echo "  cd $DOCKER_COMPOSE_DIR"
echo "  docker compose -f docker-compose.prod.yml -f docker-compose.encrypted.yml up -d"
echo ""
echo "IMPORTANT - After reboot, you must unlock the volume:"
echo "  cryptsetup luksOpen --key-file=$KEY_FILE $ENCRYPTED_FILE $LUKS_VOLUME_NAME"
echo "  mount /dev/mapper/$LUKS_VOLUME_NAME $MOUNT_POINT"
echo ""
echo "Consider adding to /etc/crypttab for systemd unlock or use a key escrow service."
