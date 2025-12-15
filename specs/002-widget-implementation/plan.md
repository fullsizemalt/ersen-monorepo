# Implementation Plan: Phase 2 - Widget Implementation

**Branch**: `002-widget-implementation` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-widget-implementation/spec.md`

## Summary

Implement 24+ widgets with configuration management, OAuth integrations, and responsive grid layout. Port existing widgets from DAEMON 1.0 and create new enterprise widgets for standard/pro tiers.

## Technical Context

**Language/Version**: TypeScript (Node.js v20+, React v18+)  
**Primary Dependencies**: React, react-grid-layout, Framer Motion, axios  
**Storage**: PostgreSQL (widget instances), Browser localStorage (temp cache)  
**Testing**: Jest (backend), Vitest (frontend)  
**Target Platform**: Web (PWA)  
**Project Type**: web  
**Performance Goals**: <1s dashboard render with 20 widgets  
**Constraints**: Error boundaries required, lazy loading required  
**Scale/Scope**: 24+ widgets, OAuth for 5 providers

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| Privacy-First | ✅ Pass | OAuth tokens stored server-side, encrypted |
| Widget Isolation | ✅ Pass | Error boundaries prevent cascade failures |
| Lazy Loading | ✅ Pass | React.lazy() for all widget components |
| TypeScript Strict | ✅ Pass | No any types, proper interfaces |
| Spec-Driven | ✅ Pass | This document exists |
| 60fps Animations | ✅ Pass | Framer Motion with GPU acceleration |

## Project Structure

### Documentation (this feature)

```text
specs/002-widget-implementation/
├── spec.md              # Feature specification
├── plan.md              # This file
└── tasks.md             # Task breakdown
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── controllers/
│   │   ├── widget.controller.ts      # Widget CRUD endpoints
│   │   └── integration.controller.ts # OAuth flow endpoints
│   ├── services/
│   │   ├── oauth.service.ts          # OAuth provider abstraction
│   │   └── widget.service.ts         # Widget business logic
│   └── routes/
│       └── integrations.ts           # Integration routes

frontend/
├── src/
│   ├── components/
│   │   ├── widgets/                  # Widget implementations
│   │   │   ├── clock/
│   │   │   │   ├── ClockWidget.tsx
│   │   │   │   ├── ClockConfig.tsx
│   │   │   │   └── index.ts
│   │   │   ├── weather/
│   │   │   ├── spotify/
│   │   │   └── ...
│   │   ├── common/
│   │   │   ├── WidgetWrapper.tsx     # Error boundary + controls
│   │   │   ├── WidgetConfig.tsx      # Config panel component
│   │   │   └── WidgetGrid.tsx        # Grid layout manager
│   │   └── layout/
│   ├── hooks/
│   │   ├── useWidget.ts              # Widget state management
│   │   └── useIntegration.ts         # OAuth connection status
│   ├── contexts/
│   │   └── WidgetContext.tsx         # Widget catalog context
│   └── types/
│       └── widget.types.ts           # Widget type definitions
```

**Structure Decision**: Web app (backend + frontend) following existing Phase 1 structure.

## Architecture

### Widget Component Interface

```typescript
interface WidgetProps {
  id: string;                    // Active widget instance ID
  config: Record<string, any>;   // User configuration
  onConfigChange: (config: Record<string, any>) => void;
  isConfigOpen: boolean;
  size: { width: number; height: number };
}

interface WidgetTemplate {
  slug: string;
  name: string;
  description: string;
  tier: 'free' | 'standard' | 'pro';
  category: string;
  configSchema: JSONSchema;      // For validation
  defaultConfig: Record<string, any>;
  minSize: { w: number; h: number };
  maxSize: { w: number; h: number };
}
```

### Widget Error Boundary

```typescript
class WidgetErrorBoundary extends React.Component {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <WidgetErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### OAuth Flow Architecture

```
User clicks "Connect Spotify"
    ↓
Frontend redirects to /api/integrations/spotify/authorize
    ↓
Backend redirects to Spotify OAuth
    ↓
User authorizes DAEMON
    ↓
Spotify redirects to /api/integrations/spotify/callback
    ↓
Backend stores tokens in DB, redirects to frontend
    ↓
Widget detects integration, fetches data
```

## Data Model Extensions

### Integrations Table

```sql
CREATE TABLE integrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,  -- 'spotify', 'github', 'google'
    access_token TEXT NOT NULL,      -- Encrypted
    refresh_token TEXT,              -- Encrypted
    token_expires_at TIMESTAMP,
    scope TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, provider)
);
```

### Widget Templates Update

```sql
ALTER TABLE widget_templates ADD COLUMN category VARCHAR(50) DEFAULT 'general';
ALTER TABLE widget_templates ADD COLUMN config_schema JSONB DEFAULT '{}';
ALTER TABLE widget_templates ADD COLUMN default_config JSONB DEFAULT '{}';
ALTER TABLE widget_templates ADD COLUMN min_size JSONB DEFAULT '{"w": 1, "h": 1}';
ALTER TABLE widget_templates ADD COLUMN max_size JSONB DEFAULT '{"w": 4, "h": 4}';
ALTER TABLE widget_templates ADD COLUMN oauth_required VARCHAR(50);  -- provider name or null
```

## Implementation Steps

### Step 1: Widget Infrastructure

- Implement WidgetWrapper with error boundary
- Create WidgetGrid using react-grid-layout
- Add widget config save/load endpoints
- Implement lazy loading registry

### Step 2: Free Tier Widgets (12)

Implement in priority order:

1. Clock (simple, foundational)
2. Weather (API integration example)
3. Sticky Notes (state persistence)
4. Calculator (client-only logic)
5. Task Manager (CRUD operations)
6. Pomodoro (timer functionality)
7. Quote (API integration)
8. Habit Tracker (complex state)
9. AI Assistant (API + streaming)
10. Mood Tracker (date-based data)
11. Toybox (animations)
12. Heatmap (data visualization)

### Step 3: OAuth Infrastructure

- Create OAuth service abstraction
- Implement Spotify provider
- Implement GitHub provider
- Implement Google provider
- Token refresh middleware

### Step 4: Standard Tier Widgets (7)

- Spotify (OAuth + real-time)
- GitHub (OAuth + activity feed)
- Gmail (OAuth + email list)
- Google Calendar (OAuth + events)
- Kanban (complex state)
- Obsidian (local API)
- Music Download (YT-DLP)

### Step 5: Pro Tier Widgets (5)

- Grafana (dashboard embeds)
- Prometheus (metrics API)
- Jellyfin (media library)
- Plex (media library)
- Audiobookshelf (audiobooks)

## Verification Plan

- **Widget Rendering**: Verify each widget renders with default config
- **Config Persistence**: Verify config changes save and persist across refresh
- **Error Boundaries**: Verify throwing error in one widget doesn't crash others
- **OAuth Flow**: Verify Spotify/GitHub/Google connect and retrieve data
- **Performance**: Verify 20 widgets render in <1s using Performance API

## Dependencies

- Phase 1 complete (auth, subscriptions, API structure)
- React Grid Layout: `npm install react-grid-layout`
- OAuth providers configured (environment variables)

## Complexity Tracking

No constitution violations. Standard web app architecture.
