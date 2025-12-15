<!--
SYNC IMPACT REPORT
==================
Version: 1.0.0 → 1.1.0 (MINOR)
Reason: Added governance section, versioning metadata, and compliance requirements

Modified Principles:
- None (all original principles preserved)

Added Sections:
- Governance & Versioning (Section 7)
- Header metadata (version, dates)

Removed Sections:
- None

Templates Updated:
✅ N/A - No template changes required

Follow-up TODOs:
- None
-->

# Project Constitution: DAEMON 2.0

**Version**: 1.1.0  
**Ratification Date**: 2024-11-29  
**Last Amended**: 2025-12-13  
**Status**: Active

---

## 1. Core Philosophy

**Privacy-First Personal OS**: DAEMON is a personal dashboard that respects user agency.

- **Data Sovereignty**: User data belongs to the user. Prefer local-first storage (SQLite/LocalStorage) where possible. Server-side storage is for synchronization and backup, encrypted at rest.
- **No Tracking**: No third-party analytics or tracking pixels. DAEMON MUST NOT include any telemetry that identifies individual users.
- **Transparency**: All data collection, if any, MUST be opt-in and clearly documented.

---

## 2. Architecture & Tech Stack

**Hybrid PWA + Android Wrapper**:

- **Web First**: The core application is a React PWA (Vite + TypeScript). It MUST be fully functional in a mobile browser without native features.
- **Android Layer**: The Android app is a thin native wrapper (TWA/WebView) around the PWA. It exposes native APIs (notifications, widgets) to the web layer via a bridge.
- **Code Sharing**: 95% of code MUST be shared. Platform-specific code is isolated in adapters.
- **API Design**: All backend endpoints MUST follow RESTful conventions with proper HTTP status codes and JSON responses.

---

## 3. Modularity & Extensibility

**Widget-Centric Design**:

- **Isolation**: Widgets are independent modules. A crash in one widget MUST NOT bring down the dashboard.
- **Standard Interface**: All widgets MUST implement the `Widget` interface (props, config, state).
- **Lazy Loading**: Widgets MUST be loaded lazily to ensure fast initial render (<1s TTI).
- **Configuration**: Widget settings MUST be stored in JSON format and validated against a schema.

---

## 4. Monetization & Business Model

**Web-Centric Payments**:

- **Stripe Only**: All subscriptions are handled via the Web (Stripe). No in-app purchases.
- **Play Store Compliance**: The Android app is "free" (login required). It MUST NOT link to payment pages directly to avoid Google Tax. It unlocks features based on the user's web subscription status.
- **Tier Enforcement**: Free tier limits MUST be enforced server-side, not client-side.
- **Subscription Tiers**:
  - Free: 5 widget slots, 12 widgets
  - Standard ($7/mo): 20 widget slots, 42 widgets
  - Pro ($19/mo): 50 widget slots, 100+ widgets

---

## 5. User Experience & Design

**Premium Aesthetics**:

- **Visuals**: Glassmorphism, fluid animations (Framer Motion), dark mode by default.
- **Performance**: 60fps animations. <1s Time to Interactive. <3s Largest Contentful Paint.
- **"Wow" Factor**: Every interaction SHOULD feel polished and responsive.
- **Accessibility**: WCAG 2.1 AA compliance is RECOMMENDED. Critical UI elements MUST have proper ARIA labels.
- **Responsive**: Mobile-first design. All layouts MUST work from 320px to 4K screens.

---

## 6. Development Standards

**Code Quality**:

- **TypeScript Strict**: No `any` types permitted. Full type safety across Frontend and Backend.
- **Spec-Driven**: All features MUST be specified in `specs/` before implementation begins.
- **Automated Testing**: Critical flows (Auth, Payments, Widget installation) MUST have integration tests.
- **Code Review**: All changes to `master` MUST pass CI/CD checks (build, lint, tests).
- **Documentation**: Public APIs MUST be documented. README MUST be kept current.

**Git Workflow**:

- **Branch Naming**: `feature/[description]`, `fix/[description]`, `docs/[description]`
- **Commit Messages**: Follow conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- **Protected Branch**: `master` requires passing CI before merge

---

## 7. Governance & Versioning

**Constitution Versioning**:

This constitution follows Semantic Versioning:

- **MAJOR**: Backward-incompatible principle changes or removals
- **MINOR**: New principles added or significant clarifications
- **PATCH**: Typo fixes, wording improvements, non-semantic changes

**Amendment Procedure**:

1. Propose changes via pull request modifying this file
2. Include rationale in PR description
3. Update version number according to semver rules
4. Update `Last Amended` date to current date
5. Add Sync Impact Report as HTML comment at top of file

**Compliance Review**:

- At the start of each phase, verify implementation plan aligns with constitution
- Constitution Check section in `plan.md` MUST be completed before implementation
- Violations MUST be documented in the Complexity Tracking table with justification

**Enforcement**:

- CI/CD pipelines SHOULD include linting rules that enforce key standards
- Code reviewers MUST verify constitution compliance before approving PRs
- Spec reviewers MUST verify new features align with core philosophy

---

## 8. Security Requirements

**Authentication & Authorization**:

- **Session Management**: Use HttpOnly cookies for session tokens. No localStorage for auth tokens.
- **Password Handling**: If passwords are used, they MUST be hashed with bcrypt (cost factor ≥10).
- **OAuth**: Prefer OAuth/OIDC via WorkOS for authentication. No custom auth flows.

**Data Protection**:

- **Secrets**: All secrets MUST be in environment variables, never committed to git.
- **HTTPS**: All production traffic MUST use TLS 1.2+.
- **Input Validation**: All user input MUST be validated and sanitized server-side.
- **SQL Injection**: Use parameterized queries. No string concatenation for SQL.

---

## Appendix: Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-11-29 | WorkOS for auth | Free for 1M users, handles OAuth complexity |
| 2024-11-29 | Stripe for payments | 2.9% fees vs 15-30% app store tax |
| 2024-11-29 | PostgreSQL over SQLite | Better for subscriptions/multi-tenancy |
| 2024-11-29 | Hybrid PWA + Android | Best of both worlds, code sharing |
| 2024-11-29 | TypeScript everywhere | Type safety reduces production bugs |
| 2025-12-13 | Added governance section | Speckit compliance requirement |
