# Ersen: Personal Operating System - Project Context

**Version**: 2.0.0 (Alpha)
**Date**: December 2025
**Mission**: To create a "Personal Operating System" for the web—a highly customizable, aesthetic, and widget-based dashboard that consolidates a user's digital life into a single, beautiful interface.

---

## 1. Executive Summary

Ersen is a web-based dashboard application inspired by the "Bento" design trend and "Linear" aesthetic. It moves away from sterile, utilitarian admin panels toward a "cozy web" philosophy. It allows users to arrange interactive widgets (clocks, calendars, music players, system monitors) on a grid.

**Core Value Proposition**:

- **Aesthetic First**: Built on the "Aura UI" design system (glassmorphism, subtle gradients, sharp corners).
- **Privacy Focused**: Self-hostable or private cloud.
- **Highly Modular**: Everything is a widget.
- **Persona-Based**: Pre-configured layouts for different roles (Developer, Streamer, Home Chef).

---

## 2. Technology Stack

### Frontend

- **Framework**: React 18 + Vite (TypeScript).
- **Styling**: TailwindCSS + Custom "Aura UI" variables (CSS variables for theming).
- **Layout Engine**: `react-grid-layout` for drag-and-drop.
- **Icons**: `lucide-react` (Flat style).
- **Animation**: `framer-motion` (for polished transitions).
- **State**: React Context API (`AuthContext`, `WidgetContext`).
- **i18n**: `i18next` (English, Spanish, etc.).

### Backend

- **Runtime**: Node.js + Express (TypeScript).
- **Database**: PostgreSQL 15 (hosted on Hetzner via Docker).
- **ORM**: Raw SQL queries (via `pg` pool) for performance and control.
- **Authentication**: JWT-based + WorkOS Integration (Google, GitHub, Microsoft SSO).
- **Payments**: Stripe Integration (Subscriptions, Coupons).

### Infrastructure

