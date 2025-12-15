import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Mail, Star } from 'lucide-react';

const GmailWidget: React.FC<WidgetProps> = () => {
    const emails = [
        { id: 1, from: 'Stripe', subject: 'Your invoice is ready', time: '10:30 AM', important: true },
        { id: 2, from: 'GitHub', subject: 'Security alert for your repo', time: '9:15 AM', important: true },
        { id: 3, from: 'Newsletter', subject: 'Weekly Tech Digest', time: 'Yesterday', important: false },
        { id: 4, from: 'Team Lead', subject: 'Meeting rescheduled', time: 'Yesterday', important: false },
    ];

    return (
        <div className="h-full bg-white text-gray-900 p-4 rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 text-red-600">
                    <Mail size={20} />
                    <h3 className="font-bold">Inbox</h3>
                </div>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">2 new</span>
            </div>

            <div className="flex-1 overflow-y-auto">
                {emails.map(email => (
                    <div key={email.id} className="py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold text-sm ${email.important ? 'text-gray-900' : 'text-gray-600'}`}>{email.from}</span>
                            <span className="text-xs text-gray-400">{email.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 truncate flex-1">{email.subject}</p>
                            {email.important && <Star size={12} className="text-yellow-400 fill-current ml-2" />}
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-2 w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Compose
            </button>
        </div>
    );
};

export default GmailWidget;
