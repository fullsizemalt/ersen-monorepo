import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';
import PremiumGate from '../../premium/PremiumGate';

type MoodRating = 1 | 2 | 3 | 4 | 5;

interface MoodLog {
    date: string; // ISO String
    rating: MoodRating;
    note?: string;
}

const MOODS: { rating: MoodRating; emoji: string; label: string; color: string }[] = [
    { rating: 1, emoji: '😫', label: 'Awful', color: '#ef4444' }, // Red-500
    { rating: 2, emoji: '😕', label: 'Bad', color: '#f97316' },   // Orange-500
    { rating: 3, emoji: '😐', label: 'Okay', color: '#eab308' },   // Yellow-500
    { rating: 4, emoji: '🙂', label: 'Good', color: '#22c55e' },   // Green-500
    { rating: 5, emoji: '🤩', label: 'Great', color: '#3b82f6' },  // Blue-500
];

const MoodTrackerWidget: React.FC<WidgetProps> = () => {
    const [history, setHistory] = useState<MoodLog[]>([]);
    const [todayMood, setTodayMood] = useState<MoodRating | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('ersen_mood_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setHistory(parsed);

                // Check if already logged today
                const today = new Date().toISOString().split('T')[0];
                const found = parsed.find((entry: MoodLog) => entry.date.startsWith(today));
                if (found) setTodayMood(found.rating);

            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const logMood = (rating: MoodRating) => {
        const now = new Date().toISOString();
        const todayKey = now.split('T')[0];

        // Remove existing entry for today if any
        const newHistory = history.filter(h => !h.date.startsWith(todayKey));

        newHistory.push({ date: now, rating });

        // Sort by date
        newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setHistory(newHistory);
        setTodayMood(rating);
        localStorage.setItem('ersen_mood_history', JSON.stringify(newHistory));
    };

    // Prepare chart data (last 7 days)
    const chartData = history.slice(-7).map(entry => ({
        day: new Date(entry.date).toLocaleDateString(undefined, { weekday: 'narrow' }),
        rating: entry.rating,
        fullDate: new Date(entry.date).toLocaleDateString()
    }));

    return (
        <PremiumGate featureName="Mood Tracker">
            <div className="h-full flex flex-col p-4 bg-background">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">How are you?</h3>
                </div>

                {/* Mood Selector - only if not logged today (or allows Overwrite) */}
                <div className="flex justify-between mb-6">
                    {MOODS.map((m) => (
                        <button
                            key={m.rating}
                            onClick={() => logMood(m.rating)}
                            className={`flex flex-col items-center gap-1 transition-all ${todayMood === m.rating
                                    ? 'scale-110 opacity-100'
                                    : todayMood
                                        ? 'opacity-30 scale-90 grayscale'
                                        : 'opacity-70 hover:opacity-100 hover:scale-110'
                                }`}
                        >
                            <span className="text-2xl filter drop-shadow-sm">{m.emoji}</span>
                        </button>
                    ))}
                </div>

                {/* Mini Chart */}
                <div className="flex-1 min-h-0 w-full mt-auto">
                    {history.length > 1 ? (
                        <div className="w-full h-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis
                                        dataKey="day"
                                        stroke="#888888"
                                        tickLine={false}
                                        axisLine={false}
                                        fontSize={10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', fontSize: '12px' }}
                                        labelStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rating"
                                        stroke="var(--primary)"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: 'var(--background)' }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                            Log more days to see trends
                        </div>
                    )}
                </div>
            </div>
        </PremiumGate>
    );
};

export default MoodTrackerWidget;
