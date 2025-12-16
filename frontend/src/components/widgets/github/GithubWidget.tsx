import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { GitPullRequest, GitMerge, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const GithubWidget: React.FC<WidgetProps> = () => {
    const prs = [
        { id: 1, title: 'feat: Add subscription flow', repo: 'ersen-app', status: 'open', author: 'ten' },
        { id: 2, title: 'fix: Widget grid layout', repo: 'ersen-app', status: 'merged', author: 'ten' },
        { id: 3, title: 'chore: Update dependencies', repo: 'ersen-backend', status: 'closed', author: 'bot' },
    ];

    return (
        <div className="h-full bg-[#0d1117] p-4 rounded-xl flex flex-col text-white border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-800 rounded-full">
                        <GitPullRequest size={16} />
                    </div>
                    <h3 className="font-bold text-sm">Pull Requests</h3>
                </div>
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400">3 active</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {prs.map(pr => (
                    <div key={pr.id} className="group p-3 bg-gray-800/40 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-all cursor-pointer">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 ${pr.status === 'open' ? 'text-green-500' :
                                pr.status === 'merged' ? 'text-purple-500' : 'text-red-500'
                                }`}>
                                {pr.status === 'open' ? <AlertCircle size={16} /> :
                                    pr.status === 'merged' ? <GitMerge size={16} /> : <CheckCircle size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors">{pr.title}</h4>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <span>{pr.repo}</span>
                                    <span>•</span>
                                    <span>#{pr.id + 100}</span>
                                    <span>•</span>
                                    <span>by {pr.author}</span>
                                </div>
                            </div>
                            <ExternalLink size={14} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GithubWidget;
