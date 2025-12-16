import React, { useRef, useEffect, useState, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Play, RotateCcw } from 'lucide-react';

const CANVAS_SIZE = 300; // Fixed size/ratio
const GRID_SIZE = 15;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;

const SnakeWidget: React.FC<WidgetProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Game State Refs (to avoid stale closures in interval)
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const dirRef = useRef({ x: 0, y: 0 });
    const nextDirRef = useRef({ x: 0, y: 0 }); // Buffer next direction to prevent rapid reverse
    const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Focus handling to only capture keys when active
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const spawnFood = () => {
        foodRef.current = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    };

    const startGame = () => {
        snakeRef.current = [{ x: 10, y: 10 }];
        dirRef.current = { x: 1, y: 0 }; // Start moving right
        nextDirRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        spawnFood();

        // Focus the container so we can receive key events immedaitely
        if (containerRef.current) containerRef.current.focus();
    };

    const stopGame = () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        setIsPlaying(false);
    };

    const handleGameOver = () => {
        stopGame();
        setGameOver(true);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('ersen_snake_highscore', score.toString());
        }
    };

    const update = useCallback(() => {
        if (!isPlaying || gameOver) return;

        // Apply buffered direction
        dirRef.current = nextDirRef.current;
        const head = { x: snakeRef.current[0].x + dirRef.current.x, y: snakeRef.current[0].y + dirRef.current.y };

        // Wall Collision
        if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
            handleGameOver();
            return;
        }

        // Self Collision
        for (let part of snakeRef.current) {
            if (part.x === head.x && part.y === head.y) {
                handleGameOver();
                return;
            }
        }

        // Move Snake
        const newSnake = [head, ...snakeRef.current];

        // Eat Food
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(s => s + 1);
            spawnFood();
            // Don't pop tail, so it grows
        } else {
            newSnake.pop(); // Remove tail
        }

        snakeRef.current = newSnake;
        draw();
    }, [isPlaying, gameOver, score]);

    useEffect(() => {
        if (isPlaying) {
            gameLoopRef.current = setInterval(update, 100); // 10 FPS
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [isPlaying, update]);

    const draw = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.fillStyle = '#18181b'; // zinc-950
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw Food
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.beginPath();
        ctx.arc((foodRef.current.x * GRID_SIZE) + GRID_SIZE / 2, (foodRef.current.y * GRID_SIZE) + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw Snake
        ctx.fillStyle = '#22c55e'; // green-500
        snakeRef.current.forEach((part, i) => {
            // Head is slightly different color
            if (i === 0) ctx.fillStyle = '#86efac'; // green-300
            else ctx.fillStyle = '#22c55e';

            ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
        });
    };

    // Keep score updated even if not triggering React render every frame
    useEffect(() => {
        if (!isPlaying && !gameOver) {
            draw();
            // Load high score
            const saved = localStorage.getItem('ersen_snake_highscore');
            if (saved) setHighScore(parseInt(saved));
        }
    }, [isPlaying, gameOver]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isPlaying) return;

        switch (e.key) {
            case 'ArrowUp':
                if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case 'ArrowLeft':
                if (dirRef.current.x === 0) nextDirRef.current = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case 'ArrowRight':
                if (dirRef.current.x === 0) nextDirRef.current = { x: 1, y: 0 };
                e.preventDefault();
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className="h-full flex flex-col items-center justify-center bg-zinc-900 border-none outline-none relative overflow-visible"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { setIsFocused(false); if (isPlaying) stopGame(); }}
        >
            <div className="absolute top-2 left-4 text-xs font-mono text-zinc-500">
                HI: {highScore}
            </div>
            <div className="absolute top-2 right-4 text-xs font-mono text-emerald-500 font-bold">
                SCORE: {score}
            </div>

            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="bg-black border border-zinc-800 rounded-sm shadow-2xl"
                style={{ width: '80%', height: 'auto', maxWidth: '300px', aspectRatio: '1/1' }}
            />

            {!isPlaying && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <button
                        onClick={startGame}
                        className="flex flex-col items-center gap-2 text-white hover:text-emerald-400 transition-colors"
                    >
                        <Play size={48} />
                        <span className="text-xs uppercase tracking-widest">Click to Play</span>
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10 text-white">
                    <h3 className="text-2xl font-bold mb-2 text-red-500">GAME OVER</h3>
                    <p className="mb-6 font-mono">Score: {score}</p>
                    <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors"
                    >
                        <RotateCcw size={16} />
                        Try Again
                    </button>
                </div>
            )}

            {/* Control hints */}
            {isPlaying && isFocused && (
                <div className="absolute bottom-2 text-[10px] text-zinc-600 font-mono">
                    Use Arrow Keys
                </div>
            )}
            {isPlaying && !isFocused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs font-mono uppercase tracking-widest backdrop-blur-[1px]">
                    Paused (Click to Resume)
                </div>
            )}
        </div>
    );
};

export default SnakeWidget;
