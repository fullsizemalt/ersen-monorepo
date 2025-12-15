/**
 * FlipCard Widget Container
 * 
 * Provides a flip-card interaction for widget settings.
 * Front: Widget content
 * Back: Widget settings
 * 
 * Linear-style with smooth 3D flip animation.
 */

import React, { useState } from 'react';
import { Settings, X, Check } from 'lucide-react';

interface FlipCardWidgetProps {
    children: React.ReactNode;
    settings?: React.ReactNode;
    title: string;
    onSave?: () => void;
    className?: string;
}

const FlipCardWidget: React.FC<FlipCardWidgetProps> = ({
    children,
    settings,
    title,
    onSave,
    className = '',
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave?.();
        setTimeout(() => {
            setIsSaving(false);
            setIsFlipped(false);
        }, 300);
    };

    return (
        <div
            className={`relative w-full h-full perspective-1000 ${className}`}
            style={{ perspective: '1000px' }}
        >
            <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                }}
            >
                {/* FRONT - Widget Content */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="w-full h-full flex flex-col glass-card rounded-2xl overflow-hidden">
                        {/* Widget Header */}
                        <div className="px-4 py-3 flex justify-between items-center border-b border-border bg-muted/30">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {title}
                            </h3>
                            {settings && (
                                <button
                                    onClick={() => setIsFlipped(true)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    title="Widget Settings"
                                >
                                    <Settings size={14} />
                                </button>
                            )}
                        </div>

                        {/* Widget Content */}
                        <div className="flex-1 p-3 sm:p-4 overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>

                {/* BACK - Widget Settings */}
                <div
                    className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <div className="w-full h-full flex flex-col glass-card rounded-2xl overflow-hidden bg-card">
                        {/* Settings Header */}
                        <div className="px-4 py-3 flex justify-between items-center border-b border-border bg-primary/5">
                            <h3 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                                <Settings size={12} />
                                Settings
                            </h3>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <Check size={12} />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    onClick={() => setIsFlipped(false)}
                                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                    title="Close Settings"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {settings || (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    No settings available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Settings form components for common widget settings
 */

interface SettingsFieldProps {
    label: string;
    description?: string;
    children: React.ReactNode;
}

export const SettingsField: React.FC<SettingsFieldProps> = ({
    label,
    description,
    children,
}) => (
    <div className="space-y-2">
        <div className="flex justify-between items-start">
            <div>
                <label className="text-sm font-medium text-foreground">{label}</label>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
        </div>
        {children}
    </div>
);

interface SettingsToggleProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
    label,
    description,
    checked,
    onChange,
}) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <label className="text-sm font-medium text-foreground">{label}</label>
            {description && (
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'
                }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    </div>
);

interface SettingsSelectProps {
    label: string;
    description?: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

export const SettingsSelect: React.FC<SettingsSelectProps> = ({
    label,
    description,
    value,
    options,
    onChange,
}) => (
    <SettingsField label={label} description={description}>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </SettingsField>
);

interface SettingsInputProps {
    label: string;
    description?: string;
    value: string;
    placeholder?: string;
    type?: string;
    onChange: (value: string) => void;
}

export const SettingsInput: React.FC<SettingsInputProps> = ({
    label,
    description,
    value,
    placeholder,
    type = 'text',
    onChange,
}) => (
    <SettingsField label={label} description={description}>
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
    </SettingsField>
);

export default FlipCardWidget;