- **Hosting**: Hetzner VPS (Ubuntu).
- **Orchestration**: Docker Compose (services: `frontend`, `backend`, `db`, `traefik`).
- **Reverse Proxy**: Traefik v3 (Auto-SSL via Let's Encrypt).
- **CI/CD**: GitHub Actions / Manual Deploy Scripts.

---

## 3. Design System: "Aura Linear"

The application follows a strict design language to ensure premium quality.

- **Philosophy**: "Soft Light, Sharp Edges."
- **Visuals**:
  - **Radius**: `0.3rem` (Sharp/Linear standard).
  - **Borders**: 1px solid white/10 (Subtle).
  - **Backgrounds**: `bg-zinc-950` (Deep black) with `backdrop-blur` overlays.
  - **Typography**: Inter / Sans-serif. Monospace for data.
- **Components**:
  - **Glass Card**: Translucent backgrounds.
  - **Glow Effects**: Subtle gradients that follow mouse or state.
  - **WidgetIcon**: Uniform icon container with variant styles (flat, glow, glass).

---

## 4. Current Features (Implemented)

### Core Dashboard

- **Drag & Drop Grid**: Users can resize and move 20+ types of widgets.
- **Edit Mode**: "Jiggle" mode for customization.
- **Global Search**: `Cmd+K` interface (planned).

### Widget Library

1. **Productivity**: To-Do List, Sticky Notes, Pomodoro Timer.
2. **Time**: World Clock, Countdown, Stopwatch.
3. **Aesthetic**:
    - **Retro Flip-Board**: Solari-style departure board (Canvas/CSS).
    - **Photo Frame**: Unsplash/Upload slideshow (Framer Motion).
    - **Screensaver**: DVD Bounce, Starfield, Matrix Rain (Canvas).
4. **Utilities**: QR Code Generator (Wi-Fi sharing), Weather (OpenMeteo).
5. **Streaming**: Streamer Tools (Twitch Chat embed mock, Live Status).

### Authentication & Admin

- **SSO**: Log in with Google/GitHub/Microsoft.
- **Guest Mode**: Try without logging in (local storage only).
- **Admin Panel**:
  - Manage Users (Ban, promote).
  - System Health Logs.
  - Promotions/Coupons Management (Stripe).

---

## 5. Roadmap & Future Specs

### Phase A: Compliance & Documentation (Current Sprint)

- **i18n**: Full translation support (en, es, de, jp).
- **Accessibility**: WCAG 2.1 AA compliance (ARIA labels, Keyboard nav).

### Phase B: Premium Experience ("Pro" Tier)

- **Voice Control**: "Hey Ersen, set a timer" (Web Speech API).
- **AI Assistant**: Context-aware suggestions within widgets.
- **File Converter (`widget-converter`)**:
  - **Function**: Drag & drop file conversion (e.g., HEIC to JPG, PDF to Doc, WebP to PNG).
  - **Implementation**: WASM-based (ffmpeg.wasm) for privacy/local processing, or cloud-based for heavy lifting.
  - **UI**: Minimalist drop zone with progress rings.
- **Background Audio (`widget-ambiance`)**:
  - **Function**: High-quality ambient noise generator for focus/relaxation.
  - **Modes**: White/Pink/Brown noise, Crackling Fire, Thunderstorm, Coffee Shop.
  - **UI**: Slider controls for mixing sounds (e.g., 50% Rain + 20% Thunder).

### Phase C: Community & Arcade

1. **Micro-Games Arcade**:
    - WarioWare-style mini-games played in 2x2 widgets.
    - **Multiplayer**: Room-code based peer-to-peer play.
    - **Titles**:
        - **Retro**: Snake, Pong, Micro-Battleship.
        - **Sim**: Drug Wars (Market Sim).
        - **Action**: Brick Breaker (Arkanoid style), Kaboom (Catching bombs), Shell Game (Focus test).
2. **Community Bulletin**:
    - Geo-fenced or Interest-based "digital corkboard".
    - Post-it note aesthetic.

### Phase D: Deep Integrations

1. **Media & Entertainment (The "Couch Potato" Stack)**:
    - **Trakt**: Synchronize watch history, "Up Next" to-watch list.
    - **IMDb / Rotten Tomatoes**: Widget showing ratings for currently playing movies (via Plex/Jellyfin hooks).
    - **Letterboxd**: Display latest reviews or "Diary" grid.
2. **Health & Fitness (The "Quantified Self" Stack)**:
    - **Aggregators**: Apple Health, Google Health/Sleep (via API or export).
    - **Wearables**: Fitbit, Garmin, Strava (Activity heatmaps, daily step counts).
    - **Sleep**: Widget visualizing sleep stages (REM, Deep, Light).
3. **Social & News (The "Digital Town Square" Stack)**:
    - **Bluesky**: Timeline feed, "What's Hot", and post composer using AT Protocol.
    - **Mastodon**: Instance-specific local feed, notifications, and federated timeline.
    - **RSS / News**: Aggregated news reader with "Reader Mode" parsing.

---

## 6. Directory Structure Overview

```text
ersen.xyz/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── widgets/ (Individual widget logic)
│   │   │   ├── common/  (Shared UI: WidgetGrid, WidgetIcon, FlipDigit)
│   │   ├── pages/       (Dashboard, Login, Admin)
│   │   ├── locales/     (i18n JSON files)
│   │   └── index.css    (Tailwind + Aura variables)
├── backend/
│   ├── src/
│   │   ├── controllers/ (Auth, Admin, Widget)
│   │   ├── services/    (Stripe, WorkOS, DB)
│   │   └── routes/
├── docker-compose.prod.yml (Production orchestration)
└── scripts/ (Deployment utilities)
```

---

## 7. Key User Personas

1. **The Commuter**: Mobile-first layout. Big clock, transit status, weather.
2. **The Streamer**: Dark mode command center. Twitch chat, system vitals, Spotify.
3. **The Receptionist**: Kiosk mode. Welcome message, company photos, Wi-Fi QR code.
