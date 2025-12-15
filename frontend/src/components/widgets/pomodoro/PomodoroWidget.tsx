import React, { useEffect, useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsInput, SettingsToggle } from '../FlipCardWidget';
import { Play, Pause, RotateCcw, Tag } from 'lucide-react';
import { useTimer } from '../../../contexts/TimerContext';
import VoiceInputButton from '../../common/VoiceInputButton';

const PomodoroWidget: React.FC<WidgetProps> = ({ id, config, onConfigChange }) => {
    // Settings state
    const [workDuration, setWorkDuration] = useState(config.workDuration || 25);
    const [breakDuration, setBreakDuration] = useState(config.breakDuration || 5);
    const [autoStartBreak, setAutoStartBreak] = useState(config.autoStartBreak !== false);
    const [soundEnabled, setSoundEnabled] = useState(config.soundEnabled !== false);

    const WORK_SECONDS = workDuration * 60;
    const BREAK_SECONDS = breakDuration * 60;

    const timerId = `pomodoro-${id}`;
    const { timer, createTimer, startTimer, pauseTimer, resetTimer, setTimerLabel } = useTimer(timerId);

    // Initialize timer if it doesn't exist
    useEffect(() => {
        if (!timer) {
            createTimer(timerId, 'work', WORK_SECONDS);
        }
    }, [timer, timerId, createTimer, WORK_SECONDS]);

    const timeLeft = timer?.timeLeft ?? WORK_SECONDS;
    const isActive = timer?.isActive ?? false;
    const mode = timer?.mode ?? 'work';
    const label = timer?.label || '';

    const toggleTimer = () => {
        if (isActive) {
            pauseTimer(timerId);
        } else {
            startTimer(timerId);
        }
    };

    const handleReset = () => {
        resetTimer(timerId, mode === 'work' ? WORK_SECONDS : BREAK_SECONDS);
    };

    const switchMode = (newMode: 'work' | 'break') => {
        const duration = newMode === 'work' ? WORK_SECONDS : BREAK_SECONDS;
        createTimer(timerId, newMode, duration, label);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSave = () => {
        onConfigChange({
            ...config,
            workDuration,
            breakDuration,
            autoStartBreak,
            soundEnabled,
        });
        // Re-initialize timer with new durations
        const duration = mode === 'work' ? workDuration * 60 : breakDuration * 60;
        createTimer(timerId, mode, duration, label);
    };

    // Calculate progress percentage
    const totalTime = timer?.totalTime ?? WORK_SECONDS;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;

    const settingsContent = (
        <div className="space-y-4">
            <SettingsInput
                label="Work duration"
                description="Minutes for each work session"
                type="number"
                value={String(workDuration)}
                onChange={(v) => setWorkDuration(Number(v) || 25)}
            />
            <SettingsInput
                label="Break duration"
                description="Minutes for each break"
                type="number"
                value={String(breakDuration)}
                onChange={(v) => setBreakDuration(Number(v) || 5)}
            />
            <SettingsToggle
                label="Auto-start break"
                description="Automatically start break after work"
                checked={autoStartBreak}
                onChange={setAutoStartBreak}
            />
            <SettingsToggle
                label="Sound notifications"
                description="Play sound when timer completes"
                checked={soundEnabled}
                onChange={setSoundEnabled}
            />
        </div>
    );

    return (
        <FlipCardWidget
            title="Focus Timer"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col items-center justify-center h-full gap-3 p-2">
                {/* Mode Selector */}
                <div className="flex gap-2 text-xs">
                    <button
                        onClick={() => switchMode('work')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${mode === 'work'
                            ? 'bg-red-500/20 text-red-500 ring-1 ring-red-500/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                    >
                        Work
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all ${mode === 'break'
                            ? 'bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/30'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                    >
                        Break
                    </button>
                </div>

                {/* Timer Display with Progress Ring */}
                <div className="relative">
                    {/* Progress Ring */}
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-muted/10 opacity-20"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                            className={`transition-all duration-1000 ${mode === 'work' ? 'text-red-500' : 'text-emerald-500'
                                }`}
                        />
                    </svg>

                    {/* Time Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-mono font-bold text-foreground tracking-wider">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Task Label Input */}
                <div className="w-full max-w-[200px] flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <Tag className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setTimerLabel(timerId, e.target.value)}
                            placeholder="What are you working on?"
                            className="w-full bg-secondary/30 hover:bg-secondary/50 focus:bg-secondary/80 text-xs py-1.5 pl-7 pr-2 rounded-lg border border-transparent focus:border-primary/20 transition-all outline-none text-foreground placeholder:text-muted-foreground/50"
                        />
                    </div>
                    <VoiceInputButton
                        onTranscript={(text) => setTimerLabel(timerId, text)}
                        className="p-1.5 h-7 w-7"
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    <button
                        onClick={toggleTimer}
                        className={`p-2.5 rounded-full transition-all ${isActive
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : mode === 'work'
                                ? 'bg-secondary hover:bg-red-500/10 text-red-500 hover:text-red-600'
                                : 'bg-secondary hover:bg-emerald-500/10 text-emerald-500 hover:text-emerald-600'
                            }`}
                    >
                        {isActive ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={timeLeft === totalTime && !isActive}
                        className="p-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>

                {/* Status indicator */}
                {isActive && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${mode === 'work' ? 'bg-red-500' : 'bg-emerald-500'
                            }`} />
                        {mode === 'work' ? 'Focus time' : 'Break time'}
                    </div>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default PomodoroWidget;
