# Contributing to Ersen

This guide outlines the development and deployment workflow for the Ersen project.

## 🌟 The "Two-Track" Workflow

We use a two-track system to ensure fast development cycles without breaking production.

### 1. 🛠️ Development (Fast Track)
**Goal:** Rapidly test changes on a real server before committing.
**URL:** `https://daemon.runfoo.run`
**Infrastructure:** Docker containers running on `nexus-vector`.

**How to Deploy to Dev:**
1. Make your code changes locally.
2. Run the sync script:
   ```bash
   ./scripts/dev-sync.sh
   ```
   *(Or use the VS Code Task: "Remote Dev: Sync & Restart")*
3. The script `rsync`s your code to `nexus-vector` and restarts the containers.
4. Refresh `https://daemon.runfoo.run`.

**Note:** This bypasses Git and CI/CD completely. It is for **your eyes only** while developing.

---

### 2. 🚀 Production (Safe Track)
**Goal:** Release stable code to the world.
**URL:** `https://ersen.xyz`
**Infrastructure:** 
- **Frontend:** Vercel (connected to GitHub)
- **Backend:** Railway (connected to GitHub)

**How to Deploy to Prod:**
1. Verify your changes on the Dev server (`daemon.runfoo.run`).
2. Commit your changes:
   ```bash
   git commit -am "feat: amazing new feature"
   ```
3. Push to GitHub:
   ```bash
   git push origin master
   ```
4. **Automation takes over:**
   - GitHub Actions will run tests (CI).
   - Vercel & Railway will automatically pull the new commit and deploy (CD).

---

## 📂 Repository Structure

- **`origin` (GitHub):** The Source of Truth. Triggers production deployments.
- **`forgejo` (Internal):** Internal mirror/backup.

## ⚡ Quick Commands

| Task | Command |
|------|---------|
| **Start Dev Server** | `./scripts/dev-sync.sh` |
| **Deploy Prod** | `git push origin master` |
| **Local Install** | `bun install` |
| **Local Run** | `bun run dev` (Runs frontend & backend in parallel locally) |

## 🧩 Monorepo Overview

This is a **Bun** workspace.
- `packages/shared`: Shared types and logic (Zod schemas, etc).
- `backend`: Express API (Node.js).
- `frontend`: React/Vite app.
- `cli`: Command line tool.

**Config:**
- Root `package.json` manages all dependencies.
- Root `tsconfig.json` enforces strict type safety across the monorepo.