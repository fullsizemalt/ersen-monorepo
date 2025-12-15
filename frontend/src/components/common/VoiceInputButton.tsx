import React, { useEffect } from 'react';
import { Mic } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
    onTranscript: (text: string) => void;
    className?: string;
    placeholder?: string;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
    onTranscript,
    className
}) => {
    const {
        isListening,
        transcript,
        startListening,
        stopListening,
        isSupported
    } = useVoiceInput();

    // Propagate transcript changes
    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    if (!isSupported) return null;

    return (
        <button
            onClick={isListening ? stopListening : startListening}
            className={cn(
                "p-2 rounded-full transition-all duration-300 relative group",
                isListening
                    ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 ring-1 ring-red-500/50"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                className
            )}
            title={isListening ? "Stop listening" : "Voice input"}
            type="button"
        >
            {isListening ? (
                <>
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                </>
            ) : (
                <Mic className="w-4 h-4" />
            )}
        </button>
    );
};

export default VoiceInputButton;
