import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { MessageSquare, Repeat, Heart } from 'lucide-react';

const MOCK_POSTS = [
    { user: 'Dan Abramov', handle: '@dan_abramov', text: 'Just shipped another experimental React build. It breaks everything. You are welcome.', time: '2h' },
    { user: 'Theo', handle: '@t3dotgg', text: 'I am once again asking you to use TypeScript.', time: '4h' },
    { user: 'Vercel', handle: '@vercel', text: 'Developing at the speed of light.', time: '5h' },
];

const SocialFeedWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border-x border-zinc-200 dark:border-zinc-800">
            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <span className="font-bold text-lg">Home</span>
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto">
                {MOCK_POSTS.map((post, i) => (
                    <div key={i} className="p-3 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 text-sm">
                                    <span className="font-bold truncate">{post.user}</span>
                                    <span className="text-muted-foreground truncate">{post.handle}</span>
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-muted-foreground">{post.time}</span>
                                </div>
                                <p className="text-sm mt-0.5 whitespace-normal break-words">
                                    {post.text}
                                </p>
                                <div className="flex justify-between mt-3 text-muted-foreground max-w-[80%]">
                                    <button className="hover:text-sky-500 transition-colors"><MessageSquare size={14} /></button>
                                    <button className="hover:text-green-500 transition-colors"><Repeat size={14} /></button>
                                    <button className="hover:text-red-500 transition-colors"><Heart size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full flex items-center px-4 text-sm text-muted-foreground">
                    What's up?
                </div>
            </div>
        </div>
    );
};

export default SocialFeedWidget;
