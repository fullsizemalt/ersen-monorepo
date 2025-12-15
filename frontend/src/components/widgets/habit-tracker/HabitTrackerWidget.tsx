import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Check } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    streak: number;
    completedToday: boolean;
}

const HabitTrackerWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [habits, setHabits] = useState<Habit[]>(config.habits || [
        { id: '1', name: 'Drink Water', streak: 5, completedToday: false },
        { id: '2', name: 'Exercise', streak: 2, completedToday: true },
        { id: '3', name: 'Read', streak: 12, completedToday: false },
    ]);

    const toggleHabit = (id: string) => {
        const newHabits = habits.map(h => {
            if (h.id === id) {
                return {
                    ...h,
                    completedToday: !h.completedToday,
                    streak: !h.completedToday ? h.streak + 1 : h.streak - 1
                };
            }
            return h;
        });
        setHabits(newHabits);
        onConfigChange({ ...config, habits: newHabits });
    };

    return (
        <WidgetWrapper title="Habits">
            <div className="flex flex-col gap-2 h-full overflow-y-auto custom-scrollbar pr-1">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => toggleHabit(habit.id)}
                    >
                        <div className="flex flex-col">
                            <span className={`text-sm font-medium ${habit.completedToday ? 'text-gray-400 line-through' : 'text-white'}`}>
                                {habit.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                {habit.streak} day streak
                            </span>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${habit.completedToday
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-600 text-transparent hover:border-gray-400'
                            }`}>
                            <Check size={14} strokeWidth={3} />
                        </div>
                    </div>
                ))}
            </div>
        </WidgetWrapper>
    );
};

export default HabitTrackerWidget;
