# Future Enhancements

## Modular Widget System

### User Onboarding Flow
- **Module Selection**: Users choose which integrations to connect (Obsidian, Email, Calendar, Music, etc.)
- **Widget Customization**: Users select which widgets to display from connected modules
- **Layout Personalization**: Drag-and-drop widget repositioning
- **Saved Layouts**: Multiple layout presets for different contexts

### Implementation Notes
- Create `OnboardingFlow` component with step-by-step module selection
- Widget registry system with dynamic imports
- User preferences stored in backend (`/api/user/preferences`)
- Widget visibility toggle in settings

---

## Client Hub Integration

### Bottom Nav Client Tab
- **Purpose**: Connect to client-facing project management hub app
- **Location**: Add "Clients" tab to BottomNav between Projects and Settings
- **Icon**: Use `Users` or `Briefcase` from lucide-react
- **API Endpoint**: `/api/clients` (to be built)
- **Integration**: Link to separate client management hub app

### Implementation Checklist
- [ ] Add Clients tab to `BottomNav.tsx`
- [ ] Add Clients tab to `DesktopSidebar.tsx`
- [ ] Create `ClientsView` component
- [ ] Build `/api/clients` endpoint
- [ ] Define client data model
- [ ] Sync with external project management hub

---

## Blob Control Settings

### Granular Blob Customization
Add settings panel in SettingsMenu for blob control:

- **Blob Count**: Toggle individual blobs on/off (1-5)
- **Behavior Selection**: Choose animation for each blob
  - Ferrofluid (magnetic)
  - Pondscum (organic)
  - Bloom (breathing)
  - Morph (shape-shifting)
  - Accelerometer (responsive)
  - Pulse (pulsing)
  - Phase (synchronized)
- **Color Customization**: Custom color picker for each blob
- **Intensity**: Slider for blur amount (20-100px)
- **Speed**: Animation speed multiplier (0.5x - 2x)
- **Opacity**: Individual opacity control (0.2 - 1.0)

### Storage
Preferences saved to `localStorage` and synced to backend:
```json
{
  "blobs": [
    { "enabled": true, "behavior": "ferrofluid", "color": "#4ECDC4", "blur": 80, "speed": 1, "opacity": 0.7 },
    { "enabled": true, "behavior": "pondscum", "color": "#6C5CE7", "blur": 40, "speed": 1, "opacity": 0.5 }
  ]
}
```

---

## Progressive Widget Loading

### Lazy Loading
- Import widgets dynamically with `React.lazy()` and `Suspense`
- Only load widgets that are visible/enabled
- Reduces initial bundle size

### Performance Monitoring
- Track widget render time
- Identify slow widgets
- Suggest disabling heavy widgets on low-end devices

---

## God Mode Features (from previous doc)

- **Smart Scheduling**: AI-powered task prioritization
- **Habit Stacking**: Automated habit chain suggestions
- **Focus Sessions**: Pomodoro timer with distraction blocking
- **Mood Insights**: Correlation analysis (mood vs sleep, weather, etc.)
- **Life Dashboard**: High-level metrics and trends
- **Voice Commands**: Hands-free task management
- **Integration Hub**: Connect unlimited third-party services
- **Automation Rules**: If-this-then-that workflow builder

---

**Document Created**: 2025-11-29  
**Status**: Specification Phase
