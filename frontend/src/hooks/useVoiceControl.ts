import { useState, useEffect, useCallback } from 'react';

// Type definitions for Web Speech API
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export const useVoiceControl = (enabled: boolean = false) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
        const SpeechRecognitionClass = SpeechRecognition || webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
            setError('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognitionClass();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);

            if (event.results[current].isFinal) {
                setLastCommand(transcriptText);
                console.log('Voice Command:', transcriptText);
                // Future: Process command here or emit event
            }
        };

        if (isListening) {
            // recognition.start(); // Logic to toggle start/stop needs to be robust
        }

        return () => {
            recognition.stop();
        };
    }, [enabled]);

    const startListening = useCallback(() => {
        // Implementation for manual trigger
        // This is a scaffold, actual implementation will connect to global state
    }, []);

    return {
        isListening,
        transcript,
        lastCommand,
        error,
        startListening
    };
};
