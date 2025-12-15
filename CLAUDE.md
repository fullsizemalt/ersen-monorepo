# DAEMON2 Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-13

## Active Technologies

- TypeScript (Node.js v20+, React v18+) + Express, Vite, WorkOS Node SDK, Stripe Node SDK (001-phase-1-foundation)
- Jest (backend testing), Vitest (frontend testing)
- react-grid-layout (widget grid)

## Project Structure

```text
backend/           # Express API server
├── src/           # Source code
├── tests/         # Jest tests
└── scripts/       # DB migrations, seeds

frontend/          # React PWA
├── src/           # Source code
└── tests/         # Vitest tests

specs/             # Speckit specifications
├── 001-phase-1-foundation/
└── 002-widget-implementation/

.github/agents/    # Speckit agents
.specify/          # Constitution, templates
```

## Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm test             # Run Jest tests
npm run lint         # TypeScript check
npm run build        # Compile TypeScript

# Frontend
cd frontend
npm run dev          # Start Vite dev server
npm test             # Run Vitest tests
npm run lint         # TypeScript check
npm run build        # Build for production

# Database
cd backend
npm run db:migrate   # Run migrations
npm run db:seed      # Seed widget catalog
```

## Code Style

- TypeScript Strict: No `any` types permitted
- React: Functional components with hooks
- CSS: Tailwind + custom variables
- Tests: Jest (backend), Vitest (frontend)

## Constitution Summary

**Core Principles** (see `.specify/memory/constitution.md`):

1. Privacy-First (no tracking, data sovereignty)
2. Widget Isolation (error boundaries, lazy loading)
3. Web-First (PWA with Android wrapper)
4. Stripe for payments (no app store tax)
5. Premium aesthetics (glassmorphism, 60fps animations)

## Testing Requirements

Per constitution, critical flows MUST have tests:

- Authentication flows (WorkOS OAuth)
- Payment flows (Stripe checkout/webhooks)
- Widget installation/uninstallation

## Recent Changes

- 001-phase-1-foundation: Foundation complete (auth, subscriptions, API)
- 002-widget-implementation: Spec created (24+ widgets planned)
- 2025-12-13: Added testing infrastructure (Jest + Vitest)
- 2025-12-13: Updated CI/CD with test execution
- 2025-12-13: Added community files (LICENSE, CONTRIBUTING, SECURITY)
- 2025-12-13: Constitution updated to v1.1.0

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
