import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsSelect } from '../FlipCardWidget';
import { Wind, Play, Square, RotateCcw } from 'lucide-react';

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingPattern {
    name: string;
    description: string;
    inhale: number;
    hold: number;
    exhale: number;
    hold2?: number;
}

const PATTERNS: Record<string, BreathingPattern> = {
    '4-7-8': {
        name: '4-7-8 Relaxing',
        description: 'Deep relaxation & sleep',
        inhale: 4,
        hold: 7,
        exhale: 8,
    },
    'box': {
        name: 'Box Breathing',
        description: 'Focus & calm',
        inhale: 4,
        hold: 4,
        exhale: 4,
        hold2: 4,
    },
    'calm': {
        name: 'Calm Breath',
        description: 'Quick stress relief',
        inhale: 4,
        hold: 2,
        exhale: 6,
    },
};

const BreathingWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [patternKey, setPatternKey] = useState(config.pattern || '4-7-8');
    const [phase, setPhase] = useState<Phase>('inhale');
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [cycles, setCycles] = useState(0);

    const pattern = PATTERNS[patternKey] || PATTERNS['4-7-8'];

    const getPatternDuration = useCallback((p: Phase): number => {
        switch (p) {
            case 'inhale': return pattern.inhale;
            case 'hold': return pattern.hold;
            case 'exhale': return pattern.exhale;
            case 'rest': return pattern.hold2 || 0;
            default: return 0;
        }
    }, [pattern]);

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setSeconds(prev => {
                const newSeconds = prev + 1;
                const currentDuration = getPatternDuration(phase);

                if (newSeconds >= currentDuration) {
                    // Move to next phase
                    if (phase === 'inhale') setPhase('hold');
                    else if (phase === 'hold') setPhase('exhale');
                    else if (phase === 'exhale') {
                        if (pattern.hold2) {
                            setPhase('rest');
                        } else {
                            setPhase('inhale');
                            setCycles(c => c + 1);
                        }
                    } else if (phase === 'rest') {
                        setPhase('inhale');
                        setCycles(c => c + 1);
                    }
                    return 0;
                }
                return newSeconds;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running, phase, getPatternDuration, pattern.hold2]);

    const toggle = () => {
        if (running) {
            setRunning(false);
        } else {
            setRunning(true);
            setPhase('inhale');
            setSeconds(0);
        }
    };

    const reset = () => {
        setRunning(false);
        setPhase('inhale');
        setSeconds(0);
        setCycles(0);
    };

    const getScale = () => {
        const duration = getPatternDuration(phase);
        if (duration === 0) return 1;

        if (phase === 'inhale') return 1 + (seconds / duration) * 0.4;
        if (phase === 'hold' || phase === 'rest') return 1.4;
        if (phase === 'exhale') return 1.4 - (seconds / duration) * 0.4;
        return 1;
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale': return 'from-cyan-400 to-blue-500';
            case 'hold': return 'from-blue-500 to-indigo-500';
            case 'exhale': return 'from-indigo-500 to-purple-500';
            case 'rest': return 'from-purple-500 to-pink-400';
            default: return 'from-blue-400 to-purple-500';
        }
    };

    const getMessage = () => {
        if (!running) return 'Tap to begin';
        switch (phase) {
            case 'inhale': return 'Breathe in...';
            case 'hold': return 'Hold...';
            case 'exhale': return 'Breathe out...';
            case 'rest': return 'Hold...';
            default: return '';
        }
    };

    const handleSave = () => {
        onConfigChange({ ...config, pattern: patternKey });
    };

    const settingsContent = (
        <div className="space-y-4">
            <SettingsSelect
                label="Breathing pattern"
                description="Choose a technique"
                value={patternKey}
                options={Object.entries(PATTERNS).map(([key, p]) => ({
                    value: key,
                    label: `${p.name} - ${p.description}`,
                }))}
                onChange={setPatternKey}
            />
        </div>
    );

    const timeRemaining = getPatternDuration(phase) - seconds;

    return (
        <FlipCardWidget
            title="Breathing"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Pattern name */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wind size={12} />
                    <span>{pattern.name}</span>
                </div>

                {/* Breathing circle */}
                <div
                    className="relative cursor-pointer"
                    onClick={toggle}
                >
                    <div
                        className={`w-28 h-28 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all shadow-xl`}
                        style={{
                            transform: `scale(${getScale()})`,
                            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: running ? `0 0 40px ${phase === 'inhale' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(139, 92, 246, 0.3)'}` : 'none',
                        }}
                    >
                        <div className="text-center text-white">
                            {running ? (
                                <>
                                    <span className="text-3xl font-bold tabular-nums">{timeRemaining}</span>
                                    <span className="text-xs opacity-80 block mt-0.5">{phase}</span>
                                </>
                            ) : (
                                <Play size={32} className="opacity-80" />
                            )}
                        </div>
                    </div>

                    {/* Outer ring pulse */}
                    {running && (
                        <div
                            className={`absolute inset-0 rounded-full border-2 border-white/30 animate-ping`}
                            style={{ animationDuration: '2s' }}
                        />
                    )}
                </div>

                {/* Message */}
                <p className={`text-sm font-medium h-5 transition-all ${running ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                    {getMessage()}
                </p>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggle}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${running
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
                            }`}
                    >
                        {running ? <Square size={16} className="inline mr-1" /> : <Play size={16} className="inline mr-1" />}
                        {running ? 'Stop' : 'Start'}
                    </button>

                    {cycles > 0 && (
                        <button
                            onClick={reset}
                            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>

                {/* Cycles counter */}
                {cycles > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span>{cycles} cycle{cycles > 1 ? 's' : ''} completed</span>
                    </div>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default BreathingWidget;
