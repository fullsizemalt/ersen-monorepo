# Spec 004: CLI Dashboard & Dynamic TUI

## 1. Overview

This specification outlines the development of a robust, interactive Terminal User Interface (TUI) for DAEMON 2.0. The goal is to provide a "Matrix-like" experience where users can view and interact with their dashboard directly from the command line, with full support for dynamic grid layouts and rich widget rendering.

## 2. User Stories

### P0 - Critical

- **US-4.001**: As a user, I want a TUI dashboard that mirrors my web dashboard layout (rows/columns).
- **US-4.002**: As a user, I want the CLI dashboard to resize dynamically when I resize my terminal window.
- **US-4.003**: As a user, I want rich text rendering for all core widgets (Clock, Weather, Quote, Pomodoro, Crypto, Tasks).
- **US-4.004**: As a user, I want to navigate widget controls using keyboard shortcuts (e.g., Tab to switch focus, Enter to interact).

### P1 - High Priority

- **US-4.005**: As a user, I want to see live updates (e.g., clock ticking, stock prices) without screen flickering.
- **US-4.006**: As a user, I want a "command palette" in the TUI to perform actions like "Add Widget" or "Switch Profile".

## 3. Functional Requirements

### FR-4.1 TUI Grid System

- Must support a 12-column grid system similar to the web frontend.
- Must automatically reflow based on terminal width (e.g., 1 column on narrow terminals, 4 on wide).
- Must respect the `position` (x, y, w, h) data from the API.

### FR-4.2 Widget Renderers

- **Clock**: Digital ASCII art or large text clock.
- **Weather**: ASCII weather icons (Sun, Cloud, Rain) + temperature stats.
- **Quote**: Boxed text with word wrapping and author attribution.
- **Pomodoro**: Large countdown timer with ASCII progress bar.
- **Crypto/Stocks**: Sparkline charts (using Braille characters or blocks) for price trends.
- **Tasks**: Interactive list with checkboxes ( [x] / [ ] ).

### FR-4.3 Interaction

- **Focus Management**: Visual indicator (colored border) for the currently focused widget.
- **Input**: Support for text input (for labels, chat, etc.) within the TUI.
- **Global Keys**:
  - `q` / `Ctrl+C`: Quit
  - `r`: Refresh data
  - `Tab`: Cycle focus

## 4. Technical Architecture

### 4.1 Framework Choice: Ink (React-based)

- **Why**: Allows code sharing with the frontend (hooks, logic) and uses a familiar component model.
- **Libraries**:
  - `ink`: Core React renderer for CLI.
  - `ink-box`: For widget containers/borders.
  - `ink-text-input`: For interactive fields.
  - `ink-spinner`: For loading states.
  - `ink-gradient`: For that "premium" aesthetic.

### 4.2 Data Flow

- **CLI Client**: Fetches `Widget[]` from `/api/widgets/active`.
- **Layout Engine**: Maps web grid coordinates (0-12) to terminal character columns.
- **Renderer**: Loop over widgets -> Find matching TUI Component -> Render.

## 5. UI/UX Design

- **Theme**: "Cyberpunk / Hacker" aesthetic.
- **Colors**:
  - Primary: Neon Green / Amber (configurable).
  - Borders: Dimmed box-drawing characters.
  - Highlight: Bold/Inverted colors.
- **Responsiveness**:
  - `< 80 cols`: Single column stacks.
  - `80 - 120 cols`: 2 columns.
  - `> 120 cols`: 4 columns (Desktop parity).

## 6. Open Questions

- How to handle graphics-heavy widgets (e.g., dense charts)? -> *Strategy: Use Braille/Block characters.*
- Authentication in TUI? -> *Reuse existing `daemon login` token.*

## 7. Success Metrics

- TUI renders < 500ms after data fetch.
- Resizing window redraws layout instantly (< 100ms).
- All core widgets have a recognized TUI representation.
