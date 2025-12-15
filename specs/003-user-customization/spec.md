# Phase 3: User Customization & Dashboard Profiles

**Status**: Draft  
**Author**: System  
**Created**: 2025-12-13  
**Target Completion**: Phase 2 + 2 weeks

---

## Overview

Enable granular user control over dashboard layout, widget organization, and profile-based configurations. Users should be able to create multiple "workspaces" optimized for different contexts (work, leisure, sysadmin, etc.).

---

## User Stories

### P0 - Critical

**US-3.001**: As a user, I want to configure how many columns my dashboard uses (1-6) so I can optimize for my screen size and preferences.

**US-3.002**: As a user, I want to create multiple dashboard profiles (e.g., "Work", "Home", "DevOps") so I can quickly switch contexts.

**US-3.003**: As a user, I want to drag widgets to reorder them and have that order persist across sessions.

### P1 - High Priority

**US-3.004**: As a user, I want to group widgets into named sections (e.g., "Monitoring", "Entertainment") so I can organize my dashboard logically.

**US-3.005**: As a user, I want to set a default profile that loads when I log in.

**US-3.006**: As a user, I want to switch between profiles with a single click from the dashboard.

**US-3.007**: As a user, I want each profile to have its own set of widgets and layout configuration.

### P2 - Medium Priority

**US-3.008**: As a user, I want to configure widget-specific display settings (size, refresh rate, compact mode).

**US-3.009**: As a user, I want to import/export my dashboard configuration for backup or sharing.

**US-3.010**: As a user, I want to duplicate an existing profile as a starting point for a new one.

**US-3.011**: As a user, I want to set different color themes per profile.

**US-3.015**: As a user, I want to use voice input for any text field so I can quickly enter data hands-free.

**US-3.016**: As a user, I want to add an optional label to my Pomodoro timer so I can remember what task I'm timing.

### P3 - Nice to Have

**US-3.012**: As a user, I want to schedule automatic profile switching (e.g., "Work" profile 9am-5pm weekdays).

**US-3.013**: As a user, I want keyboard shortcuts to switch between profiles.

**US-3.014**: As a user, I want to share my profile configuration with other users.

---

## Requirements

### Functional Requirements

#### FR-3.1 Column Configuration

- User can set column count: 1, 2, 3, 4, 5, or 6
- Column setting applies per-profile
- Widgets auto-reflow when column count changes
- Mobile override: Always use 1-2 columns regardless of setting

#### FR-3.2 Dashboard Profiles

- Users can create up to 10 profiles (free tier: 3)
- Each profile has:
  - Unique name (max 32 chars)
  - Icon/emoji selection
  - Column configuration
  - Widget selection and layout
  - Optional color theme override
- One profile marked as "default"
- Quick-switch UI in dashboard header

#### FR-3.3 Widget Groups

- Users can create named groups
- Groups are collapsible sections
- Widgets can be dragged between groups
- Groups have:
  - Name (max 32 chars)
  - Color accent
  - Collapse state (persisted)
  - Sort order

#### FR-3.4 Widget Ordering

- Drag-and-drop reordering within groups
- Drag-and-drop between groups
- Order persists to database
- Undo last reorder action

#### FR-3.5 Widget Display Settings

- Per-widget settings:
  - Size: compact, normal, expanded
  - Refresh interval: manual, 1m, 5m, 15m, 30m, 1h
  - Show/hide widget title
  - Background transparency

#### FR-3.6 Voice Input

- Microphone button next to all text inputs
- Uses Web Speech API (SpeechRecognition)
- Visual feedback during listening (pulsing mic icon)
- Supports:
  - Profile names
  - Group names
  - Task titles (Task Manager widget)
  - Pomodoro labels
  - Quick note entry
- Fallback message for unsupported browsers
- Privacy: Audio processed locally, not sent to server

#### FR-3.7 Pomodoro Timer Labels

- Optional label field when starting a timer
- Label displays prominently during active timer
- Label persists in session history
- Pre-populated suggestions from recent labels
- Voice input supported for labels
- Max label length: 64 characters

### Non-Functional Requirements

