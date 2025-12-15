# Specification: Phase 1 - Foundation

## 1. Overview
This phase establishes the core infrastructure for DAEMON 2.0: Authentication, Subscription Billing, and the primary UI shell (Dashboard & Marketplace).

## 2. User Stories

### Authentication
- **US-1.1**: As a user, I want to sign up or log in using my Google account so that I don't have to remember another password.
- **US-1.2**: As a user, I want to stay logged in across sessions until I explicitly log out.

### Subscriptions
- **US-2.1**: As a free user, I want to see the limitations of my current plan (5 slots, limited widgets) so I understand the value of upgrading.
- **US-2.2**: As a user, I want to upgrade to "Standard" ($7/mo) or "Pro" ($19/mo) plans via a secure checkout page.
- **US-2.3**: As a user, I want immediate access to premium features after paying.

### Dashboard (Core UI)
- **US-3.1**: As a user, I want to see a grid of my installed widgets upon logging in.
- **US-3.2**: As a user, I want the dashboard to look modern and "premium" (glassmorphism, dark mode).

### Marketplace
- **US-4.1**: As a user, I want to browse a catalog of available widgets.
- **US-4.2**: As a user, I want to see which widgets are locked behind higher tiers.
- **US-4.3**: As a user, I want to install a widget to my dashboard if I have an available slot.

## 3. Functional Requirements

### 3.1 Authentication (WorkOS)
- **Provider**: WorkOS (Google OAuth).
- **Flow**: Authorization Code Flow.
- **Session**: HttpOnly cookies with JWT or Session ID.
- **User Profile**: Store email, name, avatar URL, and WorkOS ID in `users` table.

### 3.2 Billing (Stripe)
- **Products**:
    - Free: $0 (default)
    - Standard: $7/month
    - Pro: $19/month
- **Checkout**: Stripe Checkout (hosted page).
- **Webhooks**: Listen for `checkout.session.completed` and `customer.subscription.updated` to update local DB.
- **State**: `subscriptions` table tracks current tier, stripe_customer_id, and status (active/past_due).

### 3.3 Widget Engine (Basic)
- **Registry**: A static or database-driven registry of available widgets (`widget_templates`).
- **Instantiation**: When a user installs a widget, create a record in `active_widgets`.
- **Rendering**: Frontend dynamically renders widget components based on the `active_widgets` list.

### 3.4 UI/UX
- **Framework**: React + Vite.
- **Styling**: Vanilla CSS (variables for themes) + Framer Motion for transitions.
- **Responsive**: Mobile-first design (PWA ready).

## 4. Non-Functional Requirements
- **Security**: All API routes (except auth/webhooks) must be protected.
- **Performance**: Dashboard load time < 1s.
- **Scalability**: Database schema must support thousands of users.
