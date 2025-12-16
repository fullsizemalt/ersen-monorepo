import React from 'react';
import { WidgetProps } from '../../../types/widget';

const FitnessRingWidget: React.FC<WidgetProps> = () => {
    // Canvas rings would be smoother, but SVG is fine for shell
    // Red: Move, Green: Exercise, Blue: Stand

    return (
        <div className="h-full flex items-center justify-center bg-black p-4">
            <div className="relative w-32 h-32">
                {/* Move Ring (Outer) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="#33000f" strokeWidth="12" fill="none" />
                    <circle cx="64" cy="64" r="60" stroke="#fa114f" strokeWidth="12" fill="none" strokeDasharray="377" strokeDashoffset="50" strokeLinecap="round" />
                </svg>

                {/* Exercise Ring (Middle) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 scale-75">
                    <circle cx="64" cy="64" r="60" stroke="#1d3005" strokeWidth="16" fill="none" />
                    <circle cx="64" cy="64" r="60" stroke="#a4ff00" strokeWidth="16" fill="none" strokeDasharray="377" strokeDashoffset="120" strokeLinecap="round" />
                </svg>

                {/* Stand Ring (Inner) */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 scale-50">
                    <circle cx="64" cy="64" r="60" stroke="#003330" strokeWidth="24" fill="none" />
                    <circle cx="64" cy="64" r="60" stroke="#00d9c0" strokeWidth="24" fill="none" strokeDasharray="377" strokeDashoffset="100" strokeLinecap="round" />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {/* Center Icons overlay could go here */}
                </div>
            </div>
        </div>
    );
};

export default FitnessRingWidget;
