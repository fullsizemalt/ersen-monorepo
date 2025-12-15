import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Quote as QuoteIcon, RefreshCw, Heart, Copy, Check } from 'lucide-react';

interface QuoteData {
    text: string;
    author: string;
}

// Fallback quotes when API is unavailable
const FALLBACK_QUOTES: QuoteData[] = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
    { text: "Code is poetry.", author: "WordPress" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
    { text: "It's not a bug, it's an undocumented feature.", author: "Anonymous" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "Any fool can write code that a computer can understand.", author: "Martin Fowler" },
];

const QuoteWidget: React.FC<WidgetProps> = ({ config }) => {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);

    const category = config.category || ''; // empty = random

    const fetchQuote = useCallback(async () => {
        setLoading(true);
        setCopied(false);
        setLiked(false);

        try {
            // Use quotable.io - free, no API key required
            const categoryParam = category ? `?tags=${encodeURIComponent(category)}` : '';
            const response = await fetch(`https://api.quotable.io/random${categoryParam}`);

            if (!response.ok) {
                throw new Error('Quote service unavailable');
            }

            const data = await response.json();
            setQuote({
                text: data.content,
                author: data.author,
            });
        } catch (err) {
            console.error('Quote fetch error:', err);
            // Use fallback quote
            const randomQuote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
            setQuote(randomQuote);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        // Fetch initial quote
        fetchQuote();

        // Refresh quote every hour
        const interval = setInterval(fetchQuote, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchQuote]);

    const handleCopy = async () => {
        if (quote) {
            try {
                await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleNewQuote = () => {
        fetchQuote();
    };

    if (!quote) {
        return (
            <WidgetWrapper title="Inspiration">
                <div className="h-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
                </div>
            </WidgetWrapper>
        );
    }

    return (
        <WidgetWrapper title="Inspiration" onRetry={handleNewQuote}>
            <div className="flex flex-col h-full justify-center relative">
                {/* Decorative Quote Icon */}
                <QuoteIcon className="absolute top-0 left-0 text-black/[0.05] dark:text-white/[0.03] w-16 h-16 -translate-x-2 -translate-y-2" />

                {/* Quote Text */}
                <p className="text-base font-serif text-zinc-900 dark:text-zinc-200 italic text-center relative z-10 leading-relaxed px-4">
                    "{quote.text}"
                </p>

                {/* Author */}
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 text-center mt-4 font-medium uppercase tracking-widest">
                    — {quote.author}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => setLiked(!liked)}
                        className={`p-1.5 rounded-full transition-all ${liked
                            ? 'text-red-400 bg-red-400/10'
                            : 'text-zinc-400 hover:text-zinc-600 hover:bg-black/5 dark:text-zinc-600 dark:hover:text-zinc-400 dark:hover:bg-white/5'
                            }`}
                        title="Like"
                    >
                        <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                    </button>

                    <button
                        onClick={handleCopy}
                        className={`p-1.5 rounded-full transition-all ${copied
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-zinc-400 hover:text-zinc-600 hover:bg-black/5 dark:text-zinc-600 dark:hover:text-zinc-400 dark:hover:bg-white/5'
                            }`}
                        title="Copy"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <button
                        onClick={handleNewQuote}
                        disabled={loading}
                        className={`p-1.5 rounded-full transition-all text-zinc-400 hover:text-zinc-600 hover:bg-black/5 dark:text-zinc-600 dark:hover:text-zinc-400 dark:hover:bg-white/5 ${loading ? 'animate-spin' : ''
                            }`}
                        title="New Quote"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>
            </div>
        </WidgetWrapper>
    );
};

export default QuoteWidget;
