#!/bin/bash

# Configuration
REMOTE_USER="admin"
REMOTE_HOST="nexus-vector"
REMOTE_DIR="/srv/containers/daemon" # Keeping the old path on the server for simplicity, or we can rename it.
# Let's assume we use the existing directory to avoid setting up a new one from scratch right now.

echo "🚀 Syncing to ${REMOTE_HOST}..."

# Sync files (excluding node_modules and git)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'dist' \
    ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

echo "🔄 Restarting Dev Containers..."

# Run docker-compose on the remote server using the dev override
ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_DIR} && \
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build && \
    docker network connect traefik-public daemon-backend-1 2>/dev/null || true && \
    docker network connect traefik-public daemon-frontend-1 2>/dev/null || true"

echo "✅ Dev Environment Updated: https://daemon.runfoo.run"
