/**
 * Unit tests for widget utilities
 */
import { describe, it, expect } from 'vitest';

// Mock widget catalog structure
interface Widget {
    id: string;
    name: string;
    tier: 'free' | 'standard' | 'pro';
    category: string;
}

// Filter widgets by tier access
const filterAccessibleWidgets = (
    widgets: Widget[],
    userTier: 'free' | 'standard' | 'pro'
): Widget[] => {
    const tierHierarchy = ['free', 'standard', 'pro'];
    const userTierIndex = tierHierarchy.indexOf(userTier);

    return widgets.filter((widget) => {
        const widgetTierIndex = tierHierarchy.indexOf(widget.tier);
        return widgetTierIndex <= userTierIndex;
    });
};

// Check if widget can be installed
const canInstallWidget = (
    currentCount: number,
    maxSlots: number,
    widgetTier: string,
    userTier: string
): { allowed: boolean; reason?: string } => {
    const tierHierarchy = ['free', 'standard', 'pro'];
    const userTierIndex = tierHierarchy.indexOf(userTier);
    const widgetTierIndex = tierHierarchy.indexOf(widgetTier);

    if (widgetTierIndex > userTierIndex) {
        return { allowed: false, reason: 'Upgrade required' };
    }

    if (currentCount >= maxSlots) {
        return { allowed: false, reason: 'No available slots' };
    }

    return { allowed: true };
};

// Group widgets by category
const groupWidgetsByCategory = (
    widgets: Widget[]
): Record<string, Widget[]> => {
    return widgets.reduce((acc, widget) => {
        if (!acc[widget.category]) {
            acc[widget.category] = [];
        }
        acc[widget.category].push(widget);
        return acc;
    }, {} as Record<string, Widget[]>);
};

describe('Widget Utilities', () => {
    const mockWidgets: Widget[] = [
        { id: 'clock', name: 'Clock', tier: 'free', category: 'Productivity' },
        { id: 'weather', name: 'Weather', tier: 'free', category: 'Info' },
        { id: 'spotify', name: 'Spotify', tier: 'standard', category: 'Media' },
        { id: 'github', name: 'GitHub', tier: 'standard', category: 'Dev' },
        { id: 'grafana', name: 'Grafana', tier: 'pro', category: 'Dev' },
        { id: 'plex', name: 'Plex', tier: 'pro', category: 'Media' },
    ];

    describe('filterAccessibleWidgets', () => {
        it('should return only free widgets for free tier user', () => {
            const result = filterAccessibleWidgets(mockWidgets, 'free');
            expect(result).toHaveLength(2);
            expect(result.every((w) => w.tier === 'free')).toBe(true);
        });

        it('should return free and standard widgets for standard tier user', () => {
            const result = filterAccessibleWidgets(mockWidgets, 'standard');
            expect(result).toHaveLength(4);
            expect(result.every((w) => w.tier !== 'pro')).toBe(true);
        });

        it('should return all widgets for pro tier user', () => {
            const result = filterAccessibleWidgets(mockWidgets, 'pro');
            expect(result).toHaveLength(6);
        });

        it('should return empty array for empty input', () => {
            const result = filterAccessibleWidgets([], 'pro');
            expect(result).toHaveLength(0);
        });
    });

    describe('canInstallWidget', () => {
        it('should allow installation when user has tier access and slots', () => {
            const result = canInstallWidget(3, 5, 'free', 'free');
            expect(result.allowed).toBe(true);
        });

        it('should reject when tier is too high', () => {
            const result = canInstallWidget(0, 5, 'pro', 'free');
            expect(result.allowed).toBe(false);
            expect(result.reason).toBe('Upgrade required');
        });

        it('should reject when no slots available', () => {
            const result = canInstallWidget(5, 5, 'free', 'free');
            expect(result.allowed).toBe(false);
            expect(result.reason).toBe('No available slots');
        });

        it('should allow pro user to install any widget', () => {
            const result = canInstallWidget(10, 50, 'pro', 'pro');
            expect(result.allowed).toBe(true);
        });
    });

    describe('groupWidgetsByCategory', () => {
        it('should group widgets by their categories', () => {
            const result = groupWidgetsByCategory(mockWidgets);

            expect(Object.keys(result)).toHaveLength(4);
            expect(result['Productivity']).toHaveLength(1);
            expect(result['Info']).toHaveLength(1);
            expect(result['Media']).toHaveLength(2);
            expect(result['Dev']).toHaveLength(2);
        });

        it('should return empty object for empty input', () => {
            const result = groupWidgetsByCategory([]);
            expect(Object.keys(result)).toHaveLength(0);
        });
    });
});
