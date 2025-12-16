import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Monitor } from 'lucide-react';

const ScreensaverWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-black text-emerald-500 font-mono p-4 text-center">
            <Monitor size={32} className="mb-2 animate-pulse" />
            <span className="text-xl font-bold tracking-widest">SYSTEM_IDLE</span>
            <span className="text-xs text-emerald-500/50 mt-1">Screensaver Module Active</span>
        </div>
    );
};

export default ScreensaverWidget;
