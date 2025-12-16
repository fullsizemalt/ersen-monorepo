/**
 * Theme System for Ersen
 * 
 * Architecture designed for:
 * - Built-in themes (Midnight, Daylight, etc.)
 * - User-purchasable CSS themes from marketplace
 * - Easy theme creation via CSS custom properties
 */

export interface ThemeColors {
    // Core
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;

    // Interactive
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;

    // States
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;

    // Structure
    border: string;
    input: string;
    ring: string;

    // Semantic
    success?: string;
    warning?: string;
    info?: string;
}

export interface ThemeAnimations {
    transitionFast: string;
    transitionBase: string;
    transitionSlow: string;
    easing: string;
}

export interface ThemeTypography {
    fontSans: string;
    fontMono: string;
    radius: string;
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    colors: {
        light: ThemeColors;
        dark: ThemeColors;
    };
    animations?: ThemeAnimations;
    typography?: ThemeTypography;
    customCSS?: string; // Additional CSS for marketplace themes
}

// ═══════════════════════════════════════════════════════════════════
// BUILT-IN THEMES
// ═══════════════════════════════════════════════════════════════════

export const THEME_MIDNIGHT: Theme = {
    id: 'midnight',
    name: 'Midnight',
    description: 'Default dark theme with deep blues and purples',
    author: 'Ersen',
    version: '1.0.0',
    colors: {
        light: {
            background: '0 0% 99%',
            foreground: '224 14% 10%',
            card: '0 0% 100%',
            cardForeground: '224 14% 10%',
            primary: '221 83% 53%',
            primaryForeground: '0 0% 100%',
            secondary: '220 14% 96%',
            secondaryForeground: '224 14% 10%',
            muted: '220 14% 96%',
            mutedForeground: '220 9% 46%',
            accent: '221 83% 53%',
            accentForeground: '0 0% 100%',
            destructive: '0 84% 60%',
            destructiveForeground: '0 0% 100%',
            border: '220 13% 91%',
            input: '220 13% 91%',
            ring: '221 83% 53%',
            success: '142 76% 36%',
            warning: '38 92% 50%',
            info: '199 89% 48%',
        },
        dark: {
            background: '224 14% 4%',
            foreground: '0 0% 95%',
            card: '224 14% 6%',
            cardForeground: '0 0% 95%',
            primary: '221 83% 53%',
            primaryForeground: '0 0% 100%',
            secondary: '224 14% 12%',
            secondaryForeground: '0 0% 95%',
            muted: '224 14% 12%',
            mutedForeground: '220 9% 60%',
            accent: '221 83% 53%',
            accentForeground: '0 0% 100%',
            destructive: '0 62% 30%',
            destructiveForeground: '0 0% 95%',
            border: '224 14% 14%',
            input: '224 14% 14%',
            ring: '221 83% 53%',
            success: '142 71% 45%',
            warning: '38 92% 50%',
            info: '199 89% 48%',
        },
    },
    animations: {
        transitionFast: '150ms',
        transitionBase: '200ms',
        transitionSlow: '300ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    typography: {
        fontSans: '"Space Grotesk", sans-serif',
        fontMono: '"JetBrains Mono", monospace',
        radius: '0.625rem',
    },
};

export const THEME_AURORA: Theme = {
    id: 'aurora',
    name: 'Aurora',
    description: 'Vibrant Northern Lights inspired theme',
    author: 'Ersen',
    version: '1.0.0',
    colors: {
        light: {
            background: '180 25% 98%',
            foreground: '200 25% 10%',
            card: '180 20% 100%',
            cardForeground: '200 25% 10%',
            primary: '160 84% 39%',
            primaryForeground: '0 0% 100%',
            secondary: '180 20% 94%',
            secondaryForeground: '200 25% 10%',
            muted: '180 15% 96%',
            mutedForeground: '180 10% 45%',
            accent: '280 70% 55%',
            accentForeground: '0 0% 100%',
            destructive: '0 84% 60%',
            destructiveForeground: '0 0% 100%',
            border: '180 15% 88%',
            input: '180 15% 90%',
            ring: '160 84% 39%',
        },
        dark: {
            background: '220 20% 4%',
            foreground: '180 20% 95%',
            card: '220 18% 7%',
            cardForeground: '180 20% 95%',
            primary: '160 84% 45%',
            primaryForeground: '220 20% 4%',
            secondary: '220 18% 14%',
            secondaryForeground: '180 20% 95%',
            muted: '220 15% 15%',
            mutedForeground: '180 10% 55%',
            accent: '280 80% 65%',
            accentForeground: '0 0% 100%',
            destructive: '0 65% 40%',
            destructiveForeground: '0 0% 95%',
            border: '220 15% 18%',
            input: '220 15% 18%',
            ring: '160 84% 45%',
        },
    },
};

