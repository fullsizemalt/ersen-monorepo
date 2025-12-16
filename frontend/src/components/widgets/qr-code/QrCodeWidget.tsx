import React from 'react';
import { WidgetProps } from '../../../types/widget';

const QrCodeWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-zinc-500">
            QR Code (Coming Soon)
        </div>
    );
};
export default QrCodeWidget;
