# DAEMON 2.0 - Modular Widget Hub Refactor Plan

## Executive Summary

**Goal**: Transform DAEMON from a personal productivity dashboard into a monetized, modular widget hub platform supporting 100+ integrations across subscription tiers.

**Current State**: 12 functional widgets, monolithic architecture, no monetization  
**Target State**: 100+ modular widgets, tiered subscriptions, Android App Bundles, marketplace

---

## Phase 0: Assessment & Planning (Week 1)

### What We Keep ✅
1. **Design System** - Premium glassmorphic UI, blob animations, theme system
2. **Core Widgets** (12) - Task, AI, Calendar, Email, Mood, Obsidian, Music, Media, Habits, Heatmap, Kanban, ToyBox
3. **Navigation** - Responsive mobile/desktop nav (reuse as base)
4. **Authentication** - Extend with subscription awareness
5. **Docker Setup** - Build on existing infrastructure

### What We Refactor 🔄
1. **Widget Architecture** - Make truly modular with dynamic loading
2. **Database** - Migrate SQLite → PostgreSQL with new schema
3. **Backend API** - Add subscription, widget catalog, billing endpoints
4. **Frontend** - Widget marketplace, tier gating, onboarding flow
5. **Android Build** - Convert to AAB with dynamic feature modules

### What We Add 🆕
1. **Subscription System** - Stripe integration, tier management
2. **Widget Marketplace** - Browse, install, uninstall widgets
3. **Admin Dashboard** - Manage widgets, users, analytics
4. **100+ Widgets** - Build catalog across 3 phases
5. **Mobile App** - Capacitor → native with AABs

---

## Database Schema Refactor

### New PostgreSQL Schema

```sql
-- Users & Auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255),
    avatar_url TEXT,
    workfree_id VARCHAR(255) UNIQUE, -- SSO integration
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscription Tiers
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'standard', 'pro')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due')),
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Widget Templates (Read-Only Catalog)
CREATE TABLE widget_templates (
    id VARCHAR(100) PRIMARY KEY, -- e.g., 'task-manager', 'spotify-player'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- productivity, media, automation, etc.
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'standard', 'pro')),
    icon_url TEXT,
    default_config JSONB,
    required_integrations TEXT[], -- ['spotify', 'google-calendar']
    refresh_interval_seconds INT DEFAULT 300,
    size_preset VARCHAR(50), -- small, medium, large, custom
    version VARCHAR(20) DEFAULT '1.0.0',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User's Active Widgets (Instances)
CREATE TABLE active_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    widget_template_id VARCHAR(100) REFERENCES widget_templates(id),
    position_x INT,
    position_y INT,
    width INT,
    height INT,
    custom_config JSONB, -- User-specific settings
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, widget_template_id, position_x, position_y)
);

-- Third-Party Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- spotify, google, github, etc.
    provider_user_id VARCHAR(255),
    access_token_encrypted TEXT, -- AES-256
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMP,
    scopes TEXT[],
    metadata JSONB, -- provider-specific data
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, provider)
);

-- Widget Data Cache (Redis-backed)
CREATE TABLE widget_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    active_widget_id UUID REFERENCES active_widgets(id) ON DELETE CASCADE,
    data JSONB,
    last_refreshed TIMESTAMP DEFAULT NOW(),
    next_refresh TIMESTAMP,
    error_count INT DEFAULT 0,
    last_error TEXT
);

-- Usage Analytics
CREATE TABLE widget_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    widget_template_id VARCHAR(100),
    event_type VARCHAR(50), -- install, uninstall, interact, refresh
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_active_widgets_user ON active_widgets(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_integrations_user ON integrations(user_id);
CREATE INDEX idx_widget_cache_active ON widget_cache(active_widget_id);
```

---

## Backend Architecture

### New API Endpoints

#### Subscription Management
```typescript
POST   /api/subscriptions/checkout        // Create Stripe checkout session
POST   /api/subscriptions/portal          // Customer portal link
GET    /api/subscriptions/current         // User's current subscription
POST   /api/webhooks/stripe               // Stripe webhook handler
```

