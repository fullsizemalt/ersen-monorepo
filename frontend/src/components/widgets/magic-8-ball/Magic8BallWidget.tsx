import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';

const ANSWERS = [
    // Positive
    { text: 'It is certain', type: 'positive' },
    { text: 'It is decidedly so', type: 'positive' },
    { text: 'Without a doubt', type: 'positive' },
    { text: 'Yes definitely', type: 'positive' },
    { text: 'You may rely on it', type: 'positive' },
    { text: 'As I see it, yes', type: 'positive' },
    { text: 'Most likely', type: 'positive' },
    { text: 'Outlook good', type: 'positive' },
    { text: 'Yes', type: 'positive' },
    { text: 'Signs point to yes', type: 'positive' },
    // Neutral
    { text: 'Reply hazy, try again', type: 'neutral' },
    { text: 'Ask again later', type: 'neutral' },
    { text: 'Better not tell you now', type: 'neutral' },
    { text: 'Cannot predict now', type: 'neutral' },
    { text: 'Concentrate and ask again', type: 'neutral' },
    // Negative
    { text: "Don't count on it", type: 'negative' },
    { text: 'My reply is no', type: 'negative' },
    { text: 'My sources say no', type: 'negative' },
    { text: 'Outlook not so good', type: 'negative' },
    { text: 'Very doubtful', type: 'negative' },
];

const Magic8BallWidget: React.FC<WidgetProps> = () => {
    const [answer, setAnswer] = useState<typeof ANSWERS[0] | null>(null);
    const [isShaking, setIsShaking] = useState(false);
    const [question, setQuestion] = useState('');

    const shake = () => {
        if (isShaking) return;

        setIsShaking(true);
        setAnswer(null);

        setTimeout(() => {
            const randomAnswer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
            setAnswer(randomAnswer);
            setIsShaking(false);
        }, 1500);
    };

    const getAnswerColor = (type: string) => {
        switch (type) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    return (
        <FlipCardWidget title="Magic 8 Ball">
            <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* 8 Ball */}
                <div
                    onClick={shake}
                    className={`relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-black cursor-pointer transition-all shadow-2xl ${isShaking ? 'animate-shake' : 'hover:scale-105'
                        }`}
                >
                    {/* Inner circle (answer window) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-indigo-950 flex items-center justify-center shadow-inner">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-950 to-indigo-950 flex items-center justify-center p-2">
                            {isShaking ? (
                                <span className="text-blue-300/50 text-3xl animate-pulse">?</span>
                            ) : answer ? (
                                <span className={`text-[9px] font-medium text-center leading-tight ${getAnswerColor(answer.type)}`}>
                                    {answer.text}
                                </span>
                            ) : (
                                <span className="text-3xl font-bold text-white">8</span>
                            )}
                        </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute top-2 left-6 w-8 h-8 rounded-full bg-white/10 blur-sm" />
                </div>

                {/* Question input */}
                <div className="w-full max-w-[200px]">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a yes/no question..."
                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-xs text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        onKeyDown={(e) => e.key === 'Enter' && shake()}
                    />
                </div>

                {/* Instruction */}
                <p className="text-[10px] text-muted-foreground text-center">
                    {isShaking ? '🔮 Consulting the spirits...' : 'Click the ball or press Enter'}
                </p>

                {/* Shake animation keyframes */}
                <style>{`
                    @keyframes shake {
                        0%, 100% { transform: translateX(0) rotate(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-3deg); }
                        20%, 40%, 60%, 80% { transform: translateX(5px) rotate(3deg); }
                    }
                    .animate-shake {
                        animation: shake 0.5s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </FlipCardWidget>
    );
};

export default Magic8BallWidget;
