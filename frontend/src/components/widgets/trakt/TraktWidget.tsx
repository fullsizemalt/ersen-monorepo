import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Play } from 'lucide-react';

const MOCK_SHOWS = [
    { title: 'Severance', ep: 'S2 E3', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=150&h=225&q=80' },
    { title: 'The Bear', ep: 'S3 E1', img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=150&h=225&q=80' },
    { title: 'Succession', ep: 'S4 E9', img: 'https://images.unsplash.com/photo-1507676184212-d03ab07a11d0?w=150&h=225&q=80' },
];

const TraktWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full flex flex-col bg-[#1d1d1d] text-white overflow-hidden p-3 relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">UP NEXT</span>
            </div>

            <div className="flex-1 flex flex-col gap-2">
                {MOCK_SHOWS.map((show, i) => (
                    <div key={i} className="flex gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                        <img src={show.img} alt={show.title} className="w-8 h-12 object-cover rounded shadow-md" />
                        <div className="flex flex-col justify-center min-w-0">
                            <span className="text-sm font-medium truncate leading-tight group-hover:text-red-400 transition-colors">{show.title}</span>
                            <span className="text-xs text-white/50">{show.ep}</span>
                        </div>
                        <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play size={12} className="fill-white" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                <button className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold">Connect Trakt</button>
            </div>
        </div>
    );
};

export default TraktWidget;
