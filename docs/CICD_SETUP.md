# CI/CD Setup for DAEMON 2.0

## Overview

This project uses **Forgejo Actions** (compatible with GitHub Actions) for automated deployment.

## Workflows

### 1. `deploy.yml` - Production Deployment
**Trigger:** Push to `master` branch  
**Actions:**
- Pulls latest code on nexus-vector
- Rebuilds Docker containers
- Restarts services
- Shows deployment status

### 2. `test.yml` - Build Testing
**Trigger:** Pull requests and non-master branches  
**Actions:**
- Tests backend build
- Tests frontend build
- Ensures code compiles before merge

## Setup Instructions

### Step 1: Enable Forgejo Actions

SSH into your Forgejo server and enable Actions:

```bash
ssh admin@nexus-vector

# Edit Forgejo config
sudo nano /etc/forgejo/app.ini

# Add this section:
[actions]
ENABLED = true

# Restart Forgejo
sudo systemctl restart forgejo
```

### Step 2: Add SSH Key Secret

1. Generate a deployment key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "forgejo-deploy" -f ~/.ssh/forgejo_deploy
```

2. Add the public key to nexus-vector's authorized_keys:
```bash
cat ~/.ssh/forgejo_deploy.pub | ssh admin@nexus-vector "cat >> ~/.ssh/authorized_keys"
```

3. Add the private key to Forgejo:
   - Go to `https://git.runfoo.run/malty/daemon/settings/secrets`
   - Click "Add Secret"
   - Name: `SSH_PRIVATE_KEY`
   - Value: Paste contents of `~/.ssh/forgejo_deploy`

### Step 3: Test the Workflow

```bash
# Commit and push
git add .
git commit -m "test: CI/CD setup"
git push forgejo master

# Check the Actions tab in Forgejo
# https://git.runfoo.run/malty/daemon/actions
```

## Manual Deployment (Fallback)

If CI/CD is down, use the manual update script:

```bash
./scripts/update.sh
```

## How It Works

```
┌─────────────┐
│  git push   │
│   master    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Forgejo Actions │
│   (Triggered)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  SSH to server  │
│  git pull       │
│  docker build   │
│  docker up -d   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Live site       │
│ daemon.runfoo   │
└─────────────────┘
```

## Monitoring Deployments

### View Logs
```bash
# On nexus-vector
ssh admin@nexus-vector
cd /srv/containers/daemon
docker compose logs -f
```

### Check Status
```bash
docker compose ps
```

### Rollback (if needed)
```bash
# On nexus-vector
cd /srv/containers/daemon
git log --oneline  # Find previous commit
git reset --hard <commit-hash>
docker compose up -d --build
```

## Environment Variables

The `.env` file on the server is NOT in git (for security).  
If you need to update environment variables:

```bash
ssh admin@nexus-vector
nano /srv/containers/daemon/.env
# Make changes
docker compose restart
```

## Troubleshooting

### Workflow doesn't trigger
- Check Forgejo Actions is enabled in `app.ini`
- Verify the workflow file is in `.forgejo/workflows/`
- Check repository settings → Actions → Enable

### SSH connection fails
- Verify `SSH_PRIVATE_KEY` secret is set correctly
- Test SSH manually: `ssh -i ~/.ssh/forgejo_deploy admin@nexus-vector`
- Check authorized_keys on server

### Build fails
- Check logs in Forgejo Actions tab
- Verify Docker is running on server
- Check disk space: `df -h`

## Benefits of CI/CD

✅ **Automatic deployment** - Just `git push`  
✅ **Consistent builds** - Same process every time  
✅ **Fast rollback** - Git history = deployment history  
✅ **Build testing** - Catch errors before deploy  
✅ **No manual SSH** - Secure, auditable deploys  

## Next Steps

1. Set up staging environment (optional)
2. Add database migration checks
3. Add health checks after deployment
4. Set up Slack/Discord notifications
