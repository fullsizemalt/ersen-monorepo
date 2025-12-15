# Specification: Phase 2 - Widget Implementation

**Feature Branch**: `002-widget-implementation`  
**Created**: 2025-12-13  
**Status**: Draft  
**Depends On**: Phase 1 Foundation (Complete)

## 1. Overview

This phase implements the core widget library, porting existing widgets from DAEMON 1.0 and creating new enterprise-grade widgets. The goal is to have 24+ functional widgets with proper configuration, state management, and responsive design.

## 2. User Stories

### US-2.1 - Widget Rendering (Priority: P1) 🎯 MVP

As a user, I want installed widgets to render correctly on my dashboard so that I can use their functionality.

**Why this priority**: Core functionality - widgets must render correctly for any user value.

**Independent Test**: Install a widget from marketplace → See it render on dashboard with proper styling.

**Acceptance Scenarios**:

1. **Given** a user has installed the Clock widget, **When** they view the dashboard, **Then** the widget displays the current time with proper formatting.
2. **Given** a user has installed multiple widgets, **When** they view the dashboard, **Then** all widgets render independently without interference.
3. **Given** a widget has an error, **When** the dashboard loads, **Then** only that widget shows an error state; other widgets remain functional.

---

### US-2.2 - Widget Configuration (Priority: P1)

As a user, I want to configure widget settings so that widgets display information relevant to me.

**Why this priority**: Personalization is key to user engagement.

**Independent Test**: Open widget settings → Change a configuration option → See widget update immediately.

**Acceptance Scenarios**:

1. **Given** a user opens Clock widget settings, **When** they select 24-hour format, **Then** the clock displays time in 24-hour format.
2. **Given** a user opens Weather widget settings, **When** they enter a location, **Then** the widget shows weather for that location.
3. **Given** a user changes widget settings, **When** they close the settings panel, **Then** the settings persist across sessions.

---

### US-2.3 - Widget Resizing & Positioning (Priority: P2)

As a user, I want to resize and reposition widgets on my dashboard so that I can customize my layout.

**Why this priority**: Important for personalization but not blocking basic functionality.

**Independent Test**: Drag widget to new position → Resize widget → Refresh page → Layout persists.

**Acceptance Scenarios**:

1. **Given** a user drags a widget, **When** they release it, **Then** the widget snaps to the grid in the new position.
2. **Given** a user resizes a widget, **When** they release the handle, **Then** the widget adjusts to the new size with proper content scaling.
3. **Given** a user customizes their layout, **When** they refresh the page, **Then** the layout is preserved exactly.

---

### US-2.4 - Widget Categories & Search (Priority: P2)

As a user, I want to browse widgets by category and search for specific widgets so that I can quickly find what I need.

**Why this priority**: Improves discoverability as widget catalog grows.

**Independent Test**: Browse categories in marketplace → Search for "weather" → See filtered results.

**Acceptance Scenarios**:

1. **Given** a user is on the Marketplace, **When** they select "Productivity" category, **Then** only productivity widgets are displayed.
2. **Given** a user searches for "spotify", **When** results appear, **Then** the Spotify widget is shown prominently.
3. **Given** a user's search has no results, **When** they view the marketplace, **Then** a helpful "no results" message is displayed.

---

### US-2.5 - OAuth Widget Integration (Priority: P3)

As a user, I want widgets that require external services (Spotify, GitHub) to connect via OAuth so that I can access my data securely.

**Why this priority**: Required for standard/pro tier value but complex implementation.

**Independent Test**: Click "Connect Spotify" → Complete OAuth flow → See Spotify data in widget.

**Acceptance Scenarios**:

1. **Given** a user adds the Spotify widget, **When** they click "Connect Spotify", **Then** they are redirected to Spotify's OAuth page.
2. **Given** a user completes OAuth, **When** they return to DAEMON, **Then** the widget displays their currently playing track.
3. **Given** a user disconnects a service, **When** they view the widget, **Then** it shows "Connect" button again.

---

### US-2.6 - Widget Data Refresh (Priority: P3)

As a user, I want widgets to automatically refresh their data so that I always see current information.

