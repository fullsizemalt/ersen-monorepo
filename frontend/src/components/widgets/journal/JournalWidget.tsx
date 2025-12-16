import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import { ChevronLeft, ChevronRight, Save, Calendar as CalIcon } from 'lucide-react';
import clsx from 'clsx';
import PremiumGate from '../../premium/PremiumGate';

const JournalWidget: React.FC<WidgetProps> = () => {
    // State for current viewing date
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for journal entries: { "YYYY-MM-DD": "content" }
    const [entries, setEntries] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Format date key YYYY-MM-DD
    const getDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const dateKey = getDateKey(currentDate);
    const content = entries[dateKey] || '';

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('ersen_journal_entries');
        if (saved) {
            try {
                setEntries(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load journal entries', e);
            }
        }
    }, []);

    // Save to localStorage when entries change (debounced via effect + isSaving check logic could go here, 
    // but simple save on edit is fine for MVP if careful)
    const saveEntry = (newContent: string) => {
        const newEntries = {
            ...entries,
            [dateKey]: newContent
        };
        setEntries(newEntries);
        setIsSaving(true);
        localStorage.setItem('ersen_journal_entries', JSON.stringify(newEntries));

        // Fake saving indicator
        setTimeout(() => setIsSaving(false), 500);
    };

    const navigateDate = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const resetToToday = () => setCurrentDate(new Date());

    return (
        <PremiumGate featureName="Journal">
            <div className="h-full flex flex-col bg-[#fcfaf9] dark:bg-[#1a1a1a] text-zinc-800 dark:text-zinc-200">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateDate(-1)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            onClick={resetToToday}
                            className="text-sm font-medium hover:underline decoration-zinc-400 underline-offset-4 font-serif"
                        >
                            {currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </button>

                        <button
                            onClick={() => navigateDate(1)}
                            className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500"
                            disabled={getDateKey(currentDate) === getDateKey(new Date())}
                        >
                            <ChevronRight size={16} className={clsx(getDateKey(currentDate) === getDateKey(new Date()) && "opacity-30")} />
                        </button>
                    </div>

                    <div className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                        {isSaving ? (
                            <span className="text-emerald-500 animate-pulse">Saving...</span>
                        ) : (
                            <Save size={12} />
                        )}
                    </div>
                </div>

                {/* Editor Area */}
                <textarea
                    value={content}
                    onChange={(e) => saveEntry(e.target.value)}
                    placeholder="Write your thoughts..."
                    className="flex-1 w-full resize-none p-4 bg-transparent outline-none font-serif text-base leading-relaxed placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    spellCheck={false}
                />
            </div>
        </PremiumGate>
    );
};

export default JournalWidget;
