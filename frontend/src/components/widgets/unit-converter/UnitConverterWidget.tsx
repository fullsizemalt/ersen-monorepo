import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { ArrowRightLeft, Copy, Check, Scale, Thermometer, Ruler } from 'lucide-react';

const UNITS = {
    length: {
        name: 'Length',
        icon: Ruler,
        units: ['m', 'km', 'mi', 'ft', 'in', 'cm', 'mm', 'yd'],
        convert: (val: number, from: string, to: string) => {
            const toMeters: Record<string, number> = {
                m: 1, km: 1000, mi: 1609.34, ft: 0.3048, in: 0.0254, cm: 0.01, mm: 0.001, yd: 0.9144
            };
            return (val * toMeters[from]) / toMeters[to];
        }
    },
    weight: {
        name: 'Weight',
        icon: Scale,
        units: ['kg', 'lb', 'oz', 'g', 'mg', 'st'],
        convert: (val: number, from: string, to: string) => {
            const toKg: Record<string, number> = {
                kg: 1, lb: 0.453592, oz: 0.0283495, g: 0.001, mg: 0.000001, st: 6.35029
            };
            return (val * toKg[from]) / toKg[to];
        }
    },
    temp: {
        name: 'Temp',
        icon: Thermometer,
        units: ['°C', '°F', 'K'],
        convert: (val: number, from: string, to: string) => {
            let celsius = from === '°C' ? val : from === '°F' ? (val - 32) * 5 / 9 : val - 273.15;
            if (to === '°C') return celsius;
            if (to === '°F') return celsius * 9 / 5 + 32;
            return celsius + 273.15;
        }
    }
};

type CategoryKey = keyof typeof UNITS;

const UnitConverterWidget: React.FC<WidgetProps> = () => {
    const [category, setCategory] = useState<CategoryKey>('length');
    const [fromUnit, setFromUnit] = useState(UNITS.length.units[0]);
    const [toUnit, setToUnit] = useState(UNITS.length.units[1]);
    const [value, setValue] = useState('1');
    const [copied, setCopied] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);

    const result = UNITS[category].convert(parseFloat(value) || 0, fromUnit, toUnit);
    const formattedResult = result.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
    });

    const swap = () => {
        setIsSwapping(true);
        setTimeout(() => {
            setFromUnit(toUnit);
            setToUnit(fromUnit);
            setIsSwapping(false);
        }, 150);
    };

    const copyResult = async () => {
        await navigator.clipboard.writeText(result.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    useEffect(() => {
        setFromUnit(UNITS[category].units[0]);
        setToUnit(UNITS[category].units[1]);
    }, [category]);

    const CategoryIcon = UNITS[category].icon;

    return (
        <FlipCardWidget title="Unit Converter">
            <div className="flex flex-col h-full">
                {/* Category Tabs */}
                <div className="flex p-1 bg-muted/50 rounded-xl mb-3">
                    {(Object.entries(UNITS) as [CategoryKey, typeof UNITS[CategoryKey]][]).map(([key, { name, icon: Icon }]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[10px] font-medium transition-all ${category === key
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Icon size={12} />
                            <span className="hidden sm:inline">{name}</span>
                        </button>
                    ))}
                </div>

                {/* Converter Body */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-stretch gap-2">
                        {/* From */}
                        <div className="flex-1 space-y-1.5">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full bg-secondary border border-border rounded-xl px-3 py-3 text-lg font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="0"
                                />
                            </div>
                            <select
                                value={fromUnit}
                                onChange={(e) => setFromUnit(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                            >
                                {UNITS[category].units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        {/* Swap Button */}
                        <div className="flex items-center">
                            <button
                                onClick={swap}
                                className={`p-2.5 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all ${isSwapping ? 'rotate-180' : ''
                                    }`}
                                style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, color 0.2s' }}
                            >
                                <ArrowRightLeft size={16} />
                            </button>
                        </div>

                        {/* To */}
                        <div className="flex-1 space-y-1.5">
                            <button
                                onClick={copyResult}
                                className="w-full bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl px-3 py-3 text-lg font-mono text-foreground text-left flex items-center justify-between transition-all group"
                            >
                                <span className="truncate">{formattedResult}</span>
                                <span className={`transition-all ${copied ? 'text-green-500 scale-110' : 'text-muted-foreground group-hover:text-primary'}`}>
                                    {copied ? <Check size={16} /> : <Copy size={14} />}
                                </span>
                            </button>
                            <select
                                value={toUnit}
                                onChange={(e) => setToUnit(e.target.value)}
                                className="w-full bg-muted border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:outline-none cursor-pointer"
                            >
                                {UNITS[category].units.map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer hint */}
                <div className="text-center mt-2">
                    <p className="text-[10px] text-muted-foreground">
                        <CategoryIcon size={10} className="inline mr-1" />
                        Click result to copy
                    </p>
                </div>
            </div>
        </FlipCardWidget>
    );
};

export default UnitConverterWidget;
