import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Send } from 'lucide-react';

import PremiumGate from '../../premium/PremiumGate';

const AiAssistantWidget: React.FC<WidgetProps> = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
        { role: 'ai', text: 'Hello! How can I help you today?' }
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        // Mock AI response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: `I'm a mock AI. You said: "${userMsg}"` }]);
        }, 1000);
    };

    return (
        <PremiumGate featureName="AI Assistant">
            <WidgetWrapper title="AI Assistant">
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-2 custom-scrollbar pr-1">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-2 rounded-lg text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-zinc-100 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-600 rounded px-2 py-1 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        />
                        <button
                            type="submit"
                            className="p-1.5 bg-blue-600 rounded hover:bg-blue-700 text-white"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </WidgetWrapper>
        </PremiumGate>
    );
};

export default AiAssistantWidget;
