import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Check, ArrowRight } from 'lucide-react';

const STARTER_WIDGETS = [
    { id: 1, slug: 'clock', name: 'Clock', description: 'Essential time and date' },
    { id: 2, slug: 'weather', name: 'Weather', description: 'Local forecast' },
    { id: 3, slug: 'task-manager', name: 'Tasks', description: 'Simple todo list' },
    { id: 4, slug: 'sticky-notes', name: 'Notes', description: 'Quick thoughts' },
];

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<number[]>([1, 2]); // Default selection
    const [loading, setLoading] = useState(false);

    const toggleSelection = (id: number) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            // Install selected widgets sequentially
            for (const templateId of selected) {
                await api.post('/widgets/active', { templateId });
            }
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to install starter widgets', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Welcome to DAEMON
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Let's set up your personal dashboard. Choose your starter widgets:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {STARTER_WIDGETS.map((widget) => (
                        <div
                            key={widget.id}
                            onClick={() => toggleSelection(widget.id)}
                            className={`p-6 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${selected.includes(widget.id)
                                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10'
                                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border flex-shrink-0 transition-colors ${selected.includes(widget.id)
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'border-gray-500 text-transparent'
                                }`}>
                                <Check size={14} strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">{widget.name}</h3>
                                <p className="text-gray-400 text-sm">{widget.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleComplete}
                        disabled={loading || selected.length === 0}
                        className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                    >
                        {loading ? 'Setting up...' : 'Get Started'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
