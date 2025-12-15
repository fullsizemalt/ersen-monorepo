import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Smile, Frown, Meh, Angry, Heart } from 'lucide-react';

const MOODS = [
    { icon: Smile, color: 'text-green-400', label: 'Happy' },
    { icon: Heart, color: 'text-pink-400', label: 'Loved' },
    { icon: Meh, color: 'text-yellow-400', label: 'Okay' },
    { icon: Frown, color: 'text-blue-400', label: 'Sad' },
    { icon: Angry, color: 'text-red-400', label: 'Angry' },
];

const MoodTrackerWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [selectedMood, setSelectedMood] = useState<string | null>(config.todayMood || null);

    const handleSelect = (label: string) => {
        setSelectedMood(label);
        onConfigChange({ ...config, todayMood: label });
    };

    return (
        <WidgetWrapper title="Mood">
            <div className="flex flex-col h-full items-center justify-center gap-4">
                <h4 className="text-sm text-gray-400">How are you feeling?</h4>
                <div className="flex gap-3">
                    {MOODS.map(({ icon: Icon, color, label }) => (
                        <button
                            key={label}
                            onClick={() => handleSelect(label)}
                            className={`p-2 rounded-full transition-all transform hover:scale-110 ${selectedMood === label
                                    ? 'bg-white/10 scale-110 ring-2 ring-white/20'
                                    : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                                }`}
                            title={label}
                        >
                            <Icon size={24} className={color} />
                        </button>
                    ))}
                </div>
                {selectedMood && (
                    <span className="text-xs text-gray-500 animate-fade-in">
                        You're feeling <span className="text-white font-medium">{selectedMood}</span> today.
                    </span>
                )}
            </div>
        </WidgetWrapper>
    );
};

export default MoodTrackerWidget;
