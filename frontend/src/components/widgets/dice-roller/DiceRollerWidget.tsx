import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Sparkles } from 'lucide-react';

const DiceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const DiceRollerWidget: React.FC<WidgetProps> = () => {
    const [dice, setDice] = useState<number[]>([6, 6]);
    const [rolling, setRolling] = useState(false);
    const [history, setHistory] = useState<number[]>([]);

    const rollDice = () => {
        if (rolling) return;

        setRolling(true);

        // Animate rolls
        let count = 0;
        const interval = setInterval(() => {
            setDice([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ]);
            count++;
            if (count >= 12) {
                clearInterval(interval);
                const final = [
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1
                ];
                setDice(final);
                setHistory(prev => [final[0] + final[1], ...prev].slice(0, 5));
                setRolling(false);
            }
        }, 60);
    };

    const total = dice[0] + dice[1];
    const isDoubles = dice[0] === dice[1];

    return (
        <FlipCardWidget title="Dice Roller">
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Dice Display */}
                <div className="flex gap-4">
                    {dice.map((value, i) => {
                        const DiceIcon = DiceIcons[value - 1];
                        return (
                            <div
                                key={i}
                                className={`relative p-4 bg-gradient-to-br from-secondary to-muted rounded-2xl shadow-lg transition-all ${rolling
                                        ? 'animate-bounce scale-90'
                                        : 'hover:scale-105'
                                    } ${isDoubles && !rolling ? 'ring-2 ring-primary/50' : ''}`}
                                style={{
                                    animationDelay: `${i * 50}ms`,
                                    transform: rolling ? `rotate(${Math.random() * 20 - 10}deg)` : 'none'
                                }}
                            >
                                <DiceIcon size={40} className={`text-foreground transition-colors ${isDoubles && !rolling ? 'text-primary' : ''
                                    }`} />
                            </div>
                        );
                    })}
                </div>

                {/* Total Display */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <span className={`text-4xl font-bold tabular-nums transition-all ${rolling ? 'text-muted-foreground blur-sm' : 'text-foreground'
                            }`}>
                            {total}
                        </span>
                        {isDoubles && !rolling && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full animate-scale-in">
                                <Sparkles size={12} />
                                Doubles!
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                        {dice[0]} + {dice[1]}
                    </span>
                </div>

                {/* Roll Button */}
                <button
                    onClick={rollDice}
                    disabled={rolling}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${rolling
                            ? 'bg-muted text-muted-foreground cursor-wait'
                            : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95'
                        }`}
                >
                    {rolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
                </button>

                {/* History */}
                {history.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-muted-foreground">Recent:</span>
                        {history.map((h, i) => (
                            <span
                                key={i}
                                className={`w-5 h-5 flex items-center justify-center text-[10px] font-mono rounded-md ${i === 0
                                        ? 'bg-primary/10 text-primary font-bold'
                                        : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default DiceRollerWidget;
