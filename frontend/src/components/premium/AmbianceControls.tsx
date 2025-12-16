/**
 * Ambiance Controls
 * 
 * Header-level popover for controlling background focus sounds.
 * Premium feature with quick master volume and channel mixing.
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, ChevronDown, Waves, Lock } from 'lucide-react';
import { useAmbiance, SOUND_CHANNELS } from '../../contexts/AmbianceContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AmbianceControlsProps {
    onUpgradeClick?: () => void;
}

const AmbianceControls: React.FC<AmbianceControlsProps> = ({ onUpgradeClick }) => {
    const { user } = useAuth();
    const isPro = user?.tier === 'pro';
    const [isOpen, setIsOpen] = useState(false);

    // Use ambiance context only if available (provider exists)
    let ambianceContext: ReturnType<typeof useAmbiance> | null = null;
    try {
        ambianceContext = useAmbiance();
    } catch {
        // Provider not available
    }

    const state = ambianceContext?.state;
    const isActive = ambianceContext?.isActive;

    const handleClick = () => {
        if (!isPro) {
            onUpgradeClick?.();
            return;
        }
        setIsOpen(!isOpen);
    };

    const handleToggle = () => {
        if (ambianceContext) {
            ambianceContext.togglePlay();
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={handleClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-sm ${state?.isPlaying
                        ? 'bg-primary/20 text-primary'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {state?.isPlaying ? <Volume2 size={16} /> : <Waves size={16} />}
                <span className="hidden sm:inline">Ambiance</span>
                {!isPro && (
                    <Lock size={12} className="text-amber-500" />
                )}
                {isPro && (
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && isPro && ambianceContext && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Waves size={16} className="text-primary" />
                                <span className="text-sm font-medium text-white">Focus Sounds</span>
                            </div>
                            <button
                                onClick={handleToggle}
                                className={`p-2 rounded-full transition-colors ${state?.isPlaying
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                    }`}
                            >
                                {state?.isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            </button>
                        </div>

                        {/* Master Volume */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                                <span>Master Volume</span>
                                <span>{Math.round((state?.masterVolume || 0) * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={state?.masterVolume || 0.5}
                                onChange={(e) => ambianceContext?.setMasterVolume(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Channels */}
                        <div className="space-y-3">
                            {SOUND_CHANNELS.map((channel) => (
                                <div key={channel.id} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${channel.color}20`, color: channel.color }}
                                    >
                                        <Waves size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-zinc-400 truncate">{channel.name}</span>
                                            <span className="text-zinc-600 ml-2">
                                                {Math.round((state?.channelVolumes[channel.id] || 0) * 100)}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={state?.channelVolumes[channel.id] || 0}
                                            onChange={(e) => ambianceContext?.setChannelVolume(channel.id, parseFloat(e.target.value))}
                                            className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                                            style={{ accentColor: channel.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
                            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                                {isActive ? (state?.isPlaying ? '▶ Playing' : '⏸ Paused') : 'Select sounds above'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default AmbianceControls;
