import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface Timer {
    id: string;
    label?: string;
    mode: 'work' | 'break';
    timeLeft: number; // seconds
    totalTime: number; // original duration
    isActive: boolean;
    startedAt?: number; // timestamp when started
}

interface TimerContextType {
    timers: Map<string, Timer>;
    getTimer: (id: string) => Timer | undefined;
    createTimer: (id: string, mode: 'work' | 'break', duration: number, label?: string) => void;
    startTimer: (id: string) => void;
    pauseTimer: (id: string) => void;
    resetTimer: (id: string, newDuration?: number) => void;
    setTimerLabel: (id: string, label: string) => void;
    deleteTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const STORAGE_KEY = 'ersen_active_timers';

/**
 * TimerProvider - Global timer state that persists across navigation
 * 
 * Features:
 * - Timers continue running when navigating between pages
 * - State persisted to localStorage
 * - Background tab support (uses timestamp-based calculation)
 * - Multiple simultaneous timers supported
 */
export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [timers, setTimers] = useState<Map<string, Timer>>(() => {
        // Load from localStorage on mount
        if (typeof window === 'undefined') return new Map();

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const map = new Map<string, Timer>();

                // Recalculate time for active timers based on elapsed time
                const now = Date.now();
                Object.entries(parsed).forEach(([id, timer]: [string, any]) => {
                    if (timer.isActive && timer.startedAt) {
                        const elapsed = Math.floor((now - timer.startedAt) / 1000);
                        const newTimeLeft = Math.max(0, timer.timeLeft - elapsed);
                        map.set(id, {
                            ...timer,
                            timeLeft: newTimeLeft,
                            isActive: newTimeLeft > 0,
                            startedAt: newTimeLeft > 0 ? now : undefined,
                        });
                    } else {
                        map.set(id, timer);
                    }
                });

                return map;
            }
        } catch (e) {
            console.error('Failed to load timers from localStorage', e);
        }

        return new Map();
    });

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Save to localStorage whenever timers change
    useEffect(() => {
        const obj: Record<string, Timer> = {};
        timers.forEach((timer, id) => {
            obj[id] = timer;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    }, [timers]);

    // Main tick interval - runs every second for active timers
    useEffect(() => {
        const tick = () => {
            setTimers(prev => {
                const updated = new Map(prev);
                let hasChanges = false;

                updated.forEach((timer, id) => {
                    if (timer.isActive && timer.timeLeft > 0) {
                        hasChanges = true;
                        updated.set(id, {
                            ...timer,
                            timeLeft: timer.timeLeft - 1,
                            isActive: timer.timeLeft - 1 > 0,
                        });

                        // Timer completed
                        if (timer.timeLeft - 1 === 0) {
                            // Play alarm sound
                            import('../utils/alarm').then(({ playAlarm, sendNotification }) => {
                                playAlarm(0.5);
                                sendNotification(
                                    timer.mode === 'work' ? '⏰ Focus session complete!' : '☕ Break is over!',
                                    timer.label || (timer.mode === 'work' ? 'Time for a break' : 'Ready to focus again?')
                                );
                            });
                            console.log(`Timer ${id} completed!`);
                        }
                    }
                });

                return hasChanges ? updated : prev;
            });
        };

        // Check if any timer is active
        const hasActiveTimer = Array.from(timers.values()).some(t => t.isActive);

        if (hasActiveTimer) {
            intervalRef.current = setInterval(tick, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timers]);

    const getTimer = useCallback((id: string) => {
        return timers.get(id);
    }, [timers]);

    const createTimer = useCallback((id: string, mode: 'work' | 'break', duration: number, label?: string) => {
        setTimers(prev => {
            const updated = new Map(prev);
            updated.set(id, {
                id,
                label,
                mode,
                timeLeft: duration,
                totalTime: duration,
                isActive: false,
            });
            return updated;
        });
    }, []);

    const startTimer = useCallback((id: string) => {
        setTimers(prev => {
            const timer = prev.get(id);
            if (!timer) return prev;

            const updated = new Map(prev);
            updated.set(id, {
                ...timer,
                isActive: true,
                startedAt: Date.now(),
            });
            return updated;
        });
    }, []);

    const pauseTimer = useCallback((id: string) => {
        setTimers(prev => {
            const timer = prev.get(id);
            if (!timer) return prev;

            const updated = new Map(prev);
            updated.set(id, {
                ...timer,
                isActive: false,
                startedAt: undefined,
            });
            return updated;
        });
    }, []);

    const resetTimer = useCallback((id: string, newDuration?: number) => {
        setTimers(prev => {
            const timer = prev.get(id);
            if (!timer) return prev;

            const duration = newDuration ?? timer.totalTime;
            const updated = new Map(prev);
            updated.set(id, {
                ...timer,
                timeLeft: duration,
                totalTime: duration,
                isActive: false,
                startedAt: undefined,
            });
            return updated;
        });
    }, []);

    const setTimerLabel = useCallback((id: string, label: string) => {
        setTimers(prev => {
            const timer = prev.get(id);
            if (!timer) return prev;

            const updated = new Map(prev);
            updated.set(id, { ...timer, label });
            return updated;
        });
    }, []);

    const deleteTimer = useCallback((id: string) => {
        setTimers(prev => {
            const updated = new Map(prev);
            updated.delete(id);
            return updated;
        });
    }, []);

    return (
        <TimerContext.Provider value={{
            timers,
            getTimer,
            createTimer,
            startTimer,
            pauseTimer,
            resetTimer,
            setTimerLabel,
            deleteTimer,
        }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = (id: string) => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }

    const timer = context.getTimer(id);

    return {
        timer,
        ...context,
    };
};

export const useTimers = () => {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimers must be used within a TimerProvider');
    }
    return context;
};
