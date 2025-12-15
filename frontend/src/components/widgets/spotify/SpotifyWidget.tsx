import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import { Play, Pause, SkipBack, SkipForward, Heart, Repeat, Shuffle, Music, ExternalLink } from 'lucide-react';
import { useIntegration } from '../../../hooks/useIntegration';
import api from '../../../services/api';

interface SpotifyTrack {
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    duration_ms: number;
    external_urls: { spotify: string };
}

interface CurrentlyPlaying {
    is_playing: boolean;
    progress_ms: number;
    item: SpotifyTrack;
}

const SpotifyWidget: React.FC<WidgetProps> = () => {
    const { connected, loading: authLoading, connect, error: authError } = useIntegration('spotify');
    const [currentTrack, setCurrentTrack] = useState<CurrentlyPlaying | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch currently playing track
    const fetchCurrentlyPlaying = async () => {
        if (!connected) return;

        try {
            setLoading(true);
            const { data } = await api.get('/integrations/spotify/now-playing');
            if (data.is_playing !== undefined) {
                setCurrentTrack(data);
                setError(null);
            } else {
                setCurrentTrack(null);
            }
        } catch (err: any) {
            if (err.response?.status === 204) {
                // No track playing
                setCurrentTrack(null);
            } else {
                setError('Failed to fetch playback');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (connected) {
            fetchCurrentlyPlaying();
            // Poll every 10 seconds
            const interval = setInterval(fetchCurrentlyPlaying, 10000);
            return () => clearInterval(interval);
        }
    }, [connected]);

    // Not connected state
    if (!connected && !authLoading) {
        return (
            <div className="h-full bg-gradient-to-br from-green-900 to-black p-6 rounded-xl flex flex-col items-center justify-center text-white">
                <Music size={48} className="text-green-500 mb-4" />
                <h3 className="font-bold text-lg mb-2">Connect Spotify</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                    Link your Spotify account to see what you're listening to
                </p>
                {authError && <p className="text-red-400 text-sm mb-2">{authError}</p>}
                <button
                    onClick={connect}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-full flex items-center gap-2 transition-colors"
                >
                    <ExternalLink size={16} />
                    Connect
                </button>
            </div>
        );
    }

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="h-full bg-gradient-to-br from-green-900 to-black p-4 rounded-xl flex items-center justify-center">
                <div className="animate-pulse text-green-500">Loading...</div>
            </div>
        );
    }

    // No track playing
    if (!currentTrack) {
        return (
            <div className="h-full bg-gradient-to-br from-green-900 to-black p-6 rounded-xl flex flex-col items-center justify-center text-white">
                <Music size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400">Nothing playing</p>
                <p className="text-gray-500 text-sm">Play something on Spotify</p>
            </div>
        );
    }

    const track = currentTrack.item;
    const progress = (currentTrack.progress_ms / track.duration_ms) * 100;
    const albumArt = track.album.images[0]?.url || 'https://picsum.photos/200';

    return (
        <div className="h-full bg-gradient-to-br from-green-900 to-black p-4 rounded-xl flex flex-col text-white relative overflow-hidden">
            {/* Background Blur Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />

            <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-800 rounded-lg shadow-lg flex-shrink-0 overflow-hidden">
                    <img src={albumArt} alt="Album Art" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-lg truncate">{track.name}</h3>
                    <p className="text-gray-400 text-sm truncate">
                        {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                    </p>
                </div>
                <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:scale-110 transition-transform"
                >
                    <Heart size={20} fill="currentColor" />
                </a>
            </div>

            <div className="mt-auto">
                <div className="w-full bg-gray-700 h-1 rounded-full mb-4 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>

                <div className="flex items-center justify-between px-2">
                    <button className="text-gray-400 hover:text-white"><Shuffle size={18} /></button>
                    <button className="text-white hover:text-green-400"><SkipBack size={24} /></button>
                    <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                        {currentTrack.is_playing ? (
                            <Pause size={24} fill="currentColor" />
                        ) : (
                            <Play size={24} fill="currentColor" className="ml-1" />
                        )}
                    </button>
                    <button className="text-white hover:text-green-400"><SkipForward size={24} /></button>
                    <button className="text-gray-400 hover:text-white"><Repeat size={18} /></button>
                </div>
            </div>

            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
    );
};

export default SpotifyWidget;
