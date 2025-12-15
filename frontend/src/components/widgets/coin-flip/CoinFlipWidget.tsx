import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { RotateCcw } from 'lucide-react';

const CoinFlipWidget: React.FC<WidgetProps> = () => {
    const [result, setResult] = useState<'heads' | 'tails' | null>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [stats, setStats] = useState({ heads: 0, tails: 0 });

    const flip = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setResult(null);

        // Animate the flip
        setTimeout(() => {
            const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
            setResult(outcome);
            setStats(prev => ({
                ...prev,
                [outcome]: prev[outcome] + 1
            }));
            setIsFlipping(false);
        }, 1000);
    };

    const reset = () => {
        setResult(null);
        setStats({ heads: 0, tails: 0 });
    };

    const total = stats.heads + stats.tails;

    return (
        <FlipCardWidget title="Coin Flip">
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Coin */}
                <button
                    onClick={flip}
                    disabled={isFlipping}
                    className="relative focus:outline-none"
                >
                    <div
                        className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-xl ${isFlipping
                                ? 'animate-coin-flip'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                        style={{
                            background: result === 'tails'
                                ? 'linear-gradient(135deg, #b8860b 0%, #ffd700 50%, #b8860b 100%)'
                                : 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #ffd700 100%)',
                            boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)',
                        }}
                    >
                        <div className="text-center">
                            {isFlipping ? (
                                <span className="text-4xl">🪙</span>
                            ) : result ? (
                                <>
                                    <span className="text-3xl block">
                                        {result === 'heads' ? '👑' : '🦅'}
                                    </span>
                                    <span className="text-xs font-bold text-amber-900 uppercase mt-1">
                                        {result}
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-amber-900">FLIP</span>
                            )}
                        </div>
                    </div>

                    {/* Coin edge effect */}
                    <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-2 rounded-full bg-amber-600/50 blur-sm"
                    />
                </button>

                {/* Stats */}
                {total > 0 && (
                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">{stats.heads}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Heads</div>
                        </div>
                        <div className="w-px h-8 bg-border" />
                        <div className="text-center">
                            <div className="text-xl font-bold text-foreground">{stats.tails}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">Tails</div>
                        </div>
                    </div>
                )}

                {/* Probability bar */}
                {total > 0 && (
                    <div className="w-full max-w-[160px]">
                        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
                            <div
                                className="bg-yellow-500 transition-all"
                                style={{ width: `${(stats.heads / total) * 100}%` }}
                            />
                            <div
                                className="bg-amber-700 transition-all"
                                style={{ width: `${(stats.tails / total) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                            <span>{total > 0 ? Math.round((stats.heads / total) * 100) : 0}%</span>
                            <span>{total} flips</span>
                            <span>{total > 0 ? Math.round((stats.tails / total) * 100) : 0}%</span>
                        </div>
                    </div>
                )}

                {/* Reset button */}
                {total > 0 && (
                    <button
                        onClick={reset}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <RotateCcw size={10} />
                        Reset
                    </button>
                )}

                {/* Flip animation */}
                <style>{`
                    @keyframes coin-flip {
                        0% { transform: rotateY(0deg) scale(1); }
                        25% { transform: rotateY(360deg) scale(0.8); }
                        50% { transform: rotateY(720deg) scale(1); }
                        75% { transform: rotateY(1080deg) scale(0.8); }
                        100% { transform: rotateY(1440deg) scale(1); }
                    }
                    .animate-coin-flip {
                        animation: coin-flip 1s ease-out;
                    }
                `}</style>
            </div>
        </FlipCardWidget>
    );
};

export default CoinFlipWidget;
