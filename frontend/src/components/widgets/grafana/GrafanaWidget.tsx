import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Activity, Server, Database, Cpu } from 'lucide-react';

const GrafanaWidget: React.FC<WidgetProps> = () => {
    return (
        <div className="h-full bg-[#181b1f] text-gray-200 p-4 rounded-xl flex flex-col border border-gray-800 font-sans">
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2 text-[#FF9900]">
                    <Activity size={20} />
                    <h3 className="font-bold">System Overview</h3>
                </div>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-700 rounded text-gray-300">Last 1h</span>
                    <span className="px-2 py-0.5 bg-blue-600 rounded text-white">Refresh</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* CPU Usage */}
                <div className="bg-[#111217] p-3 rounded border border-gray-700 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Cpu size={14} /> CPU Usage
                    </div>
                    <div className="flex-1 flex items-end gap-1 h-full px-2 pb-2">
                        {[40, 65, 55, 80, 45, 60, 75, 50, 65, 40].map((h, i) => (
                            <div key={i} className="flex-1 bg-green-500/50 hover:bg-green-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <div className="text-right text-xl font-bold text-green-400">42%</div>
                </div>

                {/* Memory Usage */}
                <div className="bg-[#111217] p-3 rounded border border-gray-700 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Database size={14} /> Memory
                    </div>
                    <div className="flex-1 relative flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-700 border-t-blue-500 rotate-45" />
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">
                            8.2GB
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-1">of 16GB</div>
                </div>

                {/* Network I/O */}
                <div className="bg-[#111217] p-3 rounded border border-gray-700 col-span-2 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Server size={14} /> Network Traffic
                    </div>
                    <div className="flex-1 flex items-end gap-0.5 h-full">
                        {Array.from({ length: 20 }).map((_, i) => {
                            const h = Math.random() * 80 + 10;
                            return (
                                <div key={i} className="flex-1 bg-yellow-500/30 hover:bg-yellow-500 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Rx: 45 MB/s</span>
                        <span>Tx: 12 MB/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrafanaWidget;
