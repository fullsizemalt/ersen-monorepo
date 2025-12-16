import React, { useRef, useEffect } from 'react';

interface CanvasScreensaverProps {
    draw: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => void;
    className?: string;
    fps?: number;
}

const CanvasScreensaver: React.FC<CanvasScreensaverProps> = ({ draw, className, fps = 60 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef(0);
    const requestRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        window.addEventListener('resize', resize);
        resize();

        let lastTime = 0;
        const interval = 1000 / fps;

        const animate = (time: number) => {
            const deltaTime = time - lastTime;

            if (deltaTime > interval) {
                draw(ctx, canvas.width, canvas.height, frameRef.current);
                frameRef.current++;
                lastTime = time - (deltaTime % interval);
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [draw, fps]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full block touch-none ${className || ''}`}
        />
    );
};

export default CanvasScreensaver;
