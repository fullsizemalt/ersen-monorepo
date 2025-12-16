import React from 'react';
import { Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    transcript?: string;
    isListening?: boolean;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
    isOpen,
    onClose,
    transcript = "Listening...",
    isListening = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl flex flex-col items-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Pulse Animation */}
                        <div className="relative">
                            {isListening && (
                                <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                            )}
                            <div className="relative z-10 w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                <Mic size={32} className={isListening ? "text-primary animate-pulse" : "text-zinc-500"} />
                            </div>
                        </div>

                        {/* Text Output */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-light text-white">
                                {isListening ? "Listening..." : "Ready"}
                            </h2>
                            <p className="text-zinc-400 text-lg min-h-[2rem]">
                                {transcript || "Say 'Hey Ersen'..."}
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VoiceOverlay;
