# Pipeline Handoff & SSH Matrix - Ersen Ecosystem

## Overview

This document outlines the infrastructure, SSH access, and deployment pipelines for the Ersen ecosystem, which spans two primary environments: the **Legacy/Dev** environment on `nexus-vector` (Interserver) and the **New Production** environment on `ersen.xyz` (Hetzner).

## 🔑 SSH Matrix & Infrastructure

| Environment | Hostname / IP | User | Key Strategy | Internal/Tailscale | External URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **New Production** | **`159.69.219.254`** | `deploy` | Local System Key (Copied from root) | N/A | [ersen.xyz](https://ersen.xyz) |
| **Legacy/Dev** | `nexus-vector` | `admin` | Local System Key | `216.158.230.94` (Public)<br>`100.95.3.92` (TS) | [daemon.runfoo.run](https://daemon.runfoo.run) |
| **Git Host** | `git.runfoo.run` | `git` | Forgejo Deploy Key | `100.x.x.x` | [git.runfoo.run](https://git.runfoo.run) |

### Detailed Connection Info

#### 1. New Production (Hetzner)

* **Server**: Hetzner VPS
* **Domain**: `ersen.xyz`
* **IP**: `159.69.219.254`
* **SSH Command**: `ssh deploy@159.69.219.254`
* **App Directory**: `/srv/containers/ersen`
* **Setup Script**: `scripts/hetzner-setup.sh`
* **Security**: Root login disabled, Password auth disabled. Uses `deploy` user with passwordless sudo.

#### 2. Legacy / Dev (Interserver)

* **Server**: Interserver (`nexus-vector`)
* **Domain**: `daemon.runfoo.run`
* **IP**: `216.158.230.94` (Public) / `100.95.3.92` (Tailscale)
* **SSH Command**: `ssh admin@216.158.230.94` (or `ssh admin@nexus-vector`)
* **App Directory**: `/srv/containers/daemon`
* **Network**: Uses `traefik-public` docker network.

#### 3. Source Control

* **Host**: `git.runfoo.run`
* **Port**: 2222 (for SSH clones)
* **Clone URL**: `ssh://git@git.runfoo.run:2222/malty/daemon.git` (or `ersen-monorepo`)

## 🚀 The Pipelines

### Pipeline A: `nexus-vector` (Current Automated CD)

* **Trigger**: Push to `master`.
* **Workflow**: `.forgejo/workflows/deploy.yml`
* **Target**: `daemon.runfoo.run`.
* **Mechanism**: Connects to `nexus-vector` via SSH, pulls code, rebuilds Docker containers.

### Pipeline B: `hetzner` (New Production - Manual/Scripted)

* **Status**: Currently Script-Based / Manual.
* **Setup**: Run `scripts/hetzner-setup.sh` on the server once.
* **Deploy**:
    1. SSH into server: `ssh deploy@159.69.219.254`
    2. Go to dir: `cd /srv/containers/ersen`
    3. Pull: `git pull origin master` (Requires Deploy Key on server)
    4. Restart: `docker compose -f docker-compose.prod.yml up -d --build`

## 🛠 Handoff Notes for Next Agent

1. **Identity Separation**:
    * `ersen.xyz` is the **Main Brand** destination hosted on Hetzner.
    * `daemon.runfoo.run` is the **dev/staging** environment hosted on Interserver.

2. **Environment Variables**:
    * **Hetzner**: `/srv/containers/ersen/.env` (Managed manually, see `scripts/hetzner-setup.sh` for template).
    * **Nexus**: `/srv/containers/daemon/.env`.

3. **Missing Pieces**:
    * The `hetzner` deployment is not yet fully automated in `.forgejo/workflows/`. Creating a specific `deploy-prod.yml` that targets `159.69.219.254` is a logical next step.
    * Certificates on Hetzner are handled via Traefik (ACME) just like on Nexus.

4. **Database Strategy**:
    * Hetzner setup implies a local DB (in `docker-compose.prod.yml`).
    * Ensure backups or replication if migrating data from Nexus.
