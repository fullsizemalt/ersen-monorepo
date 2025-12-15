import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsInput } from '../FlipCardWidget';
import { Droplets, Plus, Minus, Sparkles, Target } from 'lucide-react';

const WaterTrackerWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [goal, setGoal] = useState(config.goal || 8);
    const [glasses, setGlasses] = useState(config.glasses || 0);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        onConfigChange({ ...config, glasses, goal });
    }, [glasses, goal]);

    const addGlass = () => {
        if (glasses < goal) {
            setIsAdding(true);
            setGlasses((prev: number) => prev + 1);
            setTimeout(() => setIsAdding(false), 300);
        }
    };

    const removeGlass = () => {
        if (glasses > 0) {
            setGlasses((prev: number) => prev - 1);
        }
    };

    const percentage = Math.min((glasses / goal) * 100, 100);
    const isComplete = glasses >= goal;

    const handleSave = () => {
        onConfigChange({ ...config, goal, glasses });
    };

    const settingsContent = (
        <div className="space-y-4">
            <SettingsInput
                label="Daily goal"
                description="Number of glasses per day"
                type="number"
                value={String(goal)}
                onChange={(v) => setGoal(Math.max(1, Number(v) || 8))}
            />
        </div>
    );

    return (
        <FlipCardWidget
            title="Water Intake"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Water glass visualization */}
                <div className="relative">
                    <div className={`relative w-24 h-32 bg-gradient-to-b from-muted/20 to-muted/40 rounded-b-3xl border-2 border-border overflow-hidden transition-all ${isComplete ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : ''
                        }`}>
                        {/* Water fill */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out ${isComplete
                                    ? 'bg-gradient-to-t from-blue-500 to-cyan-400'
                                    : 'bg-gradient-to-t from-blue-500/80 to-blue-400/60'
                                }`}
                            style={{ height: `${percentage}%` }}
                        >
                            {/* Wave animation at top of water */}
                            <div className="absolute -top-1 left-0 right-0 h-3 bg-white/20 rounded-[100%] animate-pulse" />
                        </div>

                        {/* Droplet icon */}
                        <Droplets
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ${isAdding ? 'scale-125 text-blue-400' : 'text-blue-600/20'
                                }`}
                            size={36}
                        />

                        {/* Complete badge */}
                        {isComplete && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 animate-scale-in">
                                <Sparkles className="text-yellow-400" size={24} />
                            </div>
                        )}
                    </div>

                    {/* Measurement lines */}
                    <div className="absolute top-0 -right-3 h-full flex flex-col justify-between text-[8px] text-muted-foreground py-2">
                        <span>{goal}</span>
                        <span>{Math.floor(goal / 2)}</span>
                        <span>0</span>
                    </div>
                </div>

                {/* Counter */}
                <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                        <span className={`text-3xl font-bold tabular-nums transition-all ${isComplete ? 'text-blue-500' : 'text-foreground'
                            } ${isAdding ? 'scale-110' : ''}`}>
                            {glasses}
                        </span>
                        <span className="text-lg text-muted-foreground">/ {goal}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                        {isComplete ? (
                            <>
                                <Target size={12} className="text-green-500" />
                                <span className="text-green-500 font-medium">Goal reached!</span>
                            </>
                        ) : (
                            <>glasses today</>
                        )}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={removeGlass}
                        disabled={glasses === 0}
                        className="w-10 h-10 flex items-center justify-center bg-secondary hover:bg-secondary/80 text-foreground rounded-xl text-lg font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        onClick={addGlass}
                        disabled={glasses >= goal}
                        className={`w-14 h-14 flex items-center justify-center rounded-2xl text-lg font-medium transition-all shadow-lg active:scale-95 ${glasses >= goal
                                ? 'bg-green-500 text-white shadow-green-500/20'
                                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30'
                            }`}
                    >
                        <Plus size={24} />
                    </button>
                    <button
                        onClick={removeGlass}
                        disabled={glasses === 0}
                        className="w-10 h-10 flex items-center justify-center opacity-0 pointer-events-none"
                    >
                        {/* Spacer for symmetry */}
                    </button>
                </div>
            </div>
        </FlipCardWidget>
    );
};

export default WaterTrackerWidget;
