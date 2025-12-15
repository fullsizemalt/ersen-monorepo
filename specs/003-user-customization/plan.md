# Phase 3: User Customization - Implementation Plan

**Spec**: [spec.md](./spec.md)  
**Created**: 2025-12-13  
**Estimated Duration**: 2-3 weeks

---

## Constitution Alignment Check

| Principle | How This Phase Aligns |
|-----------|----------------------|
| Modularity | Profiles are additive - existing dashboard still works |
| User Empowerment | Granular control over every aspect of layout |
| Data Ownership | Export/import for full data portability |
| Performance | Optimistic updates, no page reloads |
| Tier Respect | Free: 3 profiles, Standard: 5, Pro: 10 |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend                                │
├─────────────────────────────────────────────────────────────┤
│  ProfileContext     │  LayoutContext    │  WidgetContext    │
│  - currentProfile   │  - columnCount    │  - widgets        │
│  - profiles[]       │  - groups[]       │  - displaySettings│
│  - switchProfile()  │  - updateLayout() │  - reorder()      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
├─────────────────────────────────────────────────────────────┤
│  /api/profiles/*    │  /api/groups/*    │  /api/widgets/*   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database                                │
├─────────────────────────────────────────────────────────────┤
│  dashboard_profiles │  widget_groups    │  widget_instances │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Migrations

### Migration 1: dashboard_profiles

```sql
CREATE TABLE dashboard_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(32) NOT NULL,
  icon VARCHAR(16) DEFAULT '📊',
  is_default BOOLEAN DEFAULT false,
  column_count INTEGER DEFAULT 4 CHECK (column_count BETWEEN 1 AND 6),
  theme_override VARCHAR(32),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_user ON dashboard_profiles(user_id);
```

### Migration 2: widget_groups

```sql
CREATE TABLE widget_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES dashboard_profiles(id) ON DELETE CASCADE,
  name VARCHAR(32) NOT NULL,
  color_accent VARCHAR(16) DEFAULT '#3b82f6',
  sort_order INTEGER DEFAULT 0,
  is_collapsed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_groups_profile ON widget_groups(profile_id);
```

### Migration 3: Enhance active_widgets

```sql
ALTER TABLE active_widgets
  ADD COLUMN profile_id UUID REFERENCES dashboard_profiles(id) ON DELETE CASCADE,
  ADD COLUMN group_id UUID REFERENCES widget_groups(id) ON DELETE SET NULL,
  ADD COLUMN display_settings JSONB DEFAULT '{"size":"normal","refreshInterval":0,"showTitle":true,"backgroundOpacity":100}',
  ADD COLUMN sort_order INTEGER DEFAULT 0;

CREATE INDEX idx_widgets_profile ON active_widgets(profile_id);
```

### Migration 4: Data Migration

```sql
-- Create default profile for existing users
INSERT INTO dashboard_profiles (user_id, name, is_default)
SELECT DISTINCT user_id, 'Default', true
FROM active_widgets;

-- Link existing widgets to default profile
UPDATE active_widgets aw
SET profile_id = (
  SELECT id FROM dashboard_profiles dp
  WHERE dp.user_id = aw.user_id AND dp.is_default = true
);
```

---

## Implementation Steps

### Phase 3.1: Database & Backend Foundation (3 days)

1. Create database migrations
2. Implement Profile CRUD endpoints
3. Implement Group CRUD endpoints
4. Update Widget endpoints for profile/group
5. Add tier-based profile limits
6. Write unit tests

### Phase 3.2: Frontend Context & State (2 days)

1. Create ProfileContext
2. Create LayoutContext
3. Migrate Dashboard to use contexts
4. Add profile loading/switching logic
5. Implement optimistic updates

### Phase 3.3: Profile Switcher UI (2 days)

1. ProfileSwitcher component in header
2. Profile dropdown with icons
3. Quick-switch functionality
4. "Manage Profiles" link

### Phase 3.4: Profile Manager Settings (2 days)

1. Settings page route (/settings/profiles)
2. Profile list with CRUD
3. Column count configuration
4. Default profile toggle
5. Theme override picker

### Phase 3.5: Widget Groups (3 days)

1. Group creation UI
2. Collapsible group sections
3. Drag widgets between groups
4. Group color customization
5. Group reordering

### Phase 3.6: Widget Display Settings (2 days)

1. WidgetSettingsPanel slide-out
2. Size selector (compact/normal/expanded)
3. Refresh interval picker
4. Display toggles

### Phase 3.7: Import/Export (1 day)

1. Export profile as JSON
2. Import profile from JSON
3. Validation and error handling

### Phase 3.8: Polish & Testing (2 days)

1. Mobile responsive testing
2. Profile switch performance optimization
3. E2E tests for critical flows
4. Documentation updates

---

## Component Structure

```
frontend/src/
├── contexts/
│   ├── ProfileContext.tsx      # NEW
│   └── LayoutContext.tsx       # NEW
├── components/
│   ├── layout/
│   │   └── ProfileSwitcher.tsx # NEW
│   ├── settings/
│   │   ├── ProfileManager.tsx  # NEW
│   │   ├── ProfileEditor.tsx   # NEW
│   │   └── LayoutSettings.tsx  # NEW
│   └── widgets/
│       ├── GroupSection.tsx    # NEW
│       └── WidgetSettingsPanel.tsx # NEW
├── pages/
│   └── Settings.tsx            # NEW or enhance
└── services/
    └── profileApi.ts           # NEW
```

---

## API Implementation Order

1. `GET/POST /api/profiles` - List and create
2. `PATCH/DELETE /api/profiles/:id` - Update and delete
3. `POST /api/profiles/:id/set-default` - Set default
4. `GET/POST /api/profiles/:profileId/groups` - Groups
5. `GET/PATCH /api/profiles/:profileId/widgets` - Enhanced widgets
6. `GET/POST /api/profiles/:id/export` - Import/export

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Existing user data loss | Careful migration with default profile creation |
| Performance degradation | Lazy load profiles, cache active profile |
| Complex state management | Use React Context with useReducer |
| Mobile layout issues | Column override for small screens |

---

## Success Criteria

- [ ] Users can create/switch profiles
- [ ] Column count is configurable per profile
- [ ] Widget groups work with drag-and-drop
- [ ] Layout persists across sessions
- [ ] Mobile still works (forced 1-2 columns)
- [ ] Profile switch < 500ms
- [ ] Export/import functional
- [ ] Tier limits enforced
