import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Bomb, Flag, Smile, Frown } from 'lucide-react';

const ROWS = 8;
const COLS = 8;
const MINES = 10;

type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMines: number;
};

const MinesweeperWidget: React.FC<WidgetProps> = () => {
    const [grid, setGrid] = useState<CellState[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);
    const [mineCount, setMineCount] = useState(MINES);

    const initGame = () => {
        // Create empty grid
        const newGrid: CellState[][] = Array(ROWS).fill(null).map(() =>
            Array(COLS).fill(null).map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            }))
        );

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < MINES) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if (!newGrid[r][c].isMine) {
                newGrid[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (!newGrid[r][c].isMine) {
                    let neighbors = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                                if (newGrid[r + i][c + j].isMine) neighbors++;
                            }
                        }
                    }
                    newGrid[r][c].neighborMines = neighbors;
                }
            }
        }

        setGrid(newGrid);
        setGameOver(false);
        setWin(false);
        setMineCount(MINES);
    };

    useEffect(() => {
        initGame();
    }, []);

    const revealCell = (r: number, c: number) => {
        if (gameOver || win || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

        const newGrid = [...grid];

        if (newGrid[r][c].isMine) {
            // BOOM
            newGrid[r][c].isRevealed = true;
            revealAllMines(newGrid);
            setGrid(newGrid);
            setGameOver(true);
            return;
        }

        // Flood fill if 0 neighbors
        const flood = (row: number, col: number) => {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS || newGrid[row][col].isRevealed || newGrid[row][col].isMine) return;

            newGrid[row][col].isRevealed = true;

            if (newGrid[row][col].neighborMines === 0) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        flood(row + i, col + j);
                    }
                }
            }
        };

        flood(r, c);
        setGrid(newGrid);
        checkWin(newGrid);
    };

    const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
        e.preventDefault();
        if (gameOver || win || grid[r][c].isRevealed) return;

        const newGrid = [...grid];
        newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
        setGrid(newGrid);
        setMineCount(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
    };

    const revealAllMines = (currentGrid: CellState[][]) => {
        currentGrid.forEach(row => row.forEach(cell => {
            if (cell.isMine) cell.isRevealed = true;
        }));
    };

    const checkWin = (currentGrid: CellState[][]) => {
        let unrevealedSafeCells = 0;
        currentGrid.forEach(row => row.forEach(cell => {
            if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
        }));

        if (unrevealedSafeCells === 0) {
            setWin(true);
            setGameOver(true); // Stop play
        }
    };

    const getCellColor = (count: number) => {
        switch (count) {
            case 1: return 'text-blue-500';
            case 2: return 'text-green-500';
            case 3: return 'text-red-500';
            case 4: return 'text-purple-800';
            default: return 'text-zinc-800';
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#c0c0c0] p-1 border-2 border-white border-r-gray-500 border-b-gray-500 select-none">
            {/* Header */}
            <div className="h-10 flex justify-between items-center px-2 bg-[#c0c0c0] border-2 border-gray-500 border-r-white border-b-white mb-1">
                <div className="bg-black text-red-500 font-mono text-xl px-1 border border-gray-500">
                    {Math.max(0, mineCount).toString().padStart(3, '0')}
                </div>

                <button
                    onClick={initGame}
                    className="w-8 h-8 flex items-center justify-center border-2 border-white border-r-gray-500 border-b-gray-500 active:border-gray-500 active:border-r-white active:border-b-white bg-[#c0c0c0]"
                >
                    {gameOver ? (win ? <Smile size={20} className="fill-yellow-400" /> : <Frown size={20} />) : <Smile size={20} className="text-yellow-600" />}
                </button>

                <div className="bg-black text-red-500 font-mono text-xl px-1 border border-gray-500">
                    000
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 flex flex-col justify-center items-center bg-[#808080] border-2 border-gray-500 border-r-white border-b-white p-1">
                {grid.map((row, r) => (
                    <div key={r} className="flex">
                        {row.map((cell, c) => (
                            <div
                                key={`${r}-${c}`}
                                onClick={() => revealCell(r, c)}
                                onContextMenu={(e) => toggleFlag(e, r, c)}
                                className={`w-6 h-6 flex items-center justify-center text-sm font-bold cursor-default
                                    ${cell.isRevealed
                                        ? 'bg-[#c0c0c0] border border-gray-400'
                                        : 'bg-[#c0c0c0] border-2 border-white border-r-gray-500 border-b-gray-500 hover:opacity-90 active:border-gray-500 active:border-r-white active:border-b-white'
                                    }
                                    ${gameOver && cell.isMine && 'bg-red-500/50'}
                                `}
                            >
                                {cell.isRevealed && cell.isMine && <Bomb size={14} />}
                                {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                                    <span className={getCellColor(cell.neighborMines)}>{cell.neighborMines}</span>
                                )}
                                {!cell.isRevealed && cell.isFlagged && <Flag size={14} className="text-red-600 fill-red-600" />}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MinesweeperWidget;
