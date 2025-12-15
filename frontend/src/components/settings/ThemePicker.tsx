/**
 * Theme Picker - Beautiful theme selection UI
 * Linear-style with live preview
 */

import React, { useState } from 'react';
import { Check, Palette, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { BUILT_IN_THEMES, Theme } from '../../styles/themes';

interface ThemePickerProps {
    compact?: boolean;
}

const ThemePicker: React.FC<ThemePickerProps> = ({ compact = false }) => {
    const { theme: currentMode, setTheme: setMode, resolvedTheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState('midnight');
    const [isOpen, setIsOpen] = useState(false);

    const modes = [
        { id: 'light', icon: Sun, label: 'Light' },
        { id: 'dark', icon: Moon, label: 'Dark' },
        { id: 'system', icon: Monitor, label: 'System' },
    ] as const;

    // Get preview colors for theme card
    const getPreviewColors = (theme: Theme, isDark: boolean) => {
        const colors = isDark ? theme.colors.dark : theme.colors.light;
        return {
            bg: `hsl(${colors.background})`,
            card: `hsl(${colors.card})`,
            primary: `hsl(${colors.primary})`,
            accent: colors.accent ? `hsl(${colors.accent})` : `hsl(${colors.primary})`,
            text: `hsl(${colors.foreground})`,
            muted: `hsl(${colors.mutedForeground})`,
        };
    };

    if (compact) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                    <Palette size={16} />
                    <span className="text-sm">Theme</span>
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 z-50 w-72 p-4 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
                            {/* Mode Selector */}
                            <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
                                {modes.map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setMode(mode.id)}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all ${currentMode === mode.id
                                                ? 'bg-background text-foreground shadow-sm'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <mode.icon size={12} />
                                        {mode.label}
                                    </button>
                                ))}
                            </div>

                            {/* Theme Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {BUILT_IN_THEMES.map((theme) => {
                                    const colors = getPreviewColors(theme, resolvedTheme === 'dark');
                                    const isSelected = selectedTheme === theme.id;

                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedTheme(theme.id)}
                                            className={`relative p-2 rounded-lg border-2 transition-all ${isSelected
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-border hover:border-primary/30'
                                                }`}
                                            style={{ backgroundColor: colors.bg }}
                                        >
                                            {/* Mini preview */}
                                            <div className="space-y-1">
                                                <div
                                                    className="h-6 rounded"
                                                    style={{ backgroundColor: colors.card }}
                                                />
                                                <div className="flex gap-1">
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: colors.primary }}
                                                    />
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: colors.accent }}
                                                    />
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                    <Check size={10} className="text-primary-foreground" />
                                                </div>
                                            )}

                                            <p className="text-[9px] font-medium mt-1.5 truncate" style={{ color: colors.text }}>
                                                {theme.name}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    // Full theme picker UI
    return (
        <div className="space-y-6">
            {/* Mode Selector */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    Appearance
                </label>
                <div className="flex gap-2">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setMode(mode.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all flex-1 ${currentMode === mode.id
                                    ? 'border-primary bg-primary/5 text-foreground'
                                    : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <mode.icon size={18} />
                            <span className="font-medium text-sm">{mode.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Theme Selection */}
            <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    Color Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {BUILT_IN_THEMES.map((theme) => {
                        const colors = getPreviewColors(theme, resolvedTheme === 'dark');
                        const isSelected = selectedTheme === theme.id;

                        return (
                            <button
                                key={theme.id}
                                onClick={() => setSelectedTheme(theme.id)}
                                className={`relative p-3 rounded-xl border-2 transition-all group ${isSelected
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-border hover:border-primary/30'
                                    }`}
                                style={{ backgroundColor: colors.bg }}
                            >
                                {/* Preview mockup */}
                                <div className="space-y-2">
                                    {/* Header bar */}
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                                        <div className="h-1.5 flex-1 rounded" style={{ backgroundColor: colors.muted, opacity: 0.3 }} />
                                    </div>

                                    {/* Card mockup */}
                                    <div
                                        className="h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: colors.card }}
                                    >
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.primary }} />
                                            <div className="w-6 h-3 rounded" style={{ backgroundColor: colors.muted, opacity: 0.5 }} />
                                        </div>
                                    </div>

                                    {/* Accent dots */}
                                    <div className="flex gap-1.5 justify-center">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
                                        <div className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: colors.muted }} />
                                    </div>
                                </div>

                                {/* Selected indicator */}
                                {isSelected && (
                                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-scale-in">
                                        <Check size={12} className="text-primary-foreground" />
                                    </div>
                                )}

                                {/* Theme name */}
                                <div className="mt-3 text-center">
                                    <p className="text-xs font-semibold" style={{ color: colors.text }}>
                                        {theme.name}
                                    </p>
                                    <p className="text-[10px] opacity-60" style={{ color: colors.muted }}>
                                        {theme.author}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Marketplace teaser */}
            <div className="p-4 rounded-xl border border-dashed border-border bg-muted/30 text-center">
                <Palette className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm font-medium text-foreground">More themes coming soon</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Custom themes will be available in the marketplace
                </p>
            </div>
        </div>
    );
};

export default ThemePicker;
