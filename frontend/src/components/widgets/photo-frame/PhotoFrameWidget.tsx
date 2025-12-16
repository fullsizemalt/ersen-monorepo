import React from 'react';
import { WidgetProps } from '../../../types/widget';
import PhotoGallery, { Photo } from '../../common/PhotoGallery';

// Demo photos from Unsplash
const DEMO_PHOTOS: Photo[] = [
    {
        id: '1',
        url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80',
        caption: 'Alpine Lake',
        photographer: 'Davide Cantelli'
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
        caption: 'Forest Mist',
        photographer: 'Lukasz Szmigiel'
    },
    {
        id: '3',
        url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
        caption: 'Mountain Sunrise',
        photographer: 'Patrick Hendry'
    },
    {
        id: '4',
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
        caption: 'Foggy Morning',
        photographer: 'Vadim Sherbakov'
    }
];

const PhotoFrameWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full w-full bg-black relative">
            <PhotoGallery
                photos={DEMO_PHOTOS}
                interval={8000}
                variant="cover"
            />

            {/* Aesthetic Border Effect */}
            <div className="absolute inset-0 border-[12px] border-white pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                {/* Mat board texture */}
                <div className="absolute inset-0 border border-black/10 opacity-20"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\' fill=\'%23000000\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}
                />
            </div>
        </div>
    );
};

export default PhotoFrameWidget;
