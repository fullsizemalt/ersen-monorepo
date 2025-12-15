import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';

const StickyNotesWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [note, setNote] = useState(config.note || '');

    // Debounce save
    useEffect(() => {
        const timer = setTimeout(() => {
            if (note !== config.note) {
                onConfigChange({ ...config, note });
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [note, config, onConfigChange]);

    return (
        <WidgetWrapper title="Notes" className="bg-yellow-50 dark:bg-yellow-100/10">
            <textarea
                className="w-full h-full bg-transparent resize-none focus:outline-none text-zinc-900 dark:text-yellow-100 placeholder-zinc-400 dark:placeholder-yellow-100/30 text-sm font-handwriting"
                placeholder="Type something..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                spellCheck={false}
            />
        </WidgetWrapper>
    );
};

export default StickyNotesWidget;
