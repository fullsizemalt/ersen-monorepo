import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Play, ChevronRight, Clock } from 'lucide-react';

const PlexWidget: React.FC<WidgetProps> = () => {
    const onDeck = [
        { id: 1, show: 'Breaking Bad', episode: 'S5:E14', title: 'Ozymandias', image: 'https://picsum.photos/seed/bb/300/170' },
        { id: 2, show: 'The Office', episode: 'S3:E1', title: 'Gay Witch Hunt', image: 'https://picsum.photos/seed/office/300/170' },
    ];

    return (
        <div className="h-full bg-[#1f2326] text-[#e5a00d] p-0 rounded-xl flex flex-col overflow-hidden font-sans">
            <div className="p-4 bg-[#282a2d] flex items-center justify-between border-b border-black/20">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold tracking-tighter text-[#e5a00d]">plex</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">
                    T
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#1f2326]">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-400 font-bold text-sm uppercase">On Deck</h4>
                    <ChevronRight size={16} className="text-gray-600" />
                </div>

                <div className="space-y-4">
                    {onDeck.map(item => (
                        <div key={item.id} className="group cursor-pointer">
                            <div className="relative aspect-video rounded-md overflow-hidden mb-2">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                                    <div className="w-12 h-12 bg-[#e5a00d] rounded-full flex items-center justify-center text-black hover:scale-110 transition-transform shadow-lg">
                                        <Play size={24} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-300">
                                    22m left
                                </div>
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-200 text-sm leading-tight group-hover:text-[#e5a00d] transition-colors">{item.show}</h5>
                                <p className="text-xs text-gray-500 mt-0.5">{item.episode} — {item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <Clock size={16} />
                        <span className="text-sm font-medium">Watch History</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlexWidget;
