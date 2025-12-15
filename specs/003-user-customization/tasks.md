# Phase 3: User Customization - Task Breakdown

**Spec**: [spec.md](./spec.md)  
**Plan**: [plan.md](./plan.md)  
**Created**: 2025-12-13

---

## Task 3.1: Database & Backend Foundation

### Database Migrations (3-4 hours)

- [ ] **T3.001**: Create `dashboard_profiles` table migration
- [ ] **T3.002**: Create `widget_groups` table migration
- [ ] **T3.003**: Alter `active_widgets` table to add profile/group columns
- [ ] **T3.004**: Create data migration for existing users (default profile)
- [ ] **T3.005**: Add indexes for performance

### Profile API (4-5 hours)

- [ ] **T3.006**: Create `ProfileService` with CRUD methods
- [ ] **T3.007**: Implement `GET /api/profiles` - list user's profiles
- [ ] **T3.008**: Implement `POST /api/profiles` - create profile with tier limits
- [ ] **T3.009**: Implement `PATCH /api/profiles/:id` - update profile
- [ ] **T3.010**: Implement `DELETE /api/profiles/:id` - delete (prevent default deletion)
- [ ] **T3.011**: Implement `POST /api/profiles/:id/set-default`
- [ ] **T3.012**: Implement `POST /api/profiles/:id/duplicate`
- [ ] **T3.013**: Add tier-based profile count validation

### Group API (2-3 hours)

- [ ] **T3.014**: Create `GroupService` with CRUD methods
- [ ] **T3.015**: Implement `GET /api/profiles/:profileId/groups`
- [ ] **T3.016**: Implement `POST /api/profiles/:profileId/groups`
- [ ] **T3.017**: Implement `PATCH /api/profiles/:profileId/groups/:id`
- [ ] **T3.018**: Implement `DELETE /api/profiles/:profileId/groups/:id`
- [ ] **T3.019**: Implement `POST /api/profiles/:profileId/groups/reorder`

### Widget API Enhancement (2-3 hours)

- [ ] **T3.020**: Update widget endpoints to respect profile context
- [ ] **T3.021**: Add `display_settings` field to widget responses
- [ ] **T3.022**: Implement bulk widget reorder endpoint
- [ ] **T3.023**: Add group assignment to widget update

### Backend Tests (2 hours)

- [ ] **T3.024**: Unit tests for ProfileService
- [ ] **T3.025**: Unit tests for GroupService
- [ ] **T3.026**: Integration tests for profile switching

---

## Task 3.2: Frontend Context & State

### ProfileContext (3-4 hours)

- [ ] **T3.027**: Create `ProfileContext.tsx` with:
  - Profile list state
  - Current profile state
  - Switch profile action
  - Create/update/delete actions
- [ ] **T3.028**: Create `useProfile()` hook
- [ ] **T3.029**: Add ProfileProvider to App.tsx
- [ ] **T3.030**: Implement optimistic update pattern

### LayoutContext (2-3 hours)

- [ ] **T3.031**: Create `LayoutContext.tsx` with:
  - Column count state
  - Groups state
  - Widget order state
- [ ] **T3.032**: Create `useLayout()` hook
- [ ] **T3.033**: Integrate with ProfileContext (layout per profile)

### Dashboard Migration (2-3 hours)

- [ ] **T3.034**: Refactor Dashboard to use ProfileContext
- [ ] **T3.035**: Refactor Dashboard to use LayoutContext
- [ ] **T3.036**: Remove hardcoded demo widgets, use profile widgets
- [ ] **T3.037**: Handle profile loading states

---

## Task 3.3: Profile Switcher UI

### ProfileSwitcher Component (3-4 hours)

- [ ] **T3.038**: Create `ProfileSwitcher.tsx` dropdown component
- [ ] **T3.039**: Display current profile icon + name
- [ ] **T3.040**: Show list of all profiles with icons
- [ ] **T3.041**: Implement one-click profile switching
- [ ] **T3.042**: Add "Manage Profiles" link
- [ ] **T3.043**: Add to Layout.tsx header

### Mobile Profile Switcher (1-2 hours)

- [ ] **T3.044**: Mobile-friendly profile switcher variant
- [ ] **T3.045**: Swipe gesture to switch profiles (optional)

---

## Task 3.4: Profile Manager Settings

### Settings Page (4-5 hours)

- [ ] **T3.046**: Create `/settings` route and page
- [ ] **T3.047**: Create `ProfileManager.tsx` component
- [ ] **T3.048**: Profile list with edit/delete buttons
- [ ] **T3.049**: "Create Profile" button with modal
- [ ] **T3.050**: Default profile toggle (radio button)
- [ ] **T3.051**: Duplicate profile button

### Profile Editor (3-4 hours)

- [ ] **T3.052**: Create `ProfileEditor.tsx` modal/page
- [ ] **T3.053**: Name input (max 32 chars)
- [ ] **T3.054**: Icon/emoji picker
- [ ] **T3.055**: Column count slider (1-6)
- [ ] **T3.056**: Theme override selector
- [ ] **T3.057**: Save/cancel buttons

---

## Task 3.5: Widget Groups

### GroupSection Component (4-5 hours)

- [ ] **T3.058**: Create `GroupSection.tsx` collapsible section
- [ ] **T3.059**: Group header with name, color, collapse toggle
- [ ] **T3.060**: Render widgets within group
- [ ] **T3.061**: "Ungrouped" section for widgets without group

### Group Management (3-4 hours)