#### NFR-3.1 Performance

- Profile switch must complete in < 500ms
- Layout changes must apply without page reload
- Configuration save must be optimistic with background sync

#### NFR-3.2 Data Storage

- Configurations stored in database (not just localStorage)
- Offline-first: changes queue for sync when back online
- Max configuration size: 100KB per profile

#### NFR-3.3 Migration

- Existing users get their current layout as "Default" profile
- No data loss during migration

---

## Data Model

### Profile

```typescript
interface DashboardProfile {
  id: string;
  userId: string;
  name: string;
  icon: string; // emoji or icon name
  isDefault: boolean;
  columnCount: number; // 1-6
  themeOverride?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Widget Group

```typescript
interface WidgetGroup {
  id: string;
  profileId: string;
  name: string;
  colorAccent: string;
  sortOrder: number;
  isCollapsed: boolean;
}
```

### Widget Instance (enhanced)

```typescript
interface WidgetInstance {
  id: string;
  profileId: string;
  groupId?: string;
  widgetSlug: string;
  position: { x: number; y: number; w: number; h: number };
  displaySettings: {
    size: 'compact' | 'normal' | 'expanded';
    refreshInterval: number; // seconds, 0 = manual
    showTitle: boolean;
    backgroundOpacity: number; // 0-100
  };
  config: Record<string, unknown>;
  sortOrder: number;
}
```

---

## API Endpoints

### Profiles

- `GET /api/profiles` - List user's profiles
- `POST /api/profiles` - Create new profile
- `PATCH /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile
- `POST /api/profiles/:id/duplicate` - Duplicate profile
- `POST /api/profiles/:id/set-default` - Set as default

### Groups

- `GET /api/profiles/:profileId/groups` - List groups
- `POST /api/profiles/:profileId/groups` - Create group
- `PATCH /api/profiles/:profileId/groups/:id` - Update group
- `DELETE /api/profiles/:profileId/groups/:id` - Delete group
- `POST /api/profiles/:profileId/groups/reorder` - Bulk reorder

### Widget Instances

- `GET /api/profiles/:profileId/widgets` - List widgets in profile
- `POST /api/profiles/:profileId/widgets` - Add widget
- `PATCH /api/profiles/:profileId/widgets/:id` - Update widget
- `DELETE /api/profiles/:profileId/widgets/:id` - Remove widget
- `POST /api/profiles/:profileId/widgets/reorder` - Bulk reorder

### Import/Export

- `GET /api/profiles/:id/export` - Export profile as JSON
- `POST /api/profiles/import` - Import profile from JSON

---

## UI Components

### ProfileSwitcher

- Dropdown in dashboard header
- Shows current profile icon + name
- List of all profiles with quick-switch
- "Manage Profiles" link to settings

### ProfileManager (Settings Page)

- List all profiles
- Create/edit/delete profiles
- Set default profile
- Duplicate profile
- Import/export buttons

### LayoutSettings (Per-Profile)

- Column count slider (1-6)
- Theme override picker
- Preview of layout

### GroupManager

- Create/edit/delete groups
- Drag to reorder groups
- Set group color

### WidgetSettingsPanel

- Slide-out panel when clicking widget config
- Size selector
- Refresh interval selector
- Display toggles
- Widget-specific configuration

---

## Constitution Alignment

✅ **Modularity**: Profiles extend widget system without modifying core
✅ **User Empowerment**: Maximum customization control
✅ **Data Ownership**: Export/import enables user data portability
✅ **Performance**: Optimistic updates, no page reloads
✅ **Tier Respect**: Profile limits enforce tier boundaries

---

## Dependencies

- Phase 2 widget system complete
- Database migrations for new tables
- Frontend state management updates

---

## Success Metrics

- Profile creation rate > 30% of active users
- Average profiles per user: 2.5+
- Profile switch time p95 < 500ms
- User satisfaction score for customization: 4.5/5

---

## Open Questions

1. Should profiles sync across devices automatically?
2. Should there be a "profile marketplace" for sharing configurations?
3. How to handle widgets that are in a profile but user downgrades tier?
