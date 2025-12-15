import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsToggle, SettingsSelect } from '../FlipCardWidget';

const ClockWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [time, setTime] = useState(new Date());

    // Settings state
    const [hour12, setHour12] = useState(config.hour12 !== false);
    const [showSeconds, setShowSeconds] = useState(config.showSeconds || false);
    const [dateFormat, setDateFormat] = useState(config.dateFormat || 'long');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: hour12,
        };
        if (showSeconds) {
            options.second = '2-digit';
        }
        return date.toLocaleTimeString([], options);
    };

    const formatDate = (date: Date) => {
        const formats: Record<string, Intl.DateTimeFormatOptions> = {
            long: { weekday: 'long', month: 'long', day: 'numeric' },
            short: { weekday: 'short', month: 'short', day: 'numeric' },
            minimal: { month: 'numeric', day: 'numeric', year: '2-digit' },
        };
        return date.toLocaleDateString([], formats[dateFormat] || formats.long);
    };

    const handleSave = () => {
        onConfigChange({
            ...config,
            hour12,
            showSeconds,
            dateFormat,
        });
    };

    const settingsContent = (
        <div className="space-y-4">
            <SettingsToggle
                label="12-hour format"
                description="Use AM/PM instead of 24-hour"
                checked={hour12}
                onChange={setHour12}
            />
            <SettingsToggle
                label="Show seconds"
                description="Display seconds in time"
                checked={showSeconds}
                onChange={setShowSeconds}
            />
            <SettingsSelect
                label="Date format"
                description="How to display the date"
                value={dateFormat}
                options={[
                    { value: 'long', label: 'Saturday, December 14' },
                    { value: 'short', label: 'Sat, Dec 14' },
                    { value: 'minimal', label: '12/14/24' },
                ]}
                onChange={setDateFormat}
            />
        </div>
    );

    return (
        <FlipCardWidget
            title="Clock"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col items-center justify-center h-full">
                <div className={`font-bold text-zinc-900 dark:text-white tracking-tight tabular-nums ${showSeconds ? 'text-3xl' : 'text-4xl'
                    }`}>
                    {formatTime(time)}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {formatDate(time)}
                </div>
            </div>
        </FlipCardWidget>
    );
};

export default ClockWidget;
