import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { QrCode, Wifi, Link as LinkIcon } from 'lucide-react';

const QrCodeWidget: React.FC<WidgetProps> = ({ config }) => {
    const [value, setValue] = useState(config?.initialValue || 'WIFI:S:ErsenGuest;T:WPA;P:password123;;');
    const [label, setLabel] = useState(config?.initialLabel || 'Guest Wi-Fi');

    // Generate QR URL (using public API for MVP to avoid deps)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(value)}&color=000000&bgcolor=FFFFFF&margin=10`;

    return (
        <div className="h-full w-full bg-zinc-950 flex flex-col text-white overflow-hidden p-4">
            <div className="flex-1 flex flex-col items-center justify-center gap-4">

                {/* QR Display */}
                <div className="relative group">
                    <div className="bg-white p-2 rounded-xl border-4 border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform hover:scale-105">
                        <img
                            src={qrUrl}
                            alt="QR Code"
                            className="w-40 h-40 object-contain rendering-pixelated"
                        />
                    </div>
                </div>

                {/* Label & Input */}
                <div className="w-full max-w-[200px] flex flex-col gap-2">
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="text-center bg-transparent text-lg font-bold focus:outline-none border-b border-transparent focus:border-zinc-700 transition-colors placeholder-zinc-700"
                        placeholder="Label"
                    />
                    <div className="relative">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-400 focus:outline-none focus:text-white transition-colors pr-8"
                            placeholder="Data / URL / WiFi String"
                        />
                        <QrCode size={12} className="absolute right-2 top-1.5 text-zinc-600" />
                    </div>
                </div>
            </div>

            {/* Helper Hints */}
            <div className="pt-3 border-t border-zinc-900 flex justify-center gap-3 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1"><Wifi size={10} /> Wi-Fi</span>
                <span className="flex items-center gap-1"><LinkIcon size={10} /> URL</span>
            </div>
        </div>
    );
};

export default QrCodeWidget;
