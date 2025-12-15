# DAEMON 2.0 Refactor - Implementation Tasks

## Phase 1: Foundation (Weeks 1-2) [IN PROGRESS]

### Database Migration
- [x] Set up PostgreSQL locally (Docker)
- [x] Create new schema (users, subscriptions, widget_templates, active_widgets, integrations)
- [ ] Write migration script from SQLite to PostgreSQL
- [ ] Migrate existing user data
- [x] Seed widget_templates table with 12 existing widgets

### Authentication (WorkOS)
- [ ] Create WorkOS account
- [x] Install @workos-inc/node SDK
- [ ] Configure Google OAuth provider
- [x] Implement /auth/google and /auth/callback routes
- [x] Add session management
- [x] Update AuthContext for WorkOS
- [x] Add "Continue with Google" button to Login page

### Subscription System (Stripe)
- [ ] Create Stripe account (test mode)
- [x] Install stripe SDK
- [ ] Create subscription products ($7 Standard, $19 Pro)
- [x] Implement /api/subscriptions/checkout endpoint
- [ ] Build SubscriptionUpgrade UI component
- [x] Set up Stripe webhook handler
- [x] Add subscription tier to user model

### Widget Architecture
- [x] Create Widget Development Kit (WDK) interface
- [x] Refactor TaskWidget to use WDK
- [ ] Implement WidgetLoader with lazy loading
- [x] Build widget catalog API endpoint
- [x] Add tier-based filtering to catalog

## Phase 2: Modularization (Weeks 3-4)

### Widget Refactoring
- [x] Refactor remaining 11 widgets to WDK
- [x] Add metadata to each widget (tier, category, size)
- [x] Implement drag-drop grid with react-grid-layout (Basic Grid Implemented)
- [x] Build widget installation flow
- [x] Create widget uninstall flow

### Marketplace UI
### Marketplace UI
- [x] Build Marketplace page component
- [x] Add category filters (Tier filters)
- [x] Create WidgetCard component
- [x] Implement search functionality
- [x] Add "Install Widget" button with tier checks

### Onboarding
- [x] Create onboarding flow (select widgets)
- [x] Add widget slots counter
- [x] Build upgrade prompts for premium widgets

## Phase 3: Monetization (Weeks 5-6)

### Stripe Integration
- [x] Complete checkout flow end-to-end
- [ ] Test webhook events (subscription created, updated, cancelled)
- [x] Build subscription management UI (PricingModal + Portal)
- [x] Add billing portal link
- [x] Implement widget slot limits per tier

### Testing
- [ ] Test free tier (5 slots, 12 widgets)
- [ ] Test standard tier upgrade ($7)
- [ ] Test pro tier upgrade ($19)
- [ ] Test downgrade flows
- [ ] Test cancellation

## Phase 4: Expansion (Weeks 7-12)

### New Widgets (13-40)
- [x] Build 10 standard tier widgets
- [x] Build 5 Pro tier widgets (Grafana, Prometheus, Jellyfin, Plex, Audiobookshelf)
- [ ] Build remaining widgets (Optional)

### Android App Bundles
- [x] Convert to AAB build (Built at frontend/android/app/build/outputs/bundle/release/app-release.aab)
- [x] Create dynamic feature modules (Added 'pro_features' module)
- [x] Implement module installation flow (Added ProFeaturesPlugin.java and frontend bindings)
- [ ] Test on device

### Admin Dashboard
- [ ] Build admin UI for widget management
- [ ] Add user analytics
- [ ] Create support tools

---

**Current Focus**: Phase 1 - Database + WorkOS + Stripe setup
