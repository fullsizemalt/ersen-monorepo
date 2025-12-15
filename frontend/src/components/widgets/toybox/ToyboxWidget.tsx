import React, { useState, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    velocity: { x: number; y: number };
}

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1',
    '#DDA0DD', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const ToyboxWidget: React.FC<WidgetProps> = () => {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [clickCount, setClickCount] = useState(0);

    const createParticles = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: 6 + Math.random() * 8,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8,
            },
        }));

        setParticles(prev => [...prev, ...newParticles]);
        setClickCount(prev => prev + 1);

        // Cleanup particles after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1000);
    }, []);

    const clearAll = () => {
        setParticles([]);
        setClickCount(0);
    };

    return (
        <FlipCardWidget title="Toybox">
            <div className="flex flex-col h-full">
                {/* Interactive area */}
                <div
                    className="flex-1 relative overflow-hidden cursor-crosshair rounded-xl bg-gradient-to-br from-secondary/30 to-muted/30 border border-border/50"
                    onClick={createParticles}
                    onTouchStart={createParticles}
                >
                    {/* Particles */}
                    {particles.map(p => (
                        <div
                            key={p.id}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                left: p.x - p.size / 2,
                                top: p.y - p.size / 2,
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                boxShadow: `0 0 ${p.size}px ${p.color}`,
                                animation: 'particle-burst 1s ease-out forwards',
                                '--tx': `${p.velocity.x * 20}px`,
                                '--ty': `${p.velocity.y * 20}px`,
                            } as React.CSSProperties}
                        />
                    ))}

                    {/* Center prompt */}
                    {particles.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-pulse">
                            <Sparkles className="w-8 h-8 text-primary/30 mb-2" />
                            <span className="text-xs text-muted-foreground">
                                Tap or click anywhere!
                            </span>
                        </div>
                    )}

                    {/* Counter badge */}
                    {clickCount > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                            {clickCount} 🎉
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-muted-foreground">
                        {particles.length > 0 ? `${particles.length} particles` : 'Click to play'}
                    </span>
                    {clickCount > 0 && (
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <RotateCcw size={10} />
                            Reset
                        </button>
                    )}
                </div>

                {/* Keyframe animation for particles */}
                <style>{`
                    @keyframes particle-burst {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: 1;
                        }
                        100% {
                            transform: translate(var(--tx), var(--ty)) scale(0);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>
        </FlipCardWidget>
    );
};

export default ToyboxWidget;
