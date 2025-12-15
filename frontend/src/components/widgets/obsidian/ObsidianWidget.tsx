import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { FileText, Folder, RefreshCw, Hash } from 'lucide-react';

const ObsidianWidget: React.FC<WidgetProps> = () => {
    const recentFiles = [
        { id: 1, name: 'Project Ideas.md', folder: 'Brainstorming', updated: '2m ago' },
        { id: 2, name: 'Daily Journal 2023-11-29.md', folder: 'Journal', updated: '1h ago' },
        { id: 3, name: 'React Patterns.md', folder: 'Dev/Notes', updated: 'Yesterday' },
    ];

    return (
        <div className="h-full bg-[#1e1e1e] text-gray-300 p-4 rounded-xl flex flex-col font-mono border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-400">
                    <div className="w-6 h-6 bg-purple-900/50 rounded flex items-center justify-center">
                        <span className="font-bold text-xs">Obs</span>
                    </div>
                    <h3 className="font-bold text-sm">Obsidian Sync</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Synced
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Recent Files</div>
                {recentFiles.map(file => (
                    <div key={file.id} className="group flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer transition-colors">
                        <FileText size={16} className="text-gray-500 group-hover:text-purple-400" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-300 truncate group-hover:text-white">{file.name}</div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-600">
                                <Folder size={10} />
                                {file.folder}
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-600">{file.updated}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-3">
                    <span className="flex items-center gap-1 hover:text-gray-300 cursor-pointer"><Hash size={12} /> Graph</span>
                    <span className="flex items-center gap-1 hover:text-gray-300 cursor-pointer"><RefreshCw size={12} /> Sync</span>
                </div>
                <span>v1.4.16</span>
            </div>
        </div>
    );
};

export default ObsidianWidget;
