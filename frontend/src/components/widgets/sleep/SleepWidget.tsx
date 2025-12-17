import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Moon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const MOCK_SLEEP_DATA = [
    { time: '22:00', stage: 0 }, // Awake
    { time: '23:00', stage: 1 }, // Light
    { time: '00:00', stage: 2 }, // Deep
    { time: '01:00', stage: 2 },
    { time: '02:00', stage: 3 }, // REM
    { time: '03:00', stage: 1 },
    { time: '04:00', stage: 2 },
    { time: '05:00', stage: 3 },
    { time: '06:00', stage: 1 },
    { time: '07:00', stage: 0 },
];

const SleepWidget: React.FC<WidgetProps> = () => {
    // Stage 0: Awake (High bar), 1: Light, 2: Deep, 3: REM
    // Inverting for visualization (Deep = low, Awake = high)
    // Actually hypnograms usually have Awake at top.

    return (
        <div className="h-full flex flex-col bg-[#0f172a] text-slate-200 p-4">
            <div className="flex justify-between items-baseline mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Moon size={16} className="text-indigo-400" />
                        <span className="text-2xl font-light">7h 42m</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase tracking-widest">Score</div>
                    <div className="text-lg font-bold text-emerald-400">85</div>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-700 font-mono pointer-events-none z-0">
                    <div className="border-b border-white/5">Awake</div>
                    <div className="border-b border-white/5">REM</div>
                    <div className="border-b border-white/5">Light</div>
                    <div className="border-b border-white/5">Deep</div>
                </div>

                {/* Mock Hypnogram via BarChart for simplicity */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_SLEEP_DATA} barGap={0} barCategoryGap={0}>
                        <Bar dataKey="stage">
                            {MOCK_SLEEP_DATA.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={
                                        entry.stage === 0 ? '#ef4444' : // Awake
                                            entry.stage === 3 ? '#818cf8' : // REM
                                                entry.stage === 2 ? '#312e81' : // Deep
                                                    '#6366f1' // Light
                                    }
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 flex justify-between text-[10px] text-slate-500 uppercase">
                <span>10PM</span>
                <span>7AM</span>
            </div>
        </div>
    );
};

export default SleepWidget;
