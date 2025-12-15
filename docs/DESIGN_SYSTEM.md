# DAEMON Design System Documentation

> **⚠️ CRITICAL PRESERVATION NOTICE**  
> This document archives the complete DAEMON UX architecture. DO NOT delete or modify without explicit approval.  
> If refactoring, UPDATE this document first, then implement changes.

---

## Overview

DAEMON uses a premium glassmorphic design system with responsive navigation, animated blobs, and a comprehensive widget architecture. Built with React, Tailwind CSS, and custom CSS animations.

## Typography

### Fonts
- **Headings**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) - Modern, geometric sans-serif
- **Body**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) - Monospace for readability

### Font Loading
Imported via Google Fonts in [`index.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/index.css):
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

---

## Color Palette

Defined in [`App.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css) CSS variables:

```css
--bg-color: #000000;                  /* Pure black background */
--surface-color: rgba(30, 30, 30, 0.65);  /* Glassmorphic surfaces */
--surface-border: rgba(255, 255, 255, 0.1);  /* Subtle borders */
--text-primary: #ffffff;              /* Primary text */
--text-secondary: #a0a0a0;            /* Secondary text */
--nav-bg: rgba(30, 30, 30, 0.9);      /* Navigation background */

/* Brand Accents */
--accent-coral: #FF6B6B;              /* Coral/red accent */
--accent-sand: #E6D5B8;               /* Sand/beige accent */
--accent-turquoise: #4ECDC4;          /* Turquoise/cyan accent */
--accent-purple: #6C5CE7;             /* Purple accent (primary) */
```

---

## Blob Animation System

### Architecture
5 animated blobs with distinct behaviors, rendered as fixed-position divs with CSS filters.

**Location**: [`App.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.tsx) lines 45-49  
**Styling**: [`App.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css) lines 44-220

### Blob Behaviors

| Blob | Color | Behavior | Animation | Description |
|------|-------|----------|-----------|-------------|
| `blob-1` | Turquoise | **Ferrofluid** | `morph` (10s) | Spiky, magnetic morphing effect with SVG filter |
| `blob-2` | Purple | **Pondscum** | `rotate-swirl` (40s) | Organic, cellular rotation with displacement |
| `blob-3` | Coral | **Bloom** | `breathe` (8s) | Radial gradient breathing/pulsing |
| `blob-4` | Sand | **Morph** | `morph-shape` (15s) | Fluid shape-shifting with border-radius |
| `blob-5` | Blue | **Accelerometer** | JS-controlled | Mouse/device tilt responsive (see below) |

### Accelerometer Implementation

**File**: [`App.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.tsx) lines 13-40

```tsx
useEffect(() => {
  const handleMove = (e: MouseEvent | DeviceOrientationEvent) => {
    const blob = document.querySelector('.blob-5') as HTMLElement;
    if (!blob) return;

    let x = 0, y = 0;

    if (window.DeviceOrientationEvent && e instanceof DeviceOrientationEvent) {
      // Mobile: Device tilt
      x = e.gamma ? e.gamma * 2 : 0;
      y = e.beta ? (e.beta - 45) * 2 : 0;
    } else if (e instanceof MouseEvent) {
      // Desktop: Mouse position
      x = (e.clientX - window.innerWidth / 2) / 10;
      y = (e.clientY - window.innerHeight / 2) / 10;
    }

    blob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  };

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('deviceorientation', handleMove as any);

  return () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('deviceorientation', handleMove as any);
  };
}, []);
```

### SVG Filters

Defined in [`index.html`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/index.html) lines 32-48:

- **Ferrofluid**: Gaussian blur + color matrix for gooey magnetic effect
- **Pondscum**: Fractal noise displacement for organic texture

---

## Navigation System

### Responsive Breakpoints
- **Mobile**: < 1024px - Bottom navigation
- **Desktop**: >= 1024px - Left sidebar

### Components

#### Bottom Navigation
**File**: [`BottomNav.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/components/BottomNav.tsx)

