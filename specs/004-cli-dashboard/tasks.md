# Phase 4 Tasks: CLI Dashboard

**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

---

## Task 4.1: Foundation

- [ ] **T4.001**: Install `ink`, `react`, `ink-box`, `ink-gradient`, `ink-big-text` to `cli/` dependencies.
- [ ] **T4.002**: Create `src/ui/` directory structure.
- [ ] **T4.003**: Create `src/ui/App.tsx` as the TUI root component.
- [ ] **T4.004**: Update `dashboard.ts` to launch Ink app on start.

## Task 4.2: Layout System

- [ ] **T4.005**: Create `src/ui/components/Grid.tsx`.
- [ ] **T4.006**: Implement column calculation logic based on `process.stdout.columns`.
- [ ] **T4.007**: Add resize listener hook (`useStdoutDimensions`).

## Task 4.3: Widget Components

- [ ] **T4.008**: Create `src/ui/widgets/Wrapper.tsx` (Box with title).
- [ ] **T4.009**: Create `src/ui/widgets/Clock.tsx` (Big text).
- [ ] **T4.010**: Create `src/ui/widgets/Weather.tsx` (Fetch + ASCII).
- [ ] **T4.011**: Create `src/ui/widgets/Quote.tsx`.
- [ ] **T4.012**: Create `src/ui/widgets/Pomodoro.tsx` (Shared logic with frontend?).
- [ ] **T4.013**: Create `src/ui/widgets/Fallback.tsx` (For unknown widgets).

## Task 4.4: Integration

- [ ] **T4.014**: Update `WidgetRenderer` to return Ink components instead of strings.
- [ ] **T4.015**: Pass API data from `dashboard.ts` into `App` props.
- [ ] **T4.016**: Test with `--demo` mode (ensure parity).

## Task 4.5: Polish

- [ ] **T4.017**: Add "Loading" spinner using `ink-spinner`.
- [ ] **T4.018**: Add "Offline/Error" states visually.
- [ ] **T4.019**: Ensure `Ctrl+C` exits cleanly.