export const THEME_ROSE: Theme = {
    id: 'rose',
    name: 'Rosé',
    description: 'Soft pinks and warm tones',
    author: 'Ersen',
    version: '1.0.0',
    colors: {
        light: {
            background: '350 30% 98%',
            foreground: '350 15% 15%',
            card: '350 30% 100%',
            cardForeground: '350 15% 15%',
            primary: '340 82% 52%',
            primaryForeground: '0 0% 100%',
            secondary: '350 25% 94%',
            secondaryForeground: '350 15% 15%',
            muted: '350 20% 96%',
            mutedForeground: '350 10% 45%',
            accent: '330 75% 55%',
            accentForeground: '0 0% 100%',
            destructive: '0 84% 60%',
            destructiveForeground: '0 0% 100%',
            border: '350 20% 88%',
            input: '350 20% 90%',
            ring: '340 82% 52%',
        },
        dark: {
            background: '340 15% 6%',
            foreground: '350 20% 95%',
            card: '340 14% 9%',
            cardForeground: '350 20% 95%',
            primary: '340 82% 55%',
            primaryForeground: '0 0% 100%',
            secondary: '340 14% 15%',
            secondaryForeground: '350 20% 95%',
            muted: '340 12% 16%',
            mutedForeground: '350 10% 55%',
            accent: '330 80% 60%',
            accentForeground: '0 0% 100%',
            destructive: '0 62% 35%',
            destructiveForeground: '0 0% 95%',
            border: '340 12% 18%',
            input: '340 12% 18%',
            ring: '340 82% 55%',
        },
    },
};

// ═══════════════════════════════════════════════════════════════════
// THEME REGISTRY
// ═══════════════════════════════════════════════════════════════════

export const BUILT_IN_THEMES: Theme[] = [
    THEME_MIDNIGHT,
    THEME_AURORA,
    THEME_ROSE,
];

export const getThemeById = (id: string): Theme | undefined => {
    return BUILT_IN_THEMES.find(t => t.id === id);
};

// ═══════════════════════════════════════════════════════════════════
// THEME APPLICATION
// ═══════════════════════════════════════════════════════════════════

export const applyThemeColors = (theme: Theme, mode: 'light' | 'dark') => {
    const colors = mode === 'dark' ? theme.colors.dark : theme.colors.light;
    const root = document.documentElement;

    // Apply all color variables
    Object.entries(colors).forEach(([key, value]) => {
        // Convert camelCase to kebab-case
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
    });

    // Apply animation variables
    if (theme.animations) {
        root.style.setProperty('--transition-fast', theme.animations.transitionFast);
        root.style.setProperty('--transition-base', theme.animations.transitionBase);
        root.style.setProperty('--transition-slow', theme.animations.transitionSlow);
        root.style.setProperty('--easing', theme.animations.easing);
    }

    // Apply typography
    if (theme.typography) {
        root.style.setProperty('--font-sans', theme.typography.fontSans);
        root.style.setProperty('--font-mono', theme.typography.fontMono);
        root.style.setProperty('--radius', theme.typography.radius);
    }

    // Apply custom CSS if present (for marketplace themes)
    if (theme.customCSS) {
        let styleEl = document.getElementById('custom-theme-css');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'custom-theme-css';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = theme.customCSS;
    }
};
