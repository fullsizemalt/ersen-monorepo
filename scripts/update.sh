#!/bin/bash

# Quick Update Script for DAEMON 2.0
# Use this to push UI updates to the live site

set -e

echo "🚀 DAEMON 2.0 Quick Update"
echo "=========================="
echo ""

# Step 1: Push to Forgejo
echo "📤 Pushing code to Forgejo..."
git push forgejo master

# Step 2: Pull and rebuild on server
echo ""
echo "🔧 Updating on nexus-vector..."
ssh admin@nexus-vector << 'ENDSSH'
set -e

cd /srv/containers/daemon

echo "Pulling latest code..."
git fetch origin
git reset --hard origin/master

echo "Rebuilding containers..."
docker compose build --no-cache frontend
docker compose up -d --force-recreate

echo "Ensuring network connectivity..."
# Force connect to traefik-public just in case
docker network connect traefik-public daemon-backend-1 || true
docker network connect traefik-public daemon-frontend-1 || true

echo "Restarting Traefik to pick up changes..."
docker restart traefik || true

echo ""
echo "✅ Update complete!"
echo ""
echo "Checking status..."
docker compose ps

ENDSSH

echo ""
echo "🎉 DAEMON 2.0 updated!"
echo "   Visit: https://daemon.runfoo.run"
echo ""
