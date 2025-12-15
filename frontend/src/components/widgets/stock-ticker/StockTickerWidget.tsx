import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockTickerWidget: React.FC<WidgetProps> = () => {
    const stocks = [
        { symbol: 'AAPL', price: '189.45', change: '+1.2%', up: true },
        { symbol: 'MSFT', price: '378.80', change: '+0.8%', up: true },
        { symbol: 'GOOGL', price: '138.20', change: '-0.5%', up: false },
        { symbol: 'TSLA', price: '234.10', change: '-1.8%', up: false },
        { symbol: 'NVDA', price: '485.00', change: '+2.5%', up: true },
    ];

    return (
        <div className="h-full bg-gray-900 text-white p-4 rounded-xl flex flex-col border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp size={20} />
                    <h3 className="font-bold">Market Watch</h3>
                </div>
                <span className="text-xs text-green-500 bg-green-900/30 px-2 py-0.5 rounded">Open</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {stocks.map(stock => (
                    <div key={stock.symbol} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded transition-colors">
                        <div>
                            <div className="font-bold text-sm">{stock.symbol}</div>
                            <div className="text-xs text-gray-400">US Equity</div>
                        </div>
                        <div className="text-right">
                            <div className="font-mono text-sm">${stock.price}</div>
                            <div className={`text-xs flex items-center justify-end gap-0.5 ${stock.up ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {stock.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockTickerWidget;
