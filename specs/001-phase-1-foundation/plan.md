# Implementation Plan: Phase 1 - Foundation

## Technical Context

**Language/Version**: TypeScript (Node.js v20+, React v18+)
**Primary Dependencies**: Express, Vite, WorkOS Node SDK, Stripe Node SDK
**Storage**: PostgreSQL (via `pg` driver)
**Testing**: NEEDS CLARIFICATION
**Target Platform**: Web (PWA)
**Project Type**: web
**Performance Goals**: NEEDS CLARIFICATION
**Constraints**: NEEDS CLARIFICATION
**Scale/Scope**: NEEDS CLARIFICATION

## 1. Technology Stack (Detailed)

- **Backend**: Node.js (v20+), Express, TypeScript.
- **Database**: PostgreSQL (via `pg` driver).
- **Frontend**: React (v18+), Vite, TypeScript.
- **Auth**: WorkOS Node SDK.
- **Payments**: Stripe Node SDK.
- **Styling**: CSS Modules / Global CSS variables.

## 2. Architecture

### 2.1 Backend Structure

```
backend/
  src/
    config/         # Env vars, DB connection
    controllers/    # Request handlers (Auth, Subscription, Widget)
    middlewares/    # AuthGuard, ErrorHandler
    routes/         # API definitions
    services/       # Business logic (WorkOS, Stripe, DB ops)
    types/          # TS interfaces
    app.ts          # Entry point
```

### 2.2 Frontend Structure

```
frontend/
  src/
    assets/         # Images, fonts
    components/
      common/       # Button, Card, Modal
      layout/       # Navbar, Sidebar, LayoutShell
      widgets/      # Widget implementations (lazy loaded)
    contexts/       # AuthContext, ThemeContext
    hooks/          # useAuth, useWidgets
    pages/          # Login, Dashboard, Marketplace, Settings
    services/       # API client
    types/          # Shared types
```

## 3. Data Model (PostgreSQL)

### Users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  workos_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions

```sql
CREATE TABLE subscriptions (
  user_id INTEGER REFERENCES users(id) PRIMARY KEY,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'free', -- 'free', 'standard', 'pro'
  status VARCHAR(50) DEFAULT 'active',
  current_period_end TIMESTAMP
);
```

### Widget Templates (Catalog)

```sql
CREATE TABLE widget_templates (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'clock-digital'
  name VARCHAR(100) NOT NULL,
  description TEXT,
  tier VARCHAR(50) DEFAULT 'free', -- Min tier required
  thumbnail_url TEXT
);
```

### Active Widgets (Installed)

```sql
CREATE TABLE active_widgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  template_id INTEGER REFERENCES widget_templates(id),
  config JSONB DEFAULT '{}', -- User settings for this widget
  position JSONB DEFAULT '{"x": 0, "y": 0, "w": 1, "h": 1}', -- Grid layout
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Implementation Steps

### Step 1: Backend Foundation

- Initialize Express app with TypeScript.
- Set up PostgreSQL connection pool.
- Implement `users` and `subscriptions` migrations.

### Step 2: Authentication (WorkOS)

- Implement `GET /auth/google` (Redirect to WorkOS).
- Implement `GET /auth/callback` (Exchange code for profile).
- Implement `POST /auth/logout`.
- Create `AuthMiddleware` to protect routes.

### Step 3: Subscriptions (Stripe)

- Implement `POST /subscriptions/checkout` (Create Stripe Session).
- Implement `POST /subscriptions/webhook` (Handle events).
- Update `subscriptions` table on webhook events.

### Step 4: Frontend Foundation

- Initialize Vite React app.
- Set up React Router.
- Create `AuthContext` to fetch user state from `/api/auth/me`.

### Step 5: Core Pages

- **Login Page**: Simple "Sign in with Google" button.
- **Dashboard**: Fetch `active_widgets` and render placeholders.
- **Marketplace**: Fetch `widget_templates` and allow "Install" (POST /api/widgets/active).

## 5. Verification Plan

- **Auth**: Verify login flow redirects correctly and creates user in DB.
- **Billing**: Verify Stripe test card upgrades user tier in DB.
- **Widgets**: Verify installing a widget adds it to the Dashboard.
