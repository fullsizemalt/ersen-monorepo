# DAEMON 2.0 - Modular Widget Hub

> **For Next Agent**: This is a clean refactor of DAEMON (original in `../DAEMON`). We're building a monetized, modular widget platform with subscription tiers.

---

## Project Context

**What This Is**: Privacy-first personal OS dashboard with 100+ modular widgets across subscription tiers.

**Business Model**:
- **Free**: 5 widget slots, 12 free widgets
- **Standard**: $7/month, 20 slots, 42 widgets
- **Pro**: $19/month, 50 slots, 100+ widgets

**Monetization Strategy**: Hybrid PWA + free Android app model (see `docs/implementation_plan.md`)

---

## Current Status

✅ **Phase 1 Started** - Foundation scaffolding complete:
- Backend API structure (TypeScript + Express + PostgreSQL)
- Frontend structure (React + Vite)
- Database schema with subscriptions & widget catalog
- WorkOS authentication routes
- Stripe billing endpoints
- 24 widget templates seeded

❌ **Not Yet Done**:
- Frontend components (Login, Dashboard, Marketplace pages exist as stubs)
- WorkOS account setup & configuration
- Stripe account setup & product creation
- Actual widget implementations
- Docker Compose testing

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Node.js + TypeScript + Express | Type safety, familiar stack |
| **Database** | PostgreSQL | Better than SQLite for subscriptions/scaling |
| **Auth** | WorkOS | Free for 1M users, handles Google/GitHub/SAML |
| **Payments** | Stripe | 2.9% fees vs 15-30% app store tax |
| **Frontend** | React + TypeScript + Vite | Fast dev, type safety |
| **Mobile** | PWA → Android App Bundles | Cross-platform, modular delivery |

---

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with:
#   - WORKOS_API_KEY, WORKOS_CLIENT_ID (create account at workos.com)
#   - STRIPE_SECRET_KEY, STRIPE_PRICE_STANDARD, STRIPE_PRICE_PRO (stripe.com)
#   - JWT_SECRET (random string)

# 3. Start database
docker compose up postgres -d

# 4. Run migrations
cd backend
npm run db:migrate   # Creates tables from schema.sql
npm run db:seed      # Seeds widget catalog from seed-widgets.sql

