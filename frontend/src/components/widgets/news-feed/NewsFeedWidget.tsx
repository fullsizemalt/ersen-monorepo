import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Newspaper, ExternalLink } from 'lucide-react';

const NewsFeedWidget: React.FC<WidgetProps> = () => {
    const news = [
        { id: 1, title: 'SpaceX Launches New Starship Prototype', source: 'TechCrunch', time: '2h ago' },
        { id: 2, title: 'AI Regulation Summit Begins in London', source: 'BBC', time: '4h ago' },
        { id: 3, title: 'New Battery Tech Promises 2x Range', source: 'The Verge', time: '6h ago' },
        { id: 4, title: 'Global Markets Rally on Tech Earnings', source: 'Bloomberg', time: '8h ago' },
    ];

    return (
        <div className="h-full bg-white text-gray-900 p-4 rounded-xl flex flex-col border border-gray-200">
            <div className="flex items-center gap-2 mb-4 text-red-600">
                <Newspaper size={20} />
                <h3 className="font-bold">Top Stories</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {news.map(item => (
                    <div key={item.id} className="group cursor-pointer">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500 font-medium">{item.source}</span>
                            <span className="text-[10px] text-gray-400">{item.time}</span>
                        </div>
                        <div className="h-px bg-gray-100 mt-3" />
                    </div>
                ))}
            </div>

            <button className="mt-2 text-xs text-center text-gray-500 hover:text-blue-600 flex items-center justify-center gap-1">
                Read more <ExternalLink size={10} />
            </button>
        </div>
    );
};

export default NewsFeedWidget;
