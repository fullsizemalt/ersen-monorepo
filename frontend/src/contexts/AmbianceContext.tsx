/**
 * Ambiance Context
 * 
 * Global background audio feature for focus sounds.
 * Persists across dashboard navigation, accessible from header.
 */

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface SoundChannel {
    id: string;
    name: string;
    color: string;
    type: 'noise';
}

export const SOUND_CHANNELS: SoundChannel[] = [
    { id: 'white', name: 'White Noise', color: '#94a3b8', type: 'noise' },
    { id: 'pink', name: 'Pink Noise', color: '#f472b6', type: 'noise' },
    { id: 'brown', name: 'Brown Noise', color: '#a16207', type: 'noise' },
];

interface AmbianceState {
    isPlaying: boolean;
    masterVolume: number;
    channelVolumes: Record<string, number>;
}

interface AmbianceContextType {
    state: AmbianceState;
    togglePlay: () => void;
    setMasterVolume: (volume: number) => void;
    setChannelVolume: (channelId: string, volume: number) => void;
    isActive: boolean; // True if any channel has volume > 0
}

const AmbianceContext = createContext<AmbianceContextType | null>(null);

const STORAGE_KEY = 'ersen_ambiance_settings';

export const AmbianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Load saved settings
    const loadSavedSettings = (): AmbianceState => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch { }
        return {
            isPlaying: false,
            masterVolume: 0.5,
            channelVolumes: {},
        };
    };

    const [state, setState] = useState<AmbianceState>(loadSavedSettings);
    const audioContextRef = useRef<AudioContext | null>(null);
    const nodesRef = useRef<Record<string, { source: AudioBufferSourceNode; gain: GainNode }>>({});

    // Save settings when they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const createNoiseBuffer = useCallback((type: 'white' | 'pink' | 'brown') => {
        const ctx = audioContextRef.current!;
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;

            if (type === 'white') {
                output[i] = white;
            } else if (type === 'pink' || type === 'brown') {
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        }
        return buffer;
    }, []);

    const startAudio = useCallback(async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new AudioContext();
        }

        const ctx = audioContextRef.current;

        // Start noise sources for active channels
        Object.entries(state.channelVolumes).forEach(([id, vol]) => {
            if (vol > 0 && !nodesRef.current[id]) {
                const channel = SOUND_CHANNELS.find(c => c.id === id);
                if (channel?.type === 'noise') {
                    const buffer = createNoiseBuffer(id as 'white' | 'pink' | 'brown');
                    const source = ctx.createBufferSource();
                    source.buffer = buffer;
                    source.loop = true;

                    const gain = ctx.createGain();
                    gain.gain.value = vol * state.masterVolume;

                    source.connect(gain);
                    gain.connect(ctx.destination);
                    source.start();

                    nodesRef.current[id] = { source, gain };
                }
            }
        });
    }, [state.channelVolumes, state.masterVolume, createNoiseBuffer]);

    const stopAudio = useCallback(() => {
        Object.values(nodesRef.current).forEach(({ source, gain }) => {
            if (audioContextRef.current) {
                gain.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1);
            }
            setTimeout(() => source.stop(), 100);
        });
        nodesRef.current = {};
    }, []);

    const togglePlay = useCallback(() => {
        if (state.isPlaying) {
            stopAudio();
        } else {
            startAudio();
        }
        setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }, [state.isPlaying, startAudio, stopAudio]);

    const setMasterVolume = useCallback((volume: number) => {
        setState(prev => ({ ...prev, masterVolume: volume }));

        // Update all playing gains
        Object.entries(nodesRef.current).forEach(([id, { gain }]) => {
            if (audioContextRef.current) {
                gain.gain.linearRampToValueAtTime(
                    (state.channelVolumes[id] || 0) * volume,
                    audioContextRef.current.currentTime + 0.05
                );
            }
        });
    }, [state.channelVolumes]);

    const setChannelVolume = useCallback((channelId: string, volume: number) => {
        setState(prev => ({
            ...prev,
            channelVolumes: { ...prev.channelVolumes, [channelId]: volume }
        }));

        // Update live audio
        if (nodesRef.current[channelId] && audioContextRef.current) {
            nodesRef.current[channelId].gain.gain.linearRampToValueAtTime(
                volume * state.masterVolume,
                audioContextRef.current.currentTime + 0.05
            );
        }

        // Start new channel if playing and volume > 0
        if (state.isPlaying && volume > 0 && !nodesRef.current[channelId]) {
            startAudio();
        }
    }, [state.masterVolume, state.isPlaying, startAudio]);

    const isActive = Object.values(state.channelVolumes).some(v => v > 0);

    return (
        <AmbianceContext.Provider value={{ state, togglePlay, setMasterVolume, setChannelVolume, isActive }}>
            {children}
        </AmbianceContext.Provider>
    );
};

export const useAmbiance = () => {
    const context = useContext(AmbianceContext);
    if (!context) {
        throw new Error('useAmbiance must be used within AmbianceProvider');
    }
    return context;
};
