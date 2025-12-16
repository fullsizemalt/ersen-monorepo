import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Twitch, MessageSquare, Activity, Share2, Users, Mic, Video } from 'lucide-react';

const StreamerToolsWidget: React.FC<WidgetProps> = () => {
    const [isLive, setIsLive] = useState(false);
    const [viewers, setViewers] = useState(1243);
    const [title, setTitle] = useState("Late Night Coding & Chill ☕ | Building Widgets");

    return (
        <div className="h-full w-full bg-zinc-950 flex flex-col text-white overflow-hidden font-sans">
            {/* Header */}
            <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <Twitch size={18} className="text-[#9146FF]" />
                    <span className="font-bold text-sm tracking-wide">STREAM DECK</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLive ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-500' : 'bg-zinc-500'}`} />
                    {isLive ? 'LIVE' : 'OFFLINE'}
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Main Control Panel */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">

                    {/* Stream Info */}
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 font-medium uppercase">Stream Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#9146FF] transition-colors"
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <Users size={14} />
                                <span>Viewers</span>
                            </div>
                            <span className="text-xl font-bold font-mono">{isLive ? viewers.toLocaleString() : '-'}</span>
                        </div>
                        <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                <Activity size={14} />
                                <span>Bitrate</span>
                            </div>
                            <span className="text-xl font-bold font-mono text-emerald-400">{isLive ? '6000' : '0'} kbps</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button
                            onClick={() => setIsLive(!isLive)}
                            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${isLive
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'}`}
                        >
                            {isLive ? 'End Stream' : 'Go Live'}
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
                            <Share2 size={16} />
                            Tweet
                        </button>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-zinc-800 hidden md:block" />

                {/* Chat Preview / Audio */}
                <div className="w-full md:w-1/3 bg-zinc-900/30 flex flex-col border-t md:border-t-0 border-zinc-800">
                    <div className="p-2 border-b border-zinc-800 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 font-bold uppercase flex items-center gap-1.5">
                            <MessageSquare size={12} /> Chat
                        </span>
                    </div>
                    <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs font-mono">
                        {isLive ? (
                            <>
                                <p><span className="text-[#9146FF] font-bold">ten_dev:</span> poggers implementation</p>
                                <p><span className="text-emerald-400 font-bold">nightbot:</span> Don't forget to drink water! 💧</p>
                                <p><span className="text-blue-400 font-bold">user123:</span> is this react?</p>
                                <p><span className="text-orange-400 font-bold">fan_ 1:</span> LETS GOOO</p>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600">
                                <span>Offline</span>
                            </div>
                        )}
                    </div>

                    {/* Audio Toggles */}
                    <div className="p-3 border-t border-zinc-800 flex justify-center gap-4">
                        <button className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"><Mic size={16} /></button>
                        <button className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"><Video size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamerToolsWidget;
