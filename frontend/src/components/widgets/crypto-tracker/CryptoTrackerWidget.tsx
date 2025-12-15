import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Bitcoin, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const CryptoTrackerWidget: React.FC<WidgetProps> = () => {
    const coins = [
        { symbol: 'BTC', name: 'Bitcoin', price: '38,450.00', change: '+2.4%', up: true },
        { symbol: 'ETH', name: 'Ethereum', price: '2,120.50', change: '+1.8%', up: true },
        { symbol: 'SOL', name: 'Solana', price: '65.40', change: '-3.2%', up: false },
        { symbol: 'DOGE', name: 'Dogecoin', price: '0.08', change: '+5.1%', up: true },
    ];

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 to-blue-900 text-white p-4 rounded-xl flex flex-col border border-blue-900/50">
            <div className="flex items-center gap-2 mb-4 text-orange-400">
                <Bitcoin size={20} />
                <h3 className="font-bold">Crypto</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {coins.map(coin => (
                    <div key={coin.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                                {coin.symbol[0]}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{coin.name}</div>
                                <div className="text-xs text-gray-400">{coin.symbol}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-sm">${coin.price}</div>
                            <div className={`text-xs flex items-center justify-end gap-0.5 ${coin.up ? 'text-green-400' : 'text-red-400'}`}>
                                {coin.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {coin.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-gray-400">
                <span>Portfolio: $0.00</span>
                <Activity size={14} />
            </div>
        </div>
    );
};

export default CryptoTrackerWidget;
