import React, { useState, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { RotateCcw, Trophy } from 'lucide-react';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[];

const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
];

const TicTacToeWidget: React.FC<WidgetProps> = () => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const checkWinner = useCallback((newBoard: Board): Player | 'draw' | null => {
        for (const line of WINNING_LINES) {
            const [a, b, c] = line;
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                setWinningLine(line);
                return newBoard[a] as Player;
            }
        }
        if (newBoard.every(cell => cell !== null)) {
            return 'draw';
        }
        return null;
    }, []);

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result);
            if (result === 'draw') {
                setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
            } else {
                setScores(prev => ({ ...prev, [result]: prev[result] + 1 }));
            }
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setWinningLine(null);
    };

    const resetAll = () => {
        resetGame();
        setScores({ X: 0, O: 0, draws: 0 });
    };

    return (
        <FlipCardWidget title="Tic Tac Toe">
            <div className="flex flex-col items-center justify-center h-full gap-3">
                {/* Score */}
                <div className="flex items-center gap-4 text-sm">
                    <div className={`text-center px-3 py-1 rounded-lg ${currentPlayer === 'X' && !winner ? 'bg-blue-500/10 ring-1 ring-blue-500/30' : ''}`}>
                        <div className="text-lg font-bold text-blue-500">X</div>
                        <div className="text-xs text-muted-foreground">{scores.X}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-muted-foreground">Draws</div>
                        <div className="text-sm font-medium text-foreground">{scores.draws}</div>
                    </div>
                    <div className={`text-center px-3 py-1 rounded-lg ${currentPlayer === 'O' && !winner ? 'bg-red-500/10 ring-1 ring-red-500/30' : ''}`}>
                        <div className="text-lg font-bold text-red-500">O</div>
                        <div className="text-xs text-muted-foreground">{scores.O}</div>
                    </div>
                </div>

                {/* Board */}
                <div className="grid grid-cols-3 gap-1.5 p-2 bg-secondary/50 rounded-xl">
                    {board.map((cell, index) => {
                        const isWinningCell = winningLine?.includes(index);
                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(index)}
                                disabled={!!cell || !!winner}
                                className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${cell
                                        ? 'bg-background'
                                        : 'bg-background hover:bg-muted cursor-pointer'
                                    } ${isWinningCell ? 'ring-2 ring-green-500 bg-green-500/10' : ''}`}
                            >
                                {cell && (
                                    <span className={`${cell === 'X' ? 'text-blue-500' : 'text-red-500'
                                        } ${isWinningCell ? 'animate-pulse' : ''}`}>
                                        {cell}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Status / Controls */}
                {winner ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                            {winner === 'draw' ? (
                                <span className="text-muted-foreground font-medium">It's a draw!</span>
                            ) : (
                                <>
                                    <Trophy size={16} className="text-yellow-500" />
                                    <span className={`font-bold ${winner === 'X' ? 'text-blue-500' : 'text-red-500'}`}>
                                        {winner} wins!
                                    </span>
                                </>
                            )}
                        </div>
                        <button
                            onClick={resetGame}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <RotateCcw size={12} />
                            Play Again
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`w-4 h-4 rounded flex items-center justify-center font-bold ${currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500'
                            }`}>
                            {currentPlayer}
                        </span>
                        <span>to move</span>
                    </div>
                )}

                {/* Reset all */}
                {(scores.X > 0 || scores.O > 0 || scores.draws > 0) && (
                    <button
                        onClick={resetAll}
                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Reset scores
                    </button>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default TicTacToeWidget;
