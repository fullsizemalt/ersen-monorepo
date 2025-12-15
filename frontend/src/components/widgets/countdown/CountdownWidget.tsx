import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsInput } from '../FlipCardWidget';

const CountdownWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    // Settings state
    const [eventName, setEventName] = useState(config.eventName || 'New Year');
    const [targetDateStr, setTargetDateStr] = useState(
        config.targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );

    const targetDate = new Date(targetDateStr);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculate = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
                return;
            }

            setIsExpired(false);
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        };

        calculate();
        const interval = setInterval(calculate, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const handleSave = () => {
        onConfigChange({
            ...config,
            eventName,
            targetDate: targetDateStr,
        });
    };

    const settingsContent = (
        <div className="space-y-4">
            <SettingsInput
                label="Event name"
                description="What are you counting down to?"
                value={eventName}
                placeholder="New Year"
                onChange={setEventName}
            />
            <SettingsInput
                label="Target date"
                description="When does the event happen?"
                type="date"
                value={targetDateStr}
                onChange={setTargetDateStr}
            />
        </div>
    );

    return (
        <FlipCardWidget
            title="Countdown"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">
                    {eventName}
                </p>

                {isExpired ? (
                    <div className="text-center">
                        <span className="text-2xl font-bold text-primary animate-pulse">🎉</span>
                        <p className="text-sm text-foreground mt-2">It's here!</p>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        {[
                            { value: timeLeft.days, label: 'Days' },
                            { value: timeLeft.hours, label: 'Hrs' },
                            { value: timeLeft.minutes, label: 'Min' },
                            { value: timeLeft.seconds, label: 'Sec' },
                        ].map((item) => (
                            <div key={item.label} className="flex flex-col items-center">
                                <span className="text-2xl font-bold text-foreground tabular-nums">
                                    {String(item.value).padStart(2, '0')}
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase">{item.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default CountdownWidget;