#### Widget Catalog
```typescript
GET    /api/widgets/catalog               // All available widgets (filtered by tier)
GET    /api/widgets/catalog/:id           // Widget details
GET    /api/widgets/recommendations       // Personalized suggestions
```

#### Active Widgets (User's Dashboard)
```typescript
GET    /api/widgets/active                // User's installed widgets
POST   /api/widgets/active                // Install widget
PATCH  /api/widgets/active/:id            // Update position/config
DELETE /api/widgets/active/:id            // Uninstall widget
POST   /api/widgets/active/:id/refresh    // Force refresh
```

#### Integrations (OAuth)
```typescript
GET    /api/integrations                  // User's connected services
POST   /api/integrations/:provider/auth   // Start OAuth flow
GET    /api/integrations/:provider/callback // OAuth callback
DELETE /api/integrations/:provider        // Disconnect
```

#### Admin
```typescript
GET    /api/admin/users                   // User management
GET    /api/admin/analytics               // Platform stats
POST   /api/admin/widgets/templates       // Add new widget template
PATCH  /api/admin/widgets/templates/:id   // Update widget
```

---

## Frontend Refactor

### New Components

#### 1. Widget Marketplace
```tsx
// src/pages/Marketplace.tsx
export const Marketplace = () => {
  const { subscription } = useSubscription();
  const [widgets, setWidgets] = useState<WidgetTemplate[]>([]);
  const [filter, setFilter] = useState<'all' | 'free' | 'standard' | 'pro'>('all');

  return (
    <div className="marketplace">
      <MarketplaceHeader />
      <FilterBar onFilterChange={setFilter} />
      <WidgetGrid>
        {widgets.map(widget => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            canInstall={canUserInstallWidget(widget, subscription)}
            onInstall={() => installWidget(widget.id)}
          />
        ))}
      </WidgetGrid>
    </div>
  );
};
```

#### 2. Subscription Upgrade Flow
```tsx
// src/components/SubscriptionUpgrade.tsx
export const SubscriptionUpgrade = () => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (tier: 'standard' | 'pro') => {
    setLoading(true);
    const { sessionUrl } = await api.post('/subscriptions/checkout', { tier });
    window.location.href = sessionUrl; // Redirect to Stripe
  };

  return (
    <div className="pricing-grid">
      <PricingCard
        tier="free"
        price="$0"
        features={['5 widget slots', '12 free widgets', 'Basic support']}
        current={true}
      />
      <PricingCard
        tier="standard"
        price="$7/mo"
        features={['20 widget slots', '40+ widgets', 'Email support']}
        onSelect={() => handleUpgrade('standard')}
      />
      <PricingCard
        tier="pro"
        price="$19/mo"
        features={['50 widget slots', '100+ widgets', 'Priority support', 'API access']}
        onSelect={() => handleUpgrade('pro')}
        highlighted
      />
    </div>
  );
};
```

#### 3. Modular Widget Loader
```tsx
// src/components/WidgetLoader.tsx
import { lazy, Suspense } from 'react';

const widgetRegistry = {
  'task-manager': lazy(() => import('./widgets/TaskWidget')),
  'spotify-player': lazy(() => import('./widgets/SpotifyWidget')),
  'github-activity': lazy(() => import('./widgets/GitHubWidget')),
  // ... 100+ widgets
};

export const WidgetLoader = ({ templateId, config }) => {
  const Widget = widgetRegistry[templateId];

  if (!Widget) {
    return <WidgetNotFound templateId={templateId} />;
  }

  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <Widget config={config} />
    </Suspense>
  );
};
```

---

## Widget Development Kit (WDK)

### Standard Widget Interface

```typescript
// src/types/Widget.ts
export interface WidgetProps {
  config: WidgetConfig;
  onConfigChange: (config: WidgetConfig) => void;
  onError: (error: Error) => void;
  onDataChange: (data: any) => void;
}

export interface WidgetConfig {
  refreshInterval?: number;
  size?: { width: number; height: number };
  [key: string]: any; // Widget-specific config
}

export interface WidgetMetadata {
  id: string;
  name: string;
  category: string;
  tier: 'free' | 'standard' | 'pro';
  requiredIntegrations: string[];
  defaultSize: { width: number; height: number };
}
```

