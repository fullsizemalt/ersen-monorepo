export type WidgetSize = '1x1' | '2x1' | '2x2' | '4x2' | '4x4';

export type WidgetCategory =
    | 'productivity'  // Tasks, notes, calendar, kanban
    | 'time'          // Clock, countdown, stopwatch, pomodoro
    | 'lifestyle'     // Habits, mood, water, breathing
    | 'tools'         // Calculator, converter, password gen
    | 'entertainment' // Games, dice, toybox
    | 'information'   // Weather, quotes, news
    | 'integrations'  // Spotify, GitHub, Gmail, Obsidian
    | 'monitoring';   // System info, Grafana, Prometheus

export type WidgetTag =
    | 'fun'
    | 'health'
    | 'focus'
    | 'utility'
    | 'games'
    | 'social'
    | 'music'
    | 'media'
    | 'finance'
    | 'developer'
    | 'selfhosted';

export interface WidgetConfig {
    [key: string]: any;
}

export interface WidgetProps {
    id: number; // Instance ID
    config: WidgetConfig;
    isEditing: boolean;
    onConfigChange: (newConfig: WidgetConfig) => void;
}

export interface ActiveWidget {
    id: number;
    name: string;
    slug: string;
    config: Record<string, unknown>;
    position: { x: number; y: number; w: number; h: number };
}

export interface WidgetManifest {
    slug: string;
    name: string;
    description: string;
    tier: 'free' | 'standard' | 'pro';
    category: WidgetCategory;
    tags?: WidgetTag[];
    icon?: string; // Emoji or icon name
    defaultSize: { w: number; h: number };
    supportedSizes: { w: number; h: number }[];
    component: React.LazyExoticComponent<React.FC<WidgetProps>>;
    ConfigComponent?: React.LazyExoticComponent<React.FC<WidgetProps>>;
    available?: boolean;
}

// Category metadata for UI display
export const WIDGET_CATEGORIES: Record<WidgetCategory, { label: string; icon: string; description: string }> = {
    productivity: { label: 'Productivity', icon: '📋', description: 'Tasks, notes, and organization' },
    time: { label: 'Time & Focus', icon: '⏰', description: 'Clocks, timers, and countdowns' },
    lifestyle: { label: 'Lifestyle', icon: '🌿', description: 'Health, wellness, and habits' },
    tools: { label: 'Tools', icon: '🔧', description: 'Calculators and utilities' },
    entertainment: { label: 'Entertainment', icon: '🎮', description: 'Games and fun widgets' },
    information: { label: 'Information', icon: '📰', description: 'Weather, news, and quotes' },
    integrations: { label: 'Integrations', icon: '🔗', description: 'Third-party services' },
    monitoring: { label: 'Monitoring', icon: '📊', description: 'System and service stats' },
};