- Fixed position at screen bottom
- 4 nav items: Dashboard, Widgets, Projects, Settings
- Active state with purple accent (`--accent-purple`)
- Glassmorphic background with `backdrop-filter: blur(20px)`
- Safe-area inset padding for iOS notch

**Styling**: [`App.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css) lines 470-505

#### Desktop Sidebar
**File**: [`DesktopSidebar.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/components/DesktopSidebar.tsx)

- Fixed left sidebar, 240px width
- Logo at top, navigation in middle, user profile at bottom
- Same 4 nav items as mobile
- Hidden on mobile (< 1024px)

**Styling**: [`App.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css) lines 508-610

### Integration

**File**: [`App.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.tsx)

```tsx
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';

const [activeTab, setActiveTab] = React.useState('dashboard');

// Render
<DesktopSidebar activeTab={activeTab} onTabChange={setActiveTab} />
<BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
```

---

## Header System

### Mobile Header
- Logo (DAEMON wordmark + icon)
- Settings and Logout buttons
- Hidden on desktop (`lg:hidden`)

### Desktop Header
- Settings and Logout buttons only
- User name display
- Logo shown in sidebar instead
- Positioned with `left: 240px` to account for sidebar

**Implementation**: [`App.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.tsx) lines 58-85

---

## Widget System

### Architecture

All widgets follow a consistent pattern:
- Glassmorphic card background
- Icon + title header
- Custom scrollable content area
- Consistent spacing and sizing

### Widget List

**File**: [`WidgetGrid.tsx`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/components/WidgetGrid.tsx)

| Widget | File | Height | Column | Purpose |
|--------|------|--------|--------|---------|
| EmailWidget | `widgets/EmailWidget.tsx` | 300px | 1 | Email inbox summary |
| CalendarWidget | `widgets/CalendarWidget.tsx` | 300px | 1 | Schedule view |
| TaskWidget | `widgets/TaskWidget.tsx` | 300px | 1 | Task management |
| ObsidianWidget | `widgets/ObsidianWidget.tsx` | 200px | 2 | Vault overview |
| AIWidget | `widgets/AIWidget.tsx` | 350px | 2 | AI assistant chat |
| HeatmapWidget | `widgets/HeatmapWidget.tsx` | 200px | 2 | Activity heatmap |
| KanbanWidget | `widgets/KanbanWidget.tsx` | 300px | 2 | Kanban board |
| HabitTrackerWidget | `widgets/HabitTrackerWidget.tsx` | 250px | 3 | Habit tracking |
| MediaWidget | `widgets/MediaWidget.tsx` | 300px | 3 | Media library |
| MoodWidget | `widgets/MoodWidget.tsx` | 250px | 3 | Mood tracking |
| MusicWidget | `widgets/MusicWidget.tsx` | 250px | 3 | Music playback |
| ToyBoxWidget | `widgets/ToyBoxWidget.tsx` | 250px | 3 | Quick tools |

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 pb-24 md:pb-4">
  {/* 3 columns on desktop, 2 on tablet, 1 on mobile */}
</div>
```

---

## Branding

### Logo Files
- **Source**: `frontend/src/assets/logo.png` (531KB PNG)
- **App Icon**: `frontend/public/icon-192.png` (192x192)
- **PWA Icon**: `frontend/public/icon-512.png` (512x512)
- **Favicon**: `frontend/public/favicon.png`

### Logo Usage

**Mobile Header**:
```tsx
<img src="/src/assets/logo.png" alt="DAEMON Logo" className="w-8 h-8 rounded-lg" />
<span className="font-bold text-xl tracking-tight">DAEMON</span>
```

**Desktop Sidebar**:
```tsx
<img src="/src/assets/logo.png" alt="DAEMON" className="w-10 h-10 rounded-xl" />
<span>DAEMON</span>
```

### PWA Configuration

**Manifest**: [`public/manifest.json`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/public/manifest.json)
```json
{
  "name": "DAEMON",
  "short_name": "DAEMON",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone"
}
```

**Meta Tags**: [`index.html`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/index.html)
```html
<meta name="theme-color" content="#000000">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

---

## CSS Architecture

### File Structure

1. **[index.css](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/index.css)** - Entry point
   - Font imports (Google Fonts)
   - Tailwind directives
   - App.css import
   - Noise overlay
   - Custom scrollbar
   - Mobile optimizations

2. **[App.css](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css)** - Component styles
   - CSS variables
   - Blob animations
   - Glassmorphism utilities
   - Layout containers
   - Navigation styles
   - Widget card base styles

3. **[tailwind.config.js](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/tailwind.config.js)** - Tailwind extensions
   - Color tokens
   - Font families
   - Animation utilities

### Critical CSS Classes

```css
/* Glassmorphic card */
.glass-panel {
  background: var(--surface-color);
  backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border);
  border-radius: 24px;
  box-shadow: var(--shadow-soft);
}

