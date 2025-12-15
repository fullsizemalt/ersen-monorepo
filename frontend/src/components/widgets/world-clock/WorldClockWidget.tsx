import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Globe, Sun, Moon } from 'lucide-react';

interface TimeZone {
    name: string;
    city: string;
    tz: string;
    emoji: string;
}

const TIMEZONES: TimeZone[] = [
    { name: 'PST', city: 'Los Angeles', tz: 'America/Los_Angeles', emoji: '🌴' },
    { name: 'EST', city: 'New York', tz: 'America/New_York', emoji: '🗽' },
    { name: 'GMT', city: 'London', tz: 'Europe/London', emoji: '🇬🇧' },
    { name: 'CET', city: 'Paris', tz: 'Europe/Paris', emoji: '🗼' },
    { name: 'JST', city: 'Tokyo', tz: 'Asia/Tokyo', emoji: '🗾' },
    { name: 'AEST', city: 'Sydney', tz: 'Australia/Sydney', emoji: '🦘' },
];

const WorldClockWidget: React.FC<WidgetProps> = () => {
    const [times, setTimes] = useState<Record<string, { time: string; date: string; isDay: boolean }>>({});
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    useEffect(() => {
        const updateTimes = () => {
            const newTimes: typeof times = {};

            TIMEZONES.forEach(tz => {
                try {
                    const now = new Date();
                    const time = now.toLocaleTimeString('en-US', {
                        timeZone: tz.tz,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                    const date = now.toLocaleDateString('en-US', {
                        timeZone: tz.tz,
                        weekday: 'short'
                    });
                    const hour = parseInt(now.toLocaleTimeString('en-US', {
                        timeZone: tz.tz,
                        hour: 'numeric',
                        hour12: false
                    }));

                    newTimes[tz.name] = {
                        time,
                        date,
                        isDay: hour >= 6 && hour < 18
                    };
                } catch {
                    newTimes[tz.name] = { time: '--:--', date: '--', isDay: true };
                }
            });

            setTimes(newTimes);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <FlipCardWidget title="World Clock">
            <div className="h-full flex flex-col">
                {/* Header with globe */}
                <div className="flex items-center justify-center gap-2 mb-3">
                    <Globe size={14} className="text-primary animate-pulse" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </span>
                </div>

                {/* Time zones grid */}
                <div className="grid grid-cols-2 gap-2 flex-1 content-start">
                    {TIMEZONES.map(tz => {
                        const timeData = times[tz.name];
                        const isSelected = selectedCity === tz.name;

                        return (
                            <button
                                key={tz.name}
                                onClick={() => setSelectedCity(isSelected ? null : tz.name)}
                                className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${isSelected
                                        ? 'bg-primary/10 ring-1 ring-primary/30'
                                        : 'bg-secondary/50 hover:bg-secondary'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{tz.emoji}</span>
                                    <div className="text-left">
                                        <p className="text-xs font-medium text-foreground leading-tight">{tz.city}</p>
                                        <p className="text-[10px] text-muted-foreground">{tz.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1">
                                        {timeData?.isDay ? (
                                            <Sun size={10} className="text-yellow-500" />
                                        ) : (
                                            <Moon size={10} className="text-indigo-400" />
                                        )}
                                        <span className="text-sm font-mono font-semibold text-foreground tabular-nums">
                                            {timeData?.time || '--:--'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        {timeData?.date || '--'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </FlipCardWidget>
    );
};

export default WorldClockWidget;
