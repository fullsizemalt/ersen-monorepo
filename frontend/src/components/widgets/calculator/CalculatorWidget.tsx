import React, { useState, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Divide, X, Minus, Plus, Equal, Percent } from 'lucide-react';

const CalculatorWidget: React.FC<WidgetProps> = () => {
    const [display, setDisplay] = useState('0');
    const [equation, setEquation] = useState('');
    const [lastPressed, setLastPressed] = useState<string | null>(null);

    const formatNumber = (num: string): string => {
        const parts = num.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const handlePress = useCallback((val: string) => {
        setLastPressed(val);
        setTimeout(() => setLastPressed(null), 100);

        if (val === 'C') {
            setDisplay('0');
            setEquation('');
        } else if (val === 'DEL') {
            setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        } else if (val === '%') {
            const current = parseFloat(display);
            setDisplay(String(current / 100));
        } else if (val === '±') {
            setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
        } else if (val === '=') {
            try {
                const expr = (equation + display).replace(/,/g, '');
                // Use Function constructor instead of eval for slightly better safety
                const res = new Function('return ' + expr)();
                const formatted = Number.isInteger(res) ? String(res) : res.toFixed(8).replace(/\.?0+$/, '');
                setDisplay(formatted);
                setEquation('');
            } catch {
                setDisplay('Error');
                setEquation('');
            }
        } else if (['+', '-', '×', '÷'].includes(val)) {
            const op = val === '×' ? '*' : val === '÷' ? '/' : val;
            setEquation(display.replace(/,/g, '') + op);
            setDisplay('0');
        } else if (val === '.') {
            if (!display.includes('.')) {
                setDisplay(prev => prev + '.');
            }
        } else {
            setDisplay(prev => prev === '0' ? val : prev + val);
        }
    }, [display, equation]);

    const buttons = [
        { label: 'C', type: 'control', icon: null },
        { label: '±', type: 'control', icon: null },
        { label: '%', type: 'control', icon: <Percent size={16} /> },
        { label: '÷', type: 'operator', icon: <Divide size={18} /> },
        { label: '7', type: 'number', icon: null },
        { label: '8', type: 'number', icon: null },
        { label: '9', type: 'number', icon: null },
        { label: '×', type: 'operator', icon: <X size={18} /> },
        { label: '4', type: 'number', icon: null },
        { label: '5', type: 'number', icon: null },
        { label: '6', type: 'number', icon: null },
        { label: '-', type: 'operator', icon: <Minus size={18} /> },
        { label: '1', type: 'number', icon: null },
        { label: '2', type: 'number', icon: null },
        { label: '3', type: 'number', icon: null },
        { label: '+', type: 'operator', icon: <Plus size={18} /> },
        { label: '0', type: 'number', span: 2, icon: null },
        { label: '.', type: 'number', icon: null },
        { label: '=', type: 'equals', icon: <Equal size={18} /> },
    ];

    return (
        <FlipCardWidget title="Calculator">
            <div className="flex flex-col h-full gap-2">
                {/* Display */}
                <div className="bg-secondary rounded-xl p-3 text-right">
                    <div className="text-xs text-muted-foreground h-4 font-mono truncate">
                        {equation.replace(/\*/g, '×').replace(/\//g, '÷')}
                    </div>
                    <div className="text-2xl font-bold font-mono text-foreground truncate tabular-nums">
                        {formatNumber(display)}
                    </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {buttons.map(btn => (
                        <button
                            key={btn.label}
                            onClick={() => handlePress(btn.label)}
                            className={`rounded-xl text-sm font-semibold transition-all flex items-center justify-center active:scale-95 ${lastPressed === btn.label ? 'scale-95' : ''
                                } ${btn.type === 'equals'
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : btn.type === 'operator'
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                        : btn.type === 'control'
                                            ? 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                                            : 'bg-secondary text-foreground hover:bg-secondary/80'
                                } ${btn.span === 2 ? 'col-span-2' : ''}`}
                        >
                            {btn.icon || btn.label}
                        </button>
                    ))}
                </div>
            </div>
        </FlipCardWidget>
    );
};

export default CalculatorWidget;
