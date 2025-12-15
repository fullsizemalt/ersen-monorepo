import React from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';

const HeatmapWidget: React.FC<WidgetProps> = () => {
    // Generate mock data: 7 days x 5 weeks
    const data = Array.from({ length: 35 }, () => Math.floor(Math.random() * 5));

    const getColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-zinc-100 dark:bg-zinc-800';
            case 1: return 'bg-emerald-100 dark:bg-emerald-900/50';
            case 2: return 'bg-emerald-300 dark:bg-emerald-700';
            case 3: return 'bg-emerald-500 dark:bg-emerald-500';
            case 4: return 'bg-emerald-600 dark:bg-emerald-300';
            default: return 'bg-zinc-100 dark:bg-zinc-800';
        }
    };

    return (
        <WidgetWrapper title="Activity">
            <div className="flex flex-col h-full justify-center items-center">
                <div className="grid grid-cols-7 gap-1">
                    {data.map((level, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-sm ${getColor(level)}`}
                            title={`Activity level: ${level}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between w-full max-w-[140px] mt-2 text-[10px] text-zinc-500 dark:text-zinc-500">
                    <span>Less</span>
                    <span>More</span>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default HeatmapWidget;
