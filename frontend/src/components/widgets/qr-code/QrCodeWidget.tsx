import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';

const QrCodeWidget: React.FC<WidgetProps> = () => {
    const [text, setText] = useState('https://ersen.xyz');

    return (
        <div className="h-full flex flex-col p-4 items-center justify-center bg-white text-black">
            <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`}
                alt="QR Code"
                className="w-32 h-32 mb-4 mix-blend-multiply"
            />
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded text-xs"
                placeholder="Enter URL..."
            />
        </div>
    );
};

export default QrCodeWidget;
