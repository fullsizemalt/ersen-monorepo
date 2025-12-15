import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Play, Film, Tv, MoreVertical } from 'lucide-react';

const JellyfinWidget: React.FC<WidgetProps> = () => {
    const continueWatching = [
        { id: 1, title: 'The Matrix', progress: 85, image: 'https://picsum.photos/seed/matrix/300/170' },
        { id: 2, title: 'Inception', progress: 40, image: 'https://picsum.photos/seed/inception/300/170' },
    ];

    return (
        <div className="h-full bg-[#000b1c] text-white p-4 rounded-xl flex flex-col overflow-hidden relative">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-900/40 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center font-bold">J</div>
                    <h3 className="font-bold">Jellyfin</h3>
                </div>
                <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto relative z-10">
                <section className="mb-6">
                    <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Continue Watching</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {continueWatching.map(item => (
                            <div key={item.id} className="min-w-[140px] group cursor-pointer relative">
                                <div className="aspect-video rounded-lg overflow-hidden relative bg-gray-800">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                                            <Play size={20} fill="currentColor" className="ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
                                        <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                                    </div>
                                </div>
                                <div className="mt-2 text-sm font-medium truncate">{item.title}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Libraries</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800/50 hover:bg-gray-800 p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                            <Film className="text-purple-400" size={20} />
                            <span className="font-medium text-sm">Movies</span>
                        </div>
                        <div className="bg-gray-800/50 hover:bg-gray-800 p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                            <Tv className="text-blue-400" size={20} />
                            <span className="font-medium text-sm">TV Shows</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default JellyfinWidget;
