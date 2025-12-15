import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

const StopwatchWidget: React.FC<WidgetProps> = () => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState<{ time: number; delta: number }[]>([]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (running) {
            interval = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [running]);

    const formatTime = useCallback((ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return {
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            centiseconds: String(centiseconds).padStart(2, '0'),
            full: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
        };
    }, []);

    const reset = () => {
        setTime(0);
        setRunning(false);
        setLaps([]);
    };

    const addLap = () => {
        if (running && time > 0) {
            const lastLapTime = laps.length > 0 ? laps[0].time : 0;
            const delta = time - lastLapTime;
            setLaps(prev => [{ time, delta }, ...prev].slice(0, 5));
        }
    };

    const { minutes, seconds, centiseconds } = formatTime(time);

    // Calculate progress for visual ring (60 second cycle)
    const progress = (time % 60000) / 60000 * 100;

    return (
        <FlipCardWidget title="Stopwatch">
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Timer Display with Ring */}
                <div className="relative">
                    {/* Progress Ring */}
                    <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-muted/20"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                            className={`transition-all duration-100 ${running ? 'text-primary' : 'text-muted-foreground'}`}
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="flex items-baseline font-mono">
                            <span className="text-3xl font-bold text-foreground">{minutes}</span>
                            <span className="text-3xl font-bold text-foreground">:</span>
                            <span className="text-3xl font-bold text-foreground">{seconds}</span>
                            <span className="text-lg text-muted-foreground ml-0.5">.{centiseconds}</span>
                        </div>
                        {running && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] text-primary font-medium">Running</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={reset}
                        disabled={time === 0}
                        className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Reset"
                    >
                        <RotateCcw size={18} />
                    </button>

                    <button
                        onClick={() => setRunning(!running)}
                        className={`p-4 rounded-full transition-all shadow-lg ${running
                            ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20'
                            }`}
                    >
                        {running ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                    </button>

                    <button
                        onClick={addLap}
                        disabled={!running || time === 0}
                        className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Lap"
                    >
                        <Flag size={18} />
                    </button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                    <div className="w-full mt-1 max-h-16 overflow-y-auto scrollbar-thin">
                        {laps.map((lap, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between text-xs py-1 border-b border-border/50 last:border-0 animate-slide-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                        {laps.length - i}
                                    </span>
                                    <span className="text-muted-foreground">Lap</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-muted-foreground text-[10px]">
                                        +{formatTime(lap.delta).full}
                                    </span>
                                    <span className="font-mono font-medium text-foreground">
                                        {formatTime(lap.time).full}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default StopwatchWidget;
