import { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceInputState {
    isListening: boolean;
    transcript: string;
    error: string | null;
    isSupported: boolean;
}

interface UseVoiceInputReturn extends VoiceInputState {
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useVoiceInput = (): UseVoiceInputReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check for browser support
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    // We only care about the latest interim result appended to what we already have, 
                    // or better yet, just exposing the current session's text.
                    // For input fields, we usually want the live generic string.
                    if (finalTranscript || interimTranscript) {
                        setTranscript(() => {
                            // Simple logic: return latest valid text. 
                            // Complex logic might handle appending, but for a hook, 
                            // providing the current event data is safer.
                            // However, let's keep it simple: generic accumulation is tricky without context.
                            // Let's rely on the latest result.
                            return finalTranscript + interimTranscript;
                        });
                    }
                };

                recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                    console.error('Speech recognition error', event.error);
                    setError(event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            } else {
                setIsSupported(false);
                setError('Speech recognition not supported in this browser.');
            }
        }
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                // Clear previous transcript on new start? 
                // Often better to clear explicitly, but for "input" replacement, yes.
                setTranscript('');
                recognitionRef.current.start();
            } catch (err) {
                console.error('Failed to start recognition:', err);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript
    };
};
