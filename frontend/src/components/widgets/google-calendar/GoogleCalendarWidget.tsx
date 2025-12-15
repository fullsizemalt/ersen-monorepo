import React from 'react';
import { WidgetProps } from '../../../types/widget';
import { Calendar as CalendarIcon, MapPin, Video } from 'lucide-react';

const GoogleCalendarWidget: React.FC<WidgetProps> = () => {
    const events = [
        { id: 1, title: 'Team Standup', time: '10:00 AM - 10:30 AM', type: 'work', location: 'Google Meet' },
        { id: 2, title: 'Lunch with Sarah', time: '12:30 PM - 1:30 PM', type: 'personal', location: 'Downtown' },
        { id: 3, title: 'Project Review', time: '3:00 PM - 4:00 PM', type: 'work', location: 'Conference Room A' },
    ];



    return (
        <div className="h-full bg-white text-gray-900 p-4 rounded-xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{new Date().getDate()}</h3>
                    <p className="text-sm text-gray-500 uppercase font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <CalendarIcon size={20} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-gray-100" />

                {events.map(event => (
                    <div key={event.id} className="flex gap-4 relative z-10">
                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mt-1 flex-shrink-0 ${event.type === 'work' ? 'bg-blue-500' : 'bg-green-500'
                            }`} />
                        <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors cursor-pointer">
                            <h4 className="font-bold text-sm text-gray-800">{event.title}</h4>
                            <p className="text-xs text-blue-600 font-medium mt-0.5">{event.time}</p>
                            {event.location && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                    {event.location.includes('Meet') ? <Video size={12} /> : <MapPin size={12} />}
                                    {event.location}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="absolute bottom-4 right-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:scale-110 transition-transform border border-gray-100">
                <span className="text-2xl leading-none mb-1">+</span>
            </button>
        </div>
    );
};

export default GoogleCalendarWidget;
