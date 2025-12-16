import React, { useState, useRef, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Volume2, VolumeX, Waves, CloudRain, Flame, Coffee, Wind, Zap } from 'lucide-react';
import PremiumGate from '../../premium/PremiumGate';

interface SoundChannel {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    frequency?: number; // For noise generation
    type: 'noise' | 'sample';
}

const SOUND_CHANNELS: SoundChannel[] = [
    { id: 'white', name: 'White Noise', icon: <Waves size={16} />, color: '#94a3b8', type: 'noise' },
    { id: 'pink', name: 'Pink Noise', icon: <Waves size={16} />, color: '#f472b6', type: 'noise' },
    { id: 'brown', name: 'Brown Noise', icon: <Waves size={16} />, color: '#a16207', type: 'noise' },
    { id: 'rain', name: 'Rain', icon: <CloudRain size={16} />, color: '#3b82f6', type: 'sample' },
    { id: 'fire', name: 'Fireplace', icon: <Flame size={16} />, color: '#f97316', type: 'sample' },
    { id: 'cafe', name: 'Café', icon: <Coffee size={16} />, color: '#78716c', type: 'sample' },
    { id: 'wind', name: 'Wind', icon: <Wind size={16} />, color: '#06b6d4', type: 'sample' },
    { id: 'thunder', name: 'Thunder', icon: <Zap size={16} />, color: '#8b5cf6', type: 'sample' },
];

const AmbianceWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [volumes, setVolumes] = useState<Record<string, number>>(config?.volumes || {});
    const [masterVolume, setMasterVolume] = useState(config?.masterVolume ?? 0.5);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<Record<string, { source: AudioBufferSourceNode | OscillatorNode; gain: GainNode }>>({});

    // Initialize Web Audio API
    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const createNoiseBuffer = (type: 'white' | 'pink' | 'brown') => {
        const ctx = audioContextRef.current!;
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            if (type === 'white') {
                output[i] = white;
            } else if (type === 'pink') {
                // Pink noise approximation
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            } else if (type === 'brown') {
                // Brown noise
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }
        return buffer;
    };

    const togglePlay = async () => {
        if (isPlaying) {
            // Stop all
            Object.values(nodesRef.current).forEach(({ source, gain }) => {
                gain.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 0.1);
                setTimeout(() => source.stop(), 100);
            });
            nodesRef.current = {};
            setIsPlaying(false);
        } else {
            // Start
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }

            const ctx = audioContextRef.current;

            // Create noise sources for active channels
            Object.entries(volumes).forEach(([id, vol]) => {
                if (vol > 0) {
                    const channel = SOUND_CHANNELS.find(c => c.id === id);
                    if (channel?.type === 'noise') {
                        const buffer = createNoiseBuffer(id as 'white' | 'pink' | 'brown');
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.loop = true;

                        const gain = ctx.createGain();
                        gain.gain.value = vol * masterVolume;

                        source.connect(gain);
                        gain.connect(ctx.destination);
                        source.start();

                        nodesRef.current[id] = { source, gain };
                    }
                    // Note: Sample-based sounds (rain, fire, etc.) would need actual audio files
                    // For MVP, we only implement noise generators
                }
            });

            setIsPlaying(true);
        }
    };

    const updateVolume = (id: string, value: number) => {
        const newVolumes = { ...volumes, [id]: value };
        setVolumes(newVolumes);
        onConfigChange?.({ ...config, volumes: newVolumes });

        // Update live audio if playing
        if (nodesRef.current[id]) {
            nodesRef.current[id].gain.gain.linearRampToValueAtTime(
                value * masterVolume,
                audioContextRef.current!.currentTime + 0.05
            );
        }
    };

    const updateMasterVolume = (value: number) => {
        setMasterVolume(value);
        onConfigChange?.({ ...config, masterVolume: value });

        // Update all gains
        Object.entries(nodesRef.current).forEach(([id, { gain }]) => {
            gain.gain.linearRampToValueAtTime(
                (volumes[id] || 0) * value,
                audioContextRef.current!.currentTime + 0.05
            );
        });
    };

    return (
        <PremiumGate featureName="Ambiance">
            <div className="h-full w-full bg-zinc-950 flex flex-col p-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Waves size={18} className="text-primary" />
                        <span className="text-sm font-medium text-white">Ambiance</span>
                    </div>
                    <button
                        onClick={togglePlay}
                        className={`p-2 rounded-full transition-colors ${isPlaying
                                ? 'bg-primary/20 text-primary'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                    >
                        {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>

                {/* Master Volume */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>Master</span>
                        <span>{Math.round(masterVolume * 100)}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={masterVolume}
                        onChange={(e) => updateMasterVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                    />
                </div>

                {/* Sound Channels */}
                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                    {SOUND_CHANNELS.map((channel) => (
                        <div key={channel.id} className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${channel.color}20`, color: channel.color }}
                            >
                                {channel.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-zinc-400">{channel.name}</span>
                                    <span className="text-zinc-600">
                                        {Math.round((volumes[channel.id] || 0) * 100)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volumes[channel.id] || 0}
                                    onChange={(e) => updateVolume(channel.id, parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                                    style={{ accentColor: channel.color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer hint */}
                <div className="pt-3 mt-2 border-t border-zinc-800 text-center">
                    <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
                        {isPlaying ? 'Playing' : 'Tap to start'}
                    </span>
                </div>
            </div>
        </PremiumGate>
    );
};

export default AmbianceWidget;
