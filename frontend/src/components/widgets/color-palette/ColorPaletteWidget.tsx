import React, { useState, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Shuffle, Copy, Check, Lock, Unlock, Palette } from 'lucide-react';

interface ColorStop {
    hex: string;
    locked: boolean;
}

const generateRandomColor = (): string => {
    const h = Math.floor(Math.random() * 360);
    const s = 60 + Math.floor(Math.random() * 30);
    const l = 50 + Math.floor(Math.random() * 20);
    return hslToHex(h, s, l);
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

const getContrastColor = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const ColorPaletteWidget: React.FC<WidgetProps> = () => {
    const [palette, setPalette] = useState<ColorStop[]>(() =>
        Array(5).fill(null).map(() => ({ hex: generateRandomColor(), locked: false }))
    );
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const generatePalette = useCallback(() => {
        setIsShuffling(true);
        setTimeout(() => {
            setPalette(prev => prev.map(color =>
                color.locked ? color : { hex: generateRandomColor(), locked: false }
            ));
            setIsShuffling(false);
        }, 200);
    }, []);

    const copyColor = async (hex: string, index: number) => {
        await navigator.clipboard.writeText(hex);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const toggleLock = (index: number) => {
        setPalette(prev => prev.map((color, i) =>
            i === index ? { ...color, locked: !color.locked } : color
        ));
    };

    return (
        <FlipCardWidget title="Color Palette">
            <div className="flex flex-col h-full gap-3">
                {/* Color Swatches */}
                <div className={`flex-1 flex gap-1.5 min-h-[100px] transition-all ${isShuffling ? 'blur-sm scale-95' : ''}`}>
                    {palette.map((color, i) => {
                        const textColor = getContrastColor(color.hex);
                        return (
                            <div
                                key={i}
                                className="flex-1 rounded-xl relative group overflow-hidden transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
                                style={{ backgroundColor: color.hex }}
                                onClick={() => copyColor(color.hex, i)}
                            >
                                {/* Lock button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLock(i);
                                    }}
                                    className="absolute top-1.5 left-1/2 -translate-x-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                    style={{
                                        backgroundColor: `${textColor}20`,
                                        color: textColor
                                    }}
                                >
                                    {color.locked ? <Lock size={10} /> : <Unlock size={10} />}
                                </button>

                                {/* Lock indicator */}
                                {color.locked && (
                                    <div
                                        className="absolute top-1.5 left-1/2 -translate-x-1/2 p-1 rounded-md"
                                        style={{
                                            backgroundColor: `${textColor}30`,
                                            color: textColor
                                        }}
                                    >
                                        <Lock size={10} />
                                    </div>
                                )}

                                {/* Hex code */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 p-1.5 text-center opacity-0 group-hover:opacity-100 transition-all"
                                    style={{
                                        backgroundColor: `${textColor}20`,
                                        color: textColor
                                    }}
                                >
                                    <span className="text-[9px] font-mono font-medium flex items-center justify-center gap-1">
                                        {copiedIndex === i ? (
                                            <>
                                                <Check size={10} />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={10} />
                                                {color.hex}
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info text */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                    <Palette size={12} />
                    <span>Click to copy • Lock to keep</span>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePalette}
                    disabled={isShuffling}
                    className="flex items-center justify-center gap-2 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                >
                    <Shuffle size={14} className={isShuffling ? 'animate-spin' : ''} />
                    {isShuffling ? 'Generating...' : 'Generate New Palette'}
                </button>
            </div>
        </FlipCardWidget>
    );
};

export default ColorPaletteWidget;
