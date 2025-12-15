import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Download, Music, Search, Check } from 'lucide-react';

const MusicDownloadWidget: React.FC<WidgetProps> = () => {
    const [query, setQuery] = useState('');
    const [downloading, setDownloading] = useState<number | null>(null);

    const results = [
        { id: 1, title: 'Lo-Fi Beats 2024', artist: 'Chillhop', size: '45MB' },
        { id: 2, title: 'Synthwave Mix', artist: 'Retro', size: '120MB' },
        { id: 3, title: 'Jazz Classics', artist: 'Various', size: '85MB' },
    ];

    const handleDownload = (id: number) => {
        setDownloading(id);
        setTimeout(() => setDownloading(null), 2000);
    };

    return (
        <div className="h-full bg-gradient-to-br from-indigo-900 to-purple-900 p-4 rounded-xl flex flex-col text-white">
            <div className="flex items-center gap-2 mb-4">
                <Music className="text-pink-400" size={20} />
                <h3 className="font-bold">Music Downloader</h3>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search URL or keywords..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-500"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {results.map(track => (
                    <div key={track.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                        <div className="min-w-0 flex-1 mr-4">
                            <h4 className="font-medium text-sm truncate">{track.title}</h4>
                            <p className="text-xs text-gray-400">{track.artist} • {track.size}</p>
                        </div>
                        <button
                            onClick={() => handleDownload(track.id)}
                            className={`p-2 rounded-full transition-all ${downloading === track.id
                                    ? 'bg-green-500 text-white'
                                    : 'bg-white/10 text-gray-300 hover:bg-pink-500 hover:text-white'
                                }`}
                        >
                            {downloading === track.id ? <Check size={16} /> : <Download size={16} />}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicDownloadWidget;
