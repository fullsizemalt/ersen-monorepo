import React from 'react';
import { WidgetProps } from '../../../types/widget';

const PhotoFrameWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500">
            Photo Frame (Coming Soon)
        </div>
    );
};
export default PhotoFrameWidget;