/* App container (content area) */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 6rem; /* Space for mobile bottom nav */
  position: relative;
  z-index: 1; /* Above blobs */
}

/* Noise texture overlay */
.noise-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,..."); /* SVG noise pattern */
}
```

---

## Responsive Behavior

### Breakpoints

| Size | Range | Layout Changes |
|------|-------|----------------|
| Mobile | < 768px | Single column widgets, bottom nav visible |
| Tablet | 768px - 1023px | 2 column widgets, bottom nav visible |
| Desktop | >= 1024px | 3 column widgets, sidebar visible, bottom nav hidden |

### Desktop Adjustments

**File**: [`App.css`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/src/App.css) lines 565-610

```css
@media (min-width: 1024px) {
  .mobile-nav {
    display: none; /* Hide bottom nav */
  }

  .desktop-sidebar {
    display: flex; /* Show sidebar */
  }

  .app-container {
    margin-left: 240px; /* Push content */
    max-width: calc(100% - 240px);
  }

  header .logo {
    display: none; /* Logo in sidebar instead */
  }
}
```

---

## Build Configuration

### Vite Config

**File**: [`vite.config.ts`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/vite.config.ts)

```typescript
export default defineConfig({
  base: './', // Relative paths for Capacitor
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Capacitor (Android/iOS)

**File**: [`capacitor.config.ts`](file:///Users/ten/ANTIGRAVITY/DAEMON/frontend/capacitor.config.ts)

Build command:
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

## Preservation Checklist

Before modifying this design system:

- [ ] Read this document in full
- [ ] Understand blob animation architecture
- [ ] Test responsive breakpoints
- [ ] Verify navigation on mobile/desktop
- [ ] Check accessibility (keyboard, screen readers)
- [ ] Update this document with any changes
- [ ] Create backup of modified files

---

## Quick Reference

### Key File Locations

```
frontend/
├── index.html              # PWA meta tags, SVG filters
├── src/
│   ├── index.css           # Font imports, global styles
│   ├── App.css             # Blob animations, components
│   ├── App.tsx             # Navigation integration, blobs
│   ├── components/
│   │   ├── BottomNav.tsx   # Mobile navigation
│   │   ├── DesktopSidebar.tsx  # Desktop navigation
│   │   ├── WidgetGrid.tsx  # Widget layout
│   │   └── widgets/        # 12 widget components
│   └── assets/
│       └── logo.png        # DAEMON logo
└── public/
    ├── icon-192.png        # App icon
    ├── icon-512.png        # PWA icon
    ├── favicon.png         # Favicon
    └── manifest.json       # PWA manifest
```

### Design Tokens Quick Copy

```css
/* Colors */
--bg-color: #000000;
--accent-purple: #6C5CE7;
--accent-coral: #FF6B6B;
--accent-turquoise: #4ECDC4;
--accent-sand: #E6D5B8;

/* Typography */
--font-heading: 'Space Grotesk', sans-serif;
--font-body: 'JetBrains Mono', monospace;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

---

**Last Updated**: 2025-11-29  
**Version**: 1.0.0  
**Author**: DAEMON Development Team
