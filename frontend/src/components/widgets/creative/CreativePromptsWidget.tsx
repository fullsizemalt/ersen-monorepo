import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Pen, Code, Palette, RefreshCw, Copy, Check } from 'lucide-react';

const CATEGORIES = {
    write: {
        icon: Pen,
        label: 'Write',
        prompts: [
            "Describe a color to someone who is blind.",
            "Write a story that ends with the sentence: 'And that's why I'll never eat apples again.'",
            "You find a door in your basement that wasn't there yesterday.",
            "Write about a character who has the power to read minds but can't turn it off.",
            "Describe your favorite smell without naming the source.",
            "Write a letter to your future self 10 years from now.",
            "A world where silence is currency.",
            "The villain isn't evil, just very misunderstood.",
            "You wake up and everyone is gone.",
            "Write a dialogue between two objects in your room."
        ]
    },
    draw: {
        icon: Palette,
        label: 'Draw',
        prompts: [
            "Your workspace from a bug's perspective.",
            "A city floating in the clouds.",
            "Your favorite song as a landscape.",
            "A creature that is half plant, half machine.",
            "The feeling of anxiety personified.",
            "A map of your brain.",
            "Design a flag for a country that doesn't exist.",
            "A self-portrait without using your face.",
            "What happened 5 seconds before disaster.",
            "Draw sound."
        ]
    },
    code: {
        icon: Code,
        label: 'Code',
        prompts: [
            "Build a function that converts Roman numerals to integers.",
            "Create a recursive function to flatten a nested array.",
            "Design a class for a Vending Machine.",
            "Write a script to scrape the top headlines from a news site.",
            "Implement a 'debounce' function from scratch.",
            "Create a React component that recursively renders a file tree.",
            "Write a function to check if a string is a palindrome ignoring spaces.",
            "Implement a simplified version of Redux.",
            "Solve the 'Two Sum' problem in O(n) time.",
            "Create a CLI tool that tells you the weather."
        ]
    }
};

type CategoryKey = keyof typeof CATEGORIES;

const CreativePromptsWidget: React.FC<WidgetProps> = () => {
    const [activeTab, setActiveTab] = useState<CategoryKey>('write');
    const [promptIndex, setPromptIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    // Get random prompt on mount or category change would be better, but simple index is fine
    // Let's create a pseudo-random seed based on day to make it "Daily Prompt"
    // For now, just random is fun.

    const getRandomIndex = () => Math.floor(Math.random() * CATEGORIES[activeTab].prompts.length);

    const handleNewPrompt = () => {
        let newIndex = getRandomIndex();
        while (newIndex === promptIndex) {
            newIndex = getRandomIndex();
        }
        setPromptIndex(newIndex);
        setCopied(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(CATEGORIES[activeTab].prompts[promptIndex]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const CurrentIcon = CATEGORIES[activeTab].icon;

    return (
        <div className="h-full flex flex-col bg-background relative overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border">
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => {
                    const Icon = CATEGORIES[cat].icon;
                    return (
                        <button
                            key={cat}
                            onClick={() => {
                                setActiveTab(cat);
                                setPromptIndex(Math.floor(Math.random() * CATEGORIES[cat].prompts.length));
                            }}
                            className={`flex-1 p-3 flex justify-center items-center gap-2 text-sm transition-colors ${activeTab === cat
                                    ? 'bg-accent/50 text-accent-foreground border-b-2 border-primary'
                                    : 'text-muted-foreground hover:bg-muted/50'
                                }`}
                        >
                            <Icon size={14} />
                            <span className="hidden sm:inline capitalize">{cat}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 p-4 bg-primary/5 rounded-full">
                    <CurrentIcon size={32} className="text-primary opacity-80" />
                </div>

                <p className="text-lg md:text-xl font-medium leading-relaxed mb-6 font-serif">
                    {CATEGORIES[activeTab].prompts[promptIndex]}
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>

                    <button
                        onClick={handleNewPrompt}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors"
                    >
                        <RefreshCw size={14} />
                        New Prompt
                    </button>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
    );
};

export default CreativePromptsWidget;
