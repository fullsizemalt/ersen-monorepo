import React, { useState, useMemo } from 'react';
import { WidgetProps } from '../../../types/widget';
import CanvasScreensaver from '../../common/CanvasScreensaver';

type EffectType = 'dvd' | 'starfield' | 'matrix';

const ScreensaverWidget: React.FC<WidgetProps> = () => {
    const [effect, setEffect] = useState<EffectType>('dvd');
    const [showControls, setShowControls] = useState(false);

    // DVD Logic
    const dvdState = useMemo(() => ({ x: 50, y: 50, dx: 3, dy: 3, color: '#f0f' }), []);

    // Starfield Logic
    const stars = useMemo(() => Array.from({ length: 100 }, () => ({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * 2000
    })), []);

    // Matrix Logic
    const drops = useMemo(() => new Array(100).fill(1).map(() => Math.random() * -100), []);

    const draw = (ctx: CanvasRenderingContext2D, width: number, height: number, _frame: number) => {
        // Clear background based on effect
        ctx.fillStyle = effect === 'matrix' ? 'rgba(0, 0, 0, 0.05)' : 'black';
        ctx.fillRect(0, 0, width, height);

        if (effect === 'dvd') {
            const logoWidth = 60;
            const logoHeight = 30;

            dvdState.x += dvdState.dx;
            dvdState.y += dvdState.dy;

            if (dvdState.x + logoWidth > width || dvdState.x < 0) {
                dvdState.dx = -dvdState.dx;
                dvdState.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            }
            if (dvdState.y + logoHeight > height || dvdState.y < 0) {
                dvdState.dy = -dvdState.dy;
                dvdState.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            }

            ctx.fillStyle = dvdState.color;
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText('DVD', dvdState.x, dvdState.y + 20);
            ctx.fillRect(dvdState.x, dvdState.y + 24, logoWidth, 4);
        } else if (effect === 'starfield') {
            const speed = 5;
            const cx = width / 2;
            const cy = height / 2;

            ctx.fillStyle = 'white';

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.x = Math.random() * 2000 - 1000;
                    star.y = Math.random() * 2000 - 1000;
                    star.z = 2000;
                }

                const x = (star.x - cx) * (600 / star.z);
                const y = (star.y - cy) * (600 / star.z);
                const s = (1 - star.z / 2000) * 3;

                ctx.beginPath();
                ctx.arc(cx + x, cy + y, s, 0, Math.PI * 2);
                ctx.fill();
            });
        } else if (effect === 'matrix') {
            ctx.fillStyle = '#0F0';
            ctx.font = '14px monospace';

            const fontSize = 14;
            const columns = Math.ceil(width / fontSize);

            // Expand drops array if resize happens
            if (drops.length < columns) {
                const newDrops = new Array(columns - drops.length).fill(1).map(() => Math.random() * -100);
                drops.push(...newDrops);
            }

            for (let i = 0; i < columns; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 33);
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
    };

    return (
        <div
            className="h-full w-full relative group bg-black"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <CanvasScreensaver draw={draw} />

            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={() => setEffect('dvd')}
                    className={`text-xs font-mono uppercase px-2 py-1 rounded ${effect === 'dvd' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    DVD
                </button>
                <button
                    onClick={() => setEffect('starfield')}
                    className={`text-xs font-mono uppercase px-2 py-1 rounded ${effect === 'starfield' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    Stars
                </button>
                <button
                    onClick={() => setEffect('matrix')}
                    className={`text-xs font-mono uppercase px-2 py-1 rounded ${effect === 'matrix' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                    Matrix
                </button>
            </div>
        </div>
    );
};

export default ScreensaverWidget;