### Example Widget Template

```tsx
// src/widgets/SpotifyWidget.tsx
import { WidgetProps, WidgetMetadata } from '../types/Widget';

export const metadata: WidgetMetadata = {
  id: 'spotify-player',
  name: 'Spotify Now Playing',
  category: 'media',
  tier: 'standard',
  requiredIntegrations: ['spotify'],
  defaultSize: { width: 2, height: 2 }
};

export const SpotifyWidget: React.FC<WidgetProps> = ({ config, onDataChange }) => {
  const [nowPlaying, setNowPlaying] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await api.get('/widgets/spotify/now-playing');
      setNowPlaying(data);
      onDataChange(data);
    }, config.refreshInterval || 5000);

    return () => clearInterval(interval);
  }, [config.refreshInterval]);

  return (
    <div className="spotify-widget">
      {nowPlaying && (
        <>
          <img src={nowPlaying.albumArt} alt="Album" />
          <h3>{nowPlaying.track}</h3>
          <p>{nowPlaying.artist}</p>
        </>
      )}
    </div>
  );
};
```

---

## Android App Bundle Implementation

### Module Structure

```
android/
├── app/ (base module - 3 MB)
│   ├── Core dashboard
│   ├── Auth
│   ├── Subscription UI
│   └── Free widgets (5): Task, Notes, Weather, Clock, Calculator
│
├── productivity/ (2 MB)
│   └── Kanban, Habits, Heatmap, Obsidian
│
├── media/ (2.5 MB)
│   └── Spotify, Netflix, Plex, Audiobookshelf
│
├── automation/ (1.5 MB)
│   └── Zapier, IFTTT, Webhooks
│
└── enterprise/ (3 MB)
    └── Grafana, Prometheus, DataDog, Sentry
```

### Dynamic Feature Installation

```kotlin
// Install module when user subscribes to tier
class SubscriptionManager {
    fun onTierUpgrade(tier: Tier) {
        when (tier) {
            Tier.STANDARD -> installModules(listOf("productivity", "media"))
            Tier.PRO -> installModules(listOf("productivity", "media", "automation", "enterprise"))
        }
    }

    private fun installModules(modules: List<String>) {
        modules.forEach { moduleName ->
            dynamicFeatureManager.installModule(moduleName) { success ->
                if (success) {
                    analytics.track("module_installed", mapOf("module" to moduleName))
                }
            }
        }
    }
}
```

---

## Migration Strategy

### Phase 1: Foundation (Weeks 1-2)
1. ✅ Set up PostgreSQL database
2. ✅ Migrate existing data from SQLite
3. ✅ Create widget_templates table and seed initial 12 widgets
4. ✅ Build subscription system (Stripe integration)
5. ✅ Add tier-checking middleware to API
6. ✅ Create marketplace UI (browse only, no purchases yet)

### Phase 2: Modularization (Weeks 3-4)
7. ✅ Refactor existing 12 widgets to use new WDK interface
8. ✅ Implement widget loader with lazy loading
9. ✅ Build widget installation flow
10. ✅ Add drag-drop grid with react-grid-layout
11. ✅ Create onboarding flow (widget selection)

### Phase 3: Monetization (Weeks 5-6)
12. ✅ Complete Stripe checkout integration
13. ✅ Build subscription management UI
14. ✅ Implement webhook handlers for Stripe events
15. ✅ Add widget slot limits per tier
16. ✅ Create upgrade prompts

### Phase 4: Expansion (Weeks 7-12)
17. ✅ Build widgets 13-40 (standard tier)
18. ✅ Build widgets 41-100 (pro tier)
19. ✅ Android App Bundles with dynamic modules
20. ✅ Admin dashboard for widget management

---

## Widget Catalog Roadmap

