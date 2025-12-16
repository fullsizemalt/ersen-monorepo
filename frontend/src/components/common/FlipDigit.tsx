import React, { useEffect, useState } from 'react';
import './FlipDigit.css';

interface FlipDigitProps {
    value: string;
    label?: string; // Optional label below digit (e.g. "MIN")
}

const FlipDigit: React.FC<FlipDigitProps> = ({ value, label }) => {
    const [prevValue, setPrevValue] = useState(value);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (value !== prevValue) {
            setIsFlipping(true);
            const timeout = setTimeout(() => {
                setPrevValue(value);
                setIsFlipping(false);
            }, 600); // Sync with CSS transition
            return () => clearTimeout(timeout);
        }
    }, [value, prevValue]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flip-container">
                {/* Top Half (New Value) */}
                <div className="flip-card top-new">
                    <span className="digit-content">{value}</span>
                </div>

                {/* Top Half (Old Value) - Flips Down */}
                <div className={`flip-card top-current ${isFlipping ? 'flipping' : ''}`}>
                    <span className="digit-content">{prevValue}</span>
                </div>

                {/* Bottom Half (Old Value) */}
                <div className="flip-card bottom-current">
                    <span className="digit-content">{prevValue}</span>
                </div>

                {/* Bottom Half (New Value) - Flips Up (Reveal) */}
                <div className={`flip-card bottom-new ${isFlipping ? 'flipping' : ''}`}>
                    <span className="digit-content">{value}</span>
                </div>

                {/* Line Separator */}
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/80 z-20 shadow-sm" />
            </div>
            {label && <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</span>}
        </div>
    );
};

export default FlipDigit;
