# CLI & ASCII Widget System

## Overview
The CLI & ASCII Widget System is a core feature of DAEMON 2.0, allowing users to interact with the platform via a terminal interface. This is not just a theme, but a fully functional CLI environment where users can view widgets, manage their dashboard, and execute commands.

## Features

### 1. CLI Login
- Users can log in via the CLI using an API key or a device flow.
- Command: `daemon login`

### 2. ASCII Widgets
- All graphical widgets will have an ASCII counterpart.
- Widgets render in the terminal using standard ANSI escape codes for colors and formatting.
- Examples:
    - **System Monitor**: ASCII charts for CPU/RAM usage.
    - **Weather**: ASCII art weather icons.
    - **Calendar**: Text-based calendar grid.
    - **Spotify**: Now playing track info with progress bar.

### 3. Dashboard Compositions (TUI)
- Users can save and load dashboard layouts (compositions).
- A TUI (Text User Interface) mode allows arranging widgets in a grid.
- Command: `daemon dashboard` or `daemon ui`

### 4. Command Interface
- Execute system commands and control widgets.
- Examples:
    - `daemon widget install <widget-id>`
    - `daemon widget list`
    - `daemon spotify next`
    - `daemon system reboot`

## Implementation Plan

### Phase 1: CLI Foundation
- [ ] Set up `daemon-cli` project (Node.js or Go).
- [ ] Implement authentication flow.
- [ ] Create basic command structure (commander.js or cobra).

### Phase 2: Widget Renderer
- [ ] Create `AsciiWidget` interface.
- [ ] Implement renderer for basic widgets (Clock, Weather, System).
- [ ] Add support for colors and formatting (chalk, blessed).

### Phase 3: TUI Dashboard
- [ ] Implement TUI using `blessed` or `ink`.
- [ ] Create grid layout system for terminal.
- [ ] **Responsive Layouts**:
    - Widgets automatically resize and reflow when terminal window is resized.
    - Support for different breakpoints (e.g., compact view for small terminals).
    - "Fluid" ASCII art that scales or truncates gracefully.
- [ ] Add keyboard navigation support.

### Phase 4: Compositions
- [ ] Save/Load layout configurations to backend.
- [ ] Sync layouts between Web and CLI.

## Technical Stack
- **Language**: Node.js (TypeScript) or Go (for single binary).
- **Libraries**:
    - `ink` (React for CLI) - Recommended for sharing logic with frontend.
    - `commander` (CLI framework).
    - `chalk` (Styling).
    - `axios` (API requests).

## User Experience
```bash
$ daemon login
> Authenticated as ten

$ daemon dashboard
+----------------------+----------------------+
|  CPU: [||||||....]   |  San Francisco, CA   |
|  RAM: [||........]   |   _   65°F           |
|                      |  ( )                 |
+----------------------+----------------------+
|  Now Playing:        |  TODO:               |
|  Daxten - Gravity    |  [x] Buy milk        |
|  [||||......] 1:23   |  [ ] Walk dog        |
+----------------------+----------------------+
```
