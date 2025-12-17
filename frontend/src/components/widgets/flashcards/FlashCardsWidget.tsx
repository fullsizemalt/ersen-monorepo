import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import './FlashCardsWidget.css'; // We'll need a tiny bit of CSS for the flip

interface FlashCard {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const DEMO_CARDS: FlashCard[] = [
    { id: 1, category: 'React', question: 'What is the Virtual DOM?', answer: 'A lightweight copy of the real DOM that React uses to optimize updates.' },
    { id: 2, category: 'React', question: 'What is a Hook?', answer: 'A special function that lets you "hook into" React features like state and lifecycle methods.' },
    { id: 3, category: 'JS', question: 'Difference between let and var?', answer: 'Var is function-scoped, Let is block-scoped. Let does not hoist in the same way.' },
    { id: 4, category: 'CSS', question: 'What does "box-sizing: border-box" do?', answer: 'It includes padding and border in the element\'s total width and height.' },
    { id: 5, category: 'Web', question: 'What is CORS?', answer: 'Cross-Origin Resource Sharing. A mechanism that allows restricted resources on a web page to be requested from another domain.' }
];

const FlashCardsWidget: React.FC<WidgetProps> = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [finished, setFinished] = useState(false);

    const activeCard = DEMO_CARDS[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            if (currentIndex < DEMO_CARDS.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                setFinished(true);
            }
        }, 150); // Wait for flip back
    };

    const handleRestart = () => {
        setFinished(false);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    if (finished) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-background">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Session Complete!</h3>
                <p className="text-muted-foreground mb-6">You've reviewed all cards in this deck.</p>
                <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                    <RotateCcw size={16} />
                    Start Over
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 bg-background relative perspective-1000">
            {/* Progress */}
            <div className="flex justify-between text-xs text-muted-foreground mb-4 uppercase tracking-wider font-semibold">
                <span>{activeCard.category}</span>
                <span>{currentIndex + 1} / {DEMO_CARDS.length}</span>
            </div>

            {/* Card Container */}
            <div
                className="flex-1 relative cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ perspective: '1000px' }}
            >
                <div
                    className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-card border border-border rounded-xl p-6 flex items-center justify-center text-center shadow-sm group-hover:shadow-md transition-shadow">
                        <p className="text-lg font-medium">{activeCard.question}</p>
                        <span className="absolute bottom-4 text-xs text-muted-foreground">Tap to flip</span>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/20 rounded-xl p-6 flex items-center justify-center text-center rotate-y-180"
                        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                    >
                        <p className="text-lg text-foreground">{activeCard.answer}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={`mt-4 grid grid-cols-3 gap-2 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button onClick={handleNext} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 text-xs font-medium">Hard</button>
                <button onClick={handleNext} className="p-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-medium">Good</button>
                <button onClick={handleNext} className="p-2 rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium">Easy</button>
            </div>
        </div>
    );
};

export default FlashCardsWidget;
