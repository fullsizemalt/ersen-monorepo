import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import FlipDigit from '../../common/FlipDigit';
import { WidgetProps } from '../../../types/widget';

const FlipBoardWidget: React.FC<WidgetProps> = () => {
    const [time, setTime] = useState(new Date());
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        setIsLoaded(true);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    // Format date like a destination: "DEC 15 2025"
    const month = time.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = time.getDate().toString().padStart(2, '0');
    const year = time.getFullYear();
    const weekday = time.toLocaleString('default', { weekday: 'short' }).toUpperCase();

    if (!isLoaded) return <div className="w-full h-full bg-zinc-950 animate-pulse" />;

    return (
        <div className="h-full w-full flex flex-col bg-zinc-950 relative overflow-hidden group">

            {/* Ambient reflection/glare for realism */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10" />

            {/* Header / Destination format */}
            <div className="h-[30%] border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Location</span>
                        <span className="text-sm font-bold text-amber-500 tracking-wider font-mono">LOCAL_TIME</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Status</span>
                    <span className="text-xs font-bold text-emerald-500 tracking-widest animate-pulse">ON TIME</span>
                </div>
            </div>

            {/* Split Flap Display Area */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden">

                {/* Hours */}
                <div className="flex gap-[2px] sm:gap-1">
                    <FlipDigit value={hours[0]} />
                    <FlipDigit value={hours[1]} />
                </div>

                {/* Separator - Blinking dots */}
                <div className="flex flex-col gap-2 sm:gap-3 py-2 justify-center opacity-80">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-700 shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-700 shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                </div>

                {/* Minutes */}
                <div className="flex gap-[2px] sm:gap-1">
                    <FlipDigit value={minutes[0]} />
                    <FlipDigit value={minutes[1]} />
                </div>

                {/* Separator (visible on larger widgets/screens) */}
                <div className="hidden sm:flex flex-col gap-3 py-2 justify-center opacity-80">
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                </div>

                {/* Seconds (hidden on very small screens if needed, but keeping for cool factor) */}
                <div className="hidden sm:flex gap-1 scale-90 origin-left">
                    <FlipDigit value={seconds[0]} />
                    <FlipDigit value={seconds[1]} />
                </div>
            </div>

            {/* Footer / Date */}
            <div className="h-[25%] bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between px-4 font-mono text-zinc-400 text-xs sm:text-sm tracking-widest">
                <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-zinc-600" />
                    <span>{weekday} {month} {day}</span>
                </div>
                <span className="text-zinc-600">{year}</span>
            </div>

            {/* Mechanical Screws Corner Detail */}
            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[inset_1px_1px_1px_black] opacity-50" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[inset_1px_1px_1px_black] opacity-50" />
            <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[inset_1px_1px_1px_black] opacity-50" />
            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-zinc-800 shadow-[inset_1px_1px_1px_black] opacity-50" />
        </div>
    );
};

export default FlipBoardWidget;
