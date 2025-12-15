# Plan: CLI Dashboard (TUI)

## Phase 4.1: Foundation Setup

- [ ] Install `ink` and related dependencies (`react`, `ink-box`, `ink-big-text`).
- [ ] Configure TypeScript and build process for Ink.
- [ ] Create `renderTui()` entry point in `daemon dashboard` command.

## Phase 4.2: Grid Layout Engine

- [ ] Implement `TuiGrid` component.
- [ ] Create simple logic to map grid cells to terminal dimensions (`process.stdout.columns`).
- [ ] Handle window resize events (`SIGWINCH`) to trigger re-renders.

## Phase 4.3: Widget Component Library

- [ ] Create `WidgetWrapper` for TUI (borders, titles).
- [ ] Implement **ClockWidget** (using `ink-big-text`).
- [ ] Implement **WeatherWidget** (using ASCII icons).
- [ ] Implement **QuoteWidget** (simple text wrapping).
- [ ] Implement **PomodoroWidget** (timer logic + progress bar).
- [ ] Implement **MarkdownWidget** (for general content).

## Phase 4.4: Dynamic Rendering

- [ ] Update `WidgetRenderer` in `src/renderer.ts` to switch from string concat to React Ink components.
- [ ] Connect `dashboard` command to mount the Ink app.

## Phase 4.5: Interaction (Bonus)

- [ ] Add focus management (tabbing between widgets).
- [ ] Add keyboard shortcuts handler.
