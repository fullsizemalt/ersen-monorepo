import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import FlipDigit from '../../common/FlipDigit';
import { WidgetProps } from '../../../types/widget';

const FlipBoardWidget: React.FC<WidgetProps> = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const year = time.getFullYear().toString();
    const month = (time.getMonth() + 1).toString().padStart(2, '0');
    const day = time.getDate().toString().padStart(2, '0');

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4 relative overflow-hidden">

            {/* Header/Status Line */}
            <div className="absolute top-4 left-6 flex items-center gap-2 text-amber-500/80 font-mono text-xs uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Departures / Current Time</span>
            </div>

            <div className="flex flex-col gap-6 scale-90 sm:scale-100">
                {/* Time Row */}
                <div className="flex items-end gap-3">
                    <div className="flex gap-1">
                        <FlipDigit value={hours[0]} />
                        <FlipDigit value={hours[1]} label="HRS" />
                    </div>
                    <div className="text-4xl font-bold pb-8 text-zinc-600 animate-pulse">:</div>
                    <div className="flex gap-1">
                        <FlipDigit value={minutes[0]} />
                        <FlipDigit value={minutes[1]} label="MIN" />
                    </div>
                    <div className="text-4xl font-bold pb-8 text-zinc-600 animate-pulse">:</div>
                    <div className="flex gap-1">
                        <FlipDigit value={seconds[0]} />
                        <FlipDigit value={seconds[1]} label="SEC" />
                    </div>
                </div>

                {/* Date Row (Smaller) */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-900">
                    <div className="flex items-center gap-2 text-zinc-500 font-mono">
                        <Calendar size={16} />
                        <span className="text-lg tracking-widest">
                            {year}-{month}-{day}
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative "Screws" */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-800 shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-800 shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-800 shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-800 shadow-inner" />
        </div>
    );
};

export default FlipBoardWidget;