**Why this priority**: Nice-to-have for real-time feel, can work with manual refresh initially.

**Independent Test**: Weather widget auto-refreshes every 15 minutes → Data updates without interaction.

**Acceptance Scenarios**:

1. **Given** a Weather widget, **When** 15 minutes pass, **Then** the widget fetches and displays updated data.
2. **Given** a widget is refreshing, **When** the user views it, **Then** a subtle loading indicator is shown without blocking content.
3. **Given** a widget refresh fails, **When** the user views it, **Then** the last successful data is shown with an error indicator.

---

### Edge Cases

- What happens when a widget's API is unavailable? → Show cached data with error indicator
- What happens when a widget crashes during render? → Error boundary catches and shows fallback UI
- What happens when widget config is corrupted? → Reset to defaults and notify user
- What happens when user has 50 widgets at once? → Performance must remain acceptable (<1s render)

## 3. Requirements

### Functional Requirements

- **FR-2.01**: System MUST implement error boundaries around each widget to prevent cascade failures
- **FR-2.02**: System MUST support widget configuration via JSON schema with validation
- **FR-2.03**: System MUST persist widget positions and sizes to database
- **FR-2.04**: System MUST support lazy loading of widget components
- **FR-2.05**: System MUST implement OAuth integration service for external APIs
- **FR-2.06**: System MUST provide widget-level caching with configurable TTL
- **FR-2.07**: System MUST support widget search and filtering by category/tier
- **FR-2.08**: System MUST implement responsive widget grid (CSS Grid + react-grid-layout)

### Non-Functional Requirements

- **NFR-2.01**: Dashboard with 20 widgets MUST render in <1s
- **NFR-2.02**: Widget configuration changes MUST save in <500ms
- **NFR-2.03**: OAuth connections MUST complete in <10s
- **NFR-2.04**: Widget refresh operations MUST include timeout handling (max 30s)

### Key Entities

- **WidgetTemplate**: Definition of a widget type (slug, name, tier, configSchema, thumbnail)
- **ActiveWidget**: Instance of widget for a user (userId, templateId, config, position)
- **Integration**: OAuth connection for user (userId, provider, accessToken, refreshToken, expiresAt)

## 4. Widget Catalog (Phase 2 Target)

### Free Tier Widgets (12)

| Widget | Description | Config Options |
|--------|-------------|----------------|
| clock | Digital/analog clock | timezone, format, style |
| weather | Current weather | location, units |
| calculator | Basic calculator | scientific mode |
| sticky-notes | Note-taking | color, fontSize |
| pomodoro | Focus timer | durations, sounds |
| quote | Daily quotes | category |
| task-manager | Todo list | sort, filter |
| habit-tracker | Habit tracking | habits, frequency |
| ai-assistant | Chat interface | model, systemPrompt |
| mood-tracker | Mood logging | scale, reminders |
| toybox | Fun animations | gameType |
| heatmap | Activity heatmap | dataSource, colorScheme |

### Standard Tier Widgets (+7)

| Widget | Description | OAuth Required |
|--------|-------------|----------------|
| gmail | Email inbox | Yes - Google |
| google-calendar | Events view | Yes - Google |
| github | Activity feed | Yes - GitHub |
| spotify | Now playing | Yes - Spotify |
| obsidian | Notes sync | No - Local API |
| kanban | Project board | No |
| music-download | YT-DLP interface | No |

### Pro Tier Widgets (+5)

| Widget | Description | OAuth Required |
|--------|-------------|----------------|
| grafana | Metrics dashboards | Yes - Grafana |
| prometheus | Metrics display | No - API |
| jellyfin | Media library | Yes - Jellyfin |
| plex | Media library | Yes - Plex |
| audiobookshelf | Audiobook library | Yes - ABS |

## 5. Success Criteria

### Measurable Outcomes

- **SC-2.01**: 24+ widgets implemented and functional
- **SC-2.02**: Dashboard renders in <1s with 10 active widgets
- **SC-2.03**: 0 uncaught widget errors propagate to main app
- **SC-2.04**: Widget config persistence works across sessions (100% reliability)
- **SC-2.05**: OAuth integrations work for Spotify, GitHub, Google (all 3 tested)