### Free Tier (12 widgets)
- ✅ Task Manager
- ✅ AI Assistant
- ✅ Sticky Notes (new)
- ✅ Clock/World Time (new)
- ✅ Weather (new)
- ✅ Calculator (new)
- ✅ Pomodoro Timer (new)
- ✅ Quote of the Day (new)
- ✅ Habit Tracker
- ✅ ToyBox
- ✅ Calendar (basic)
- ✅ Mood Tracker

### Standard Tier (+30 widgets)
- Google Calendar (advanced)
- Gmail
- Todoist
- Notion
- Trello
- Asana
- GitHub Activity
- Slack Notifications
- Discord
- Spotify
- RSS Feed
- Stock Tickers
- Obsidian (advanced)
- Kanban Board
- Heatmap
- Email Widget
- Music Download
- Media Player
- ... 12 more

### Pro Tier (+58 widgets)
- Grafana Dashboards
- Prometheus Metrics
- DataDog
- New Relic
- Sentry Error Tracking
- Jenkins CI/CD
- Home Assistant
- Philips Hue
- Fitbit
- Apple Health
- Zapier
- IFTTT
- Advanced Webhooks
- Netflix Queue
- Plex Server
- Audiobookshelf
- YouTube Analytics
- LinkedIn Learning
- Figma Designs
- Canvas LMS
- ... 38 more

---

## Pricing Strategy

### Free Tier
- **Price**: $0/month
- **Slots**: 5 widgets
- **Widgets**: 12 free widgets only
- **Support**: Community forum
- **API Rate Limit**: 1000 calls/hour

### Standard Tier
- **Price**: $7/month
- **Slots**: 20 widgets
- **Widgets**: Free + Standard (42 total)
- **Support**: Email support
- **API Rate Limit**: 5000 calls/hour
- **Features**: Custom themes, export data

### Pro Tier
- **Price**: $19/month
- **Slots**: 50 widgets
- **Widgets**: All 100+ widgets
- **Support**: Priority email + chat
- **API Rate Limit**: 25000 calls/hour
- **Features**: API access, webhooks, automations, priority data refresh

---

## Technical Debt & Optimizations

### Code Splitting
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'ui': ['lucide-react', 'recharts'],
          'free-widgets': ['./src/widgets/Task*', './src/widgets/Notes*'],
          'standard-widgets': ['./src/widgets/Spotify*', './src/widgets/GitHub*'],
          'pro-widgets': ['./src/widgets/Grafana*', './src/widgets/Sentry*']
        }
      }
    }
  }
});
```

### Redis Caching
```typescript
// Widget data caching layer
class WidgetCache {
  async get(widgetId: string): Promise<any> {
    const cached = await redis.get(`widget:${widgetId}`);
    if (cached) return JSON.parse(cached);

    const data = await this.fetchFresh(widgetId);
    await redis.setex(`widget:${widgetId}`, 300, JSON.stringify(data));
    return data;
  }
}
```

---

## Success Metrics

### Week 4 (MVP)
- [ ] 5 free widgets functional
- [ ] User can signup and create dashboard
- [ ] Widget marketplace browseable
- [ ] Basic tier system in place

### Week 8 (Monetization)
- [ ] Stripe integration live
- [ ] 10+ paying users
- [ ] 40+ widgets deployed
- [ ] <1% error rate

### Week 12 (Scale)
- [ ] 100+ widgets live
- [ ] 100+ paying users
- [ ] <200ms dashboard load
- [ ] Mobile app in beta
- [ ] Admin dashboard functional

---

## Next Immediate Actions

1. **Review with stakeholder** - Confirm architecture decisions
2. **Create Stripe account** - Set up test/prod keys
3. **Spin up PostgreSQL** - Replace SQLite
4. **Database migration script** - Preserve existing user data
5. **Build widget catalog seeder** - Populate widget_templates
6. **Implement tier middleware** - Block premium widgets for free users
7. **Create subscription checkout flow** - First monetization touchpoint

**Estimated Timeline**: 12 weeks to full platform launch  
**Team Size Needed**: 1-2 full-stack devs  
**Budget**: ~$100/month (Stripe, hosting, DB)

---

**STATUS**: Ready for stakeholder approval to begin Phase 1 🚀
