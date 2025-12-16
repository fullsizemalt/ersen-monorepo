import React from 'react';
import { WidgetProps } from '../../../types/widget';

const ScreensaverWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500">
            Screensaver (Coming Soon)
        </div>
    );
};
export default ScreensaverWidget;
