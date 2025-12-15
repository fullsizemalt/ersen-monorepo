import React from 'react';
import { X, Check } from 'lucide-react';
import api from '../../services/api';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: 'free' | 'standard' | 'pro';
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentTier }) => {
    if (!isOpen) return null;

    const handleSubscribe = async (tier: 'standard' | 'pro') => {
        try {
            const { data } = await api.post('/subscriptions/checkout', { tier });
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Failed to start checkout');
        }
    };

    const handleManage = async () => {
        try {
            const { data } = await api.post('/subscriptions/portal');
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Portal failed', error);
            alert('Failed to open portal');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white z-10"
                >
                    <X size={24} />
                </button>

                {/* Standard Tier */}
                <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col relative overflow-hidden group hover:bg-gray-800/50 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Standard</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">$7</span>
                        <span className="text-gray-400">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-blue-500" /> 20 Widget Slots
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-blue-500" /> Standard Widgets
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-blue-500" /> Gmail, Calendar, Spotify
                        </li>
                    </ul>
                    <button
                        onClick={() => currentTier === 'standard' ? handleManage() : handleSubscribe('standard')}
                        disabled={currentTier === 'pro'}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${currentTier === 'standard' ? 'bg-gray-700 text-white hover:bg-gray-600' :
                            currentTier === 'pro' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' :
                                'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                            }`}
                    >
                        {currentTier === 'standard' ? 'Manage Subscription' : currentTier === 'pro' ? 'Included' : 'Upgrade to Standard'}
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="flex-1 p-8 flex flex-col relative overflow-hidden group hover:bg-gray-800/50 transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
                    <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-300 text-xs font-bold px-2 py-1 rounded-full border border-purple-500/30">
                        RECOMMENDED
                    </div>
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Pro</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-4xl font-bold text-white">$19</span>
                        <span className="text-gray-400">/month</span>
                    </div>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-purple-500" /> 50 Widget Slots
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-purple-500" /> All Premium Widgets
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-purple-500" /> Grafana, Prometheus, Plex
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                            <Check size={18} className="text-purple-500" /> Early Access Features
                        </li>
                    </ul>
                    <button
                        onClick={() => currentTier === 'pro' ? handleManage() : handleSubscribe('pro')}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${currentTier === 'pro' ? 'bg-gray-700 text-white hover:bg-gray-600' :
                            'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/20'
                            }`}
                    >
                        {currentTier === 'pro' ? 'Manage Subscription' : 'Upgrade to Pro'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingModal;
