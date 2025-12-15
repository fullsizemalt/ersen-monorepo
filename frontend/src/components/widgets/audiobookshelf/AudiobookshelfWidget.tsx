import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Book, Headphones, PlayCircle } from 'lucide-react';

const AudiobookshelfWidget: React.FC<WidgetProps> = () => {
    const currentBook = {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        cover: 'https://picsum.photos/seed/phm/200/300',
        progress: 45,
        timeLeft: '8h 12m'
    };

    return (
        <div className="h-full bg-[#373331] text-[#ececec] p-4 rounded-xl flex flex-col font-serif relative overflow-hidden">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none" />

            <div className="flex items-center gap-2 mb-4 relative z-10 text-[#d4b483]">
                <Book size={20} />
                <h3 className="font-bold font-sans">Audiobookshelf</h3>
            </div>

            <div className="flex-1 flex gap-4 relative z-10">
                <div className="w-1/3 flex-shrink-0">
                    <div className="aspect-[2/3] rounded shadow-lg overflow-hidden relative group cursor-pointer">
                        <img src={currentBook.cover} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1 text-xs text-[#d4b483] mb-1 font-sans uppercase tracking-wide">
                        <Headphones size={12} /> Now Listening
                    </div>
                    <h4 className="font-bold text-lg leading-tight mb-1 truncate">{currentBook.title}</h4>
                    <p className="text-sm text-gray-400 mb-4 truncate">{currentBook.author}</p>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-400 font-sans">
                            <span>{currentBook.progress}%</span>
                            <span>-{currentBook.timeLeft}</span>
                        </div>
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                            <div className="h-full bg-[#d4b483]" style={{ width: `${currentBook.progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudiobookshelfWidget;
