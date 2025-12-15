# Task Breakdown: Phase 1 - Foundation

## Phase 1.1: Backend Infrastructure & Auth

- [x] **Task 1.1.1**: Initialize Backend Project
  - Initialize `backend/package.json` with dependencies (express, pg, workos-node, stripe).
  - Configure TypeScript (`tsconfig.json`) and ESLint.
  - Create `src/app.ts` and basic server setup.

- [x] **Task 1.1.2**: Database Setup
  - Create `backend/schema.sql` with Users, Subscriptions, WidgetTemplates, ActiveWidgets tables.
  - Create `src/config/db.ts` for PostgreSQL connection.
  - Write a script `scripts/migrate.ts` to run the schema.

- [x] **Task 1.1.3**: WorkOS Authentication
  - Implement `src/services/workos.ts` (Get Authorization URL, Get Profile).
  - Implement `src/controllers/auth.controller.ts` (Login, Callback, Me, Logout).
  - Implement `src/middlewares/auth.middleware.ts` (Verify session).
  - **Checkpoint**: Verify `/api/auth/google` redirects and `/api/auth/me` returns user.

## Phase 1.2: Subscriptions (Stripe)

- [x] **Task 1.2.1**: Stripe Integration
  - Implement `src/services/stripe.ts` (Create Checkout Session).
  - Implement `src/controllers/subscription.controller.ts` (Checkout endpoint).

- [x] **Task 1.2.2**: Webhook Handling
  - Implement `src/controllers/webhook.controller.ts` to handle `checkout.session.completed`.
  - Update `subscriptions` table based on Stripe events.
  - **Checkpoint**: Verify test payment updates user tier to "Standard".

## Phase 1.3: Widget API

- [x] **Task 1.3.1**: Widget Catalog API
  - Implement `src/controllers/widget.controller.ts`.
  - `GET /api/widgets/catalog`: Return all templates.
  - `GET /api/widgets/active`: Return user's installed widgets.

- [x] **Task 1.3.2**: Widget Management API
  - `POST /api/widgets/active`: Install a widget (check tier limits).
  - `DELETE /api/widgets/active/:id`: Uninstall a widget.

## Phase 1.4: Frontend Foundation

- [x] **Task 1.4.1**: Initialize Frontend Project
  - Setup Vite + React + TypeScript in `frontend/`.
  - Install dependencies (react-router-dom, axios, framer-motion).
  - Configure proxy to backend in `vite.config.ts`.

- [x] **Task 1.4.2**: Auth Implementation
  - Create `src/contexts/AuthContext.tsx`.
  - Create `src/pages/Login.tsx` with WorkOS login button.
  - Create `src/components/layout/PrivateRoute.tsx`.

- [x] **Task 1.4.3**: Dashboard UI
  - Create `src/pages/Dashboard.tsx`.
  - Implement grid layout (CSS Grid).
  - Fetch and render active widgets from API.

- [x] **Task 1.4.4**: Marketplace UI
  - Create `src/pages/Marketplace.tsx`.
  - Display widget cards with "Install" buttons.
  - Handle "Upgrade Required" states for Pro widgets.

## Phase 1.5: Seed Data & Polish

- [x] **Task 1.5.1**: Seed Data
  - Create `scripts/seed.ts` to populate `widget_templates` with the initial 24 widgets.

- [x] **Task 1.5.2**: End-to-End Verification
  - Verify full flow: Login -> Upgrade -> Install Pro Widget -> View on Dashboard.