- [ ] **T3.062**: "Add Group" button in edit mode
- [ ] **T3.063**: Inline group name editing
- [ ] **T3.064**: Group color picker
- [ ] **T3.065**: Delete group (move widgets to ungrouped)
- [ ] **T3.066**: Drag-to-reorder groups

### Widget-Group Interaction (3-4 hours)

- [ ] **T3.067**: Drag widget between groups
- [ ] **T3.068**: Visual feedback during drag
- [ ] **T3.069**: Persist group assignment on drop
- [ ] **T3.070**: Handle widget order within group

---

## Task 3.6: Widget Display Settings

### WidgetSettingsPanel (4-5 hours)

- [ ] **T3.071**: Create `WidgetSettingsPanel.tsx` slide-out panel
- [ ] **T3.072**: Trigger from widget "settings" icon
- [ ] **T3.073**: Size selector (compact/normal/expanded)
- [ ] **T3.074**: Refresh interval dropdown
- [ ] **T3.075**: "Show title" toggle
- [ ] **T3.076**: Background opacity slider
- [ ] **T3.077**: Widget-specific config section (passthrough)
- [ ] **T3.078**: Save/cancel buttons

### Widget Display Logic (2-3 hours)

- [ ] **T3.079**: Apply size classes to widgets
- [ ] **T3.080**: Implement refresh interval logic
- [ ] **T3.081**: Respect showTitle setting in WidgetWrapper
- [ ] **T3.082**: Apply background opacity CSS

---

## Task 3.7: Import/Export

### Export (2 hours)

- [ ] **T3.083**: Implement `GET /api/profiles/:id/export`
- [ ] **T3.084**: Create export button in ProfileManager
- [ ] **T3.085**: Download JSON file with profile config

### Import (3 hours)

- [ ] **T3.086**: Implement `POST /api/profiles/import`
- [ ] **T3.087**: File upload UI in ProfileManager
- [ ] **T3.088**: Validation of imported JSON
- [ ] **T3.089**: Handle widget slug conflicts
- [ ] **T3.090**: Success/error feedback

---

## Task 3.8: Polish & Testing

### Performance (2-3 hours)

- [ ] **T3.091**: Profile switch performance optimization
- [ ] **T3.092**: Lazy load non-active profiles
- [ ] **T3.093**: Cache profile data in context

### Testing (3-4 hours)

- [ ] **T3.094**: E2E test: profile CRUD flow
- [ ] **T3.095**: E2E test: group management
- [ ] **T3.096**: E2E test: widget reordering
- [ ] **T3.097**: Mobile responsive testing

### Documentation (1-2 hours)

- [ ] **T3.098**: Update README with profile features
- [ ] **T3.099**: Update API documentation
- [ ] **T3.100**: Update CLAUDE.md with new components

---

## Task 3.9: Voice Input

### VoiceInput Component (3-4 hours)

- [ ] **T3.101**: Create `VoiceInputButton.tsx` component
- [ ] **T3.102**: Implement Web Speech API integration
- [ ] **T3.103**: Pulsing microphone animation during listening
- [ ] **T3.104**: Stop/cancel listening controls
- [ ] **T3.105**: Browser capability detection with fallback message
- [ ] **T3.106**: Create `useVoiceInput()` hook

### Integration (2-3 hours)

- [ ] **T3.107**: Add voice input to profile name field
- [ ] **T3.108**: Add voice input to group name field
- [ ] **T3.109**: Add voice input to Task Manager widget
- [ ] **T3.110**: Add voice input to Pomodoro label field
- [ ] **T3.111**: Add voice input to Quick Notes widget

---

## Task 3.10: Pomodoro Timer Labels

### Label UI (2-3 hours)

- [ ] **T3.112**: Add optional label input to Pomodoro start flow
- [ ] **T3.113**: Display label prominently during active timer
- [ ] **T3.114**: Show label in timer completion notification
- [ ] **T3.115**: Store recent labels in localStorage

### Label History (1-2 hours)

- [ ] **T3.116**: Autocomplete suggestions from recent labels
- [ ] **T3.117**: Clear label history option

---

## Progress Summary

| Section | Status | Tasks |
|---------|--------|-------|
| 3.1 Database & Backend | 🔴 Not Started | 0/26 |
| 3.2 Frontend Context | 🔴 Not Started | 0/11 |
| 3.3 Profile Switcher | 🔴 Not Started | 0/8 |
| 3.4 Profile Manager | 🔴 Not Started | 0/12 |
| 3.5 Widget Groups | 🔴 Not Started | 0/13 |
| 3.6 Display Settings | 🔴 Not Started | 0/12 |
| 3.7 Import/Export | 🔴 Not Started | 0/8 |
| 3.8 Polish & Testing | 🔴 Not Started | 0/10 |
| 3.9 Voice Input | 🔴 Not Started | 0/11 |
| 3.10 Pomodoro Labels | 🔴 Not Started | 0/6 |

**Overall Phase 3 Progress**: 0% complete (0/117 tasks)

---

## Next Priority Actions

1. **Complete Phase 2** - OAuth and remaining live API integrations
2. **Start T3.001-T3.005** - Database migrations
3. **Start T3.027-T3.030** - ProfileContext foundation
4. **Implement T3.038-T3.043** - ProfileSwitcher for quick wins

---

## Dependencies

- ✅ Phase 2.1 Widget Infrastructure (complete)
- ✅ Phase 2.2 Free Tier Widgets (complete)  
- 🔴 Phase 2.3 OAuth Infrastructure (not started)
- 🔴 Phase 2 completion recommended before Phase 3
