import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Flame, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const PrometheusWidget: React.FC<WidgetProps> = () => {
    const alerts = [
        { id: 1, name: 'HighMemoryUsage', state: 'firing', value: '92%', time: '2m' },
        { id: 2, name: 'KubePodCrashLooping', state: 'pending', value: '1', time: '5m' },
        { id: 3, name: 'NodeDown', state: 'resolved', value: '0', time: '1h' },
    ];

    return (
        <div className="h-full bg-[#22252b] text-[#e3e5e8] p-4 rounded-xl flex flex-col border border-gray-700 font-mono">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#e6522c]">
                    <Flame size={20} fill="currentColor" />
                    <h3 className="font-bold tracking-tight">Prometheus</h3>
                </div>
                <div className="flex items-center gap-2 bg-[#1b1d21] px-2 py-1 rounded border border-gray-600">
                    <Search size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-400">Expression...</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">Active Alerts</div>
                {alerts.map(alert => (
                    <div key={alert.id} className={`p-2 rounded border-l-4 ${alert.state === 'firing' ? 'bg-[#382020] border-red-500' :
                            alert.state === 'pending' ? 'bg-[#383020] border-yellow-500' :
                                'bg-[#203820] border-green-500'
                        }`}>
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">{alert.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${alert.state === 'firing' ? 'bg-red-500/20 text-red-400' :
                                    alert.state === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-green-500/20 text-green-400'
                                }`}>
                                {alert.state}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Value: {alert.value}</span>
                            <span>{alert.time} ago</span>
                        </div>
                    </div>
                ))}

                <div className="mt-4 p-2 bg-[#1b1d21] rounded border border-gray-600">
                    <div className="text-xs text-gray-500 mb-1">Target Health</div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-green-400 text-xs">
                            <CheckCircle size={12} /> 12 Up
                        </div>
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                            <AlertTriangle size={12} /> 1 Down
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrometheusWidget;