# 5. Start dev servers
npm run dev          # Backend on :3000
cd ../frontend && npm run dev  # Frontend on :5173
```

---

## Architecture

### API Endpoints

**Authentication** (`/api/auth`):
- `GET /google` - Redirect to Google OAuth
- `GET /callback` - Handle OAuth callback
- `GET /me` - Get current user
- `POST /logout` - Clear session

**Widgets** (`/api/widgets`):
- `GET /catalog` - Browse widgets (tier-filtered)
- `GET /active` - User's installed widgets
- `POST /active` - Install widget
- `DELETE /active/:id` - Uninstall widget

**Subscriptions** (`/api/subscriptions`):
- `POST /checkout` - Create Stripe checkout session
- `GET /current` - Get user's subscription
- `POST /webhook` - Handle Stripe events

### Database Schema

**Core Tables**:
- `users` - Email, name, avatar, workos_id
- `sessions` - Token-based authentication
- `subscriptions` - User's tier (free/standard/pro) + Stripe IDs
- `widget_templates` - Catalog of available widgets
- `active_widgets` - User's installed widget instances
- `integrations` - OAuth tokens for third-party APIs

See `backend/schema.sql` for full schema.

---

## Phase 1 Tasks (Week 1-2)

### Backend
- [x] Scaffold API structure
- [x] Database schema
- [x] WorkOS auth routes
- [x] Stripe subscription routes
- [ ] **TODO**: Create scripts for db:migrate and db:seed
- [ ] **TODO**: Test auth flow locally
- [ ] **TODO**: Test Stripe webhooks

### Frontend
- [x] Project structure
- [x] Design assets copied from DAEMON
- [ ] **TODO**: Implement Login page with "Continue with Google"
- [ ] **TODO**: Implement Dashboard with grid layout
- [ ] **TODO**: Implement Marketplace with widget catalog
- [ ] **TODO**: Build AuthContext with WorkOS
- [ ] **TODO**: Create SubscriptionUpgrade component

### Setup
- [ ] **TODO**: Create WorkOS account, configure Google OAuth
- [ ] **TODO**: Create Stripe account, create products ($7, $19)
- [ ] **TODO**: Get Stripe webhook signing secret
- [ ] **TODO**: Test end-to-end OAuth flow
- [ ] **TODO**: Test subscription checkout

---

## Key Documents

**Planning & Specs**:
- `docs/implementation_plan.md` - Full strategic plan (PWA vs native, WorkOS vs custom auth, competition analysis)
- `docs/WIDGET_AUDIT.md` - Audit of 12 existing widgets
- `docs/WIDGET_ENHANCEMENTS.md` - Pro-level widget specs (filtering, sorting, configs)
- `docs/WORKOS_SSO_SPEC.md` - WorkOS integration guide
- `docs/ANDROID_APP_BUNDLE.md` - AAB + dynamic modules plan
- `docs/DESIGN_SYSTEM.md` - UI/UX design system from DAEMON

**Implementation**:
- `docs/task.md` - Phase-by-phase task breakdown
- `.env.example` - Required environment variables

---

## Widget Catalog (Seeded)

**Free Tier** (12 widgets):
- task-manager, ai-assistant, sticky-notes, clock, weather, calculator, pomodoro, quote, habit-tracker, toybox, mood-tracker, heatmap

**Standard Tier** (+7 widgets):
- gmail, google-calendar, github, spotify, obsidian, kanban, music-download

**Pro Tier** (+5 widgets):
- grafana, prometheus, jellyfin, plex, audiobookshelf

Total seeded: **24 widgets**. Target: **100+ widgets** by Phase 4.

---

## Deployment Strategy

**Phase 1-2**: Web only (PWA)
- Deploy to daemon.runfoo.run
- Users subscribe via Stripe (2.9% fee)
- No app store fees

**Phase 3**: Android app (free on Play Store)
- Download free app
- App syncs with web subscription
- Native features unlock based on web tier
- Avoids 30% Google Play tax

**Phase 4**: iOS support (limited PWA features)

---

## Design Assets

Copied from original DAEMON:
- `design-assets/App.css` - Glassmorphic styles, blob animations
- `design-assets/index.css` - Fonts (Space Grotesk, JetBrains Mono), base styles
- `design-assets/*.png` - Logo, icons, splash screens

Use these in frontend to maintain visual consistency.

---

## Critical Decisions Made

✅ **WorkOS for auth** - Free for 1M users, handles OAuth complexity  
✅ **Stripe for payments** - Web subscriptions avoid app store tax  
✅ **PostgreSQL over SQLite** - Better for subscriptions/multi-tenancy  
✅ **Hybrid PWA + free Android app** - Best of both worlds  
✅ **TypeScript everywhere** - Type safety reduces bugs  

---

## Next Agent Instructions

1. **Start here**: Read `docs/implementation_plan.md` for full context
2. **Set up accounts**: WorkOS + Stripe (test mode)
3. **Implement frontend**: Login → Dashboard → Marketplace pages
4. **Test locally**: End-to-end OAuth + Stripe checkout
5. **Port widgets**: Refactor 12 existing widgets from `../DAEMON/frontend/src/components/widgets/`
6. **Reference**: See `../DAEMON` for original working widgets

---

## Questions?

**"Where's the original code?"**  
→ `../DAEMON` (old monolithic version)

**"Why the refactor?"**  
→ Add subscriptions, modular widgets, WorkOS/Stripe, scale to 100+ widgets

**"What's the revenue model?"**  
→ SaaS: $7/mo standard, $19/mo pro. Free Android app unlocks features for web subscribers.

**"When to deploy?"**  
→ After Phase 1 complete (Week 2): OAuth working, Stripe checkout tested, 5-10 widgets implemented

---

**Status**: ✅ Scaffolded, ready for Phase 1 implementation  
**Timeline**: 12 weeks to full platform (100+ widgets, AAB, admin dashboard)  
**Contact**: Review `docs/implementation_plan.md` for full roadmap
