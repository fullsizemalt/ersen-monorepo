import React, { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { BUILT_IN_THEMES, Theme } from '../../styles/themes';

interface ThemeToggleProps {
    /** Show system option */
    showSystemOption?: boolean;
    /** Compact mode - single pill toggle */
    compact?: boolean;
}

/**
 * Modern segmented theme toggle with optional theme picker dropdown
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({
    showSystemOption = true,
    compact = false
}) => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedColorTheme, setSelectedColorTheme] = useState('midnight');

    const modes = [
        { id: 'light' as const, icon: Sun, label: 'Light' },
        { id: 'dark' as const, icon: Moon, label: 'Dark' },
        ...(showSystemOption ? [{ id: 'system' as const, icon: Monitor, label: 'System' }] : []),
    ];

    // Get preview colors for theme card
    const getPreviewColors = (themeObj: Theme, isDark: boolean) => {
        const colors = isDark ? themeObj.colors.dark : themeObj.colors.light;
        return {
            bg: `hsl(${colors.background})`,
            primary: `hsl(${colors.primary})`,
            accent: colors.accent ? `hsl(${colors.accent})` : `hsl(${colors.primary})`,
        };
    };

    return (
        <div className="relative">
            <div className={`flex items-center gap-2 ${compact ? '' : ''}`}>
                {/* Mode Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-secondary border border-border">
                    {modes.map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setTheme(mode.id)}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${theme === mode.id
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                            aria-label={`${mode.label} theme`}
                            title={`${mode.label} theme`}
                        >
                            <mode.icon size={16} />
                        </button>
                    ))}
                </div>

                {/* Theme Picker Button - only show when not compact */}
                {!compact && (
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${showPicker
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                        title="Color themes"
                    >
                        <Palette size={16} />
                    </button>
                )}
            </div>

            {/* Theme Picker Dropdown */}
            {showPicker && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
                    <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-card border border-border rounded-xl shadow-xl animate-scale-in">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                            Color Theme
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {BUILT_IN_THEMES.map((themeObj) => {
                                const colors = getPreviewColors(themeObj, resolvedTheme === 'dark');
                                const isSelected = selectedColorTheme === themeObj.id;

                                return (
                                    <button
                                        key={themeObj.id}
                                        onClick={() => {
                                            setSelectedColorTheme(themeObj.id);
                                            // Future: Apply color theme here
                                        }}
                                        className={`relative p-2 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-primary ring-1 ring-primary/20'
                                                : 'border-border hover:border-primary/30'
                                            }`}
                                        style={{ backgroundColor: colors.bg }}
                                    >
                                        <div className="flex gap-1 justify-center">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: colors.primary }}
                                            />
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: colors.accent }}
                                            />
                                        </div>

                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                <Check size={10} className="text-primary-foreground" />
                                            </div>
                                        )}

                                        <p className="text-[9px] font-medium mt-1.5 text-center truncate text-foreground">
                                            {themeObj.name}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-3 pt-2 border-t border-border">
                            <p className="text-[10px] text-muted-foreground text-center">
                                More themes in marketplace soon
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ThemeToggle;
