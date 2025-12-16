import React from 'react';
import { WidgetProps } from '../../../types/widget';

const PhotoFrameWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full w-full relative overflow-hidden group">
            <img
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&q=80"
                alt="Landscape"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">Alps, Switzerland</p>
            </div>
        </div>
    );
};

export default PhotoFrameWidget;
