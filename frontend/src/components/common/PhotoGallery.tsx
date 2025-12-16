import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Photo {
    id: string;
    url: string;
    caption?: string;
    photographer?: string;
}

interface PhotoGalleryProps {
    photos: Photo[];
    interval?: number; // 0 to disable auto-play
    className?: string;
    variant?: 'cover' | 'contain' | 'grid';
    showControls?: boolean;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    photos,
    interval = 5000,
    className,
    variant = 'cover',
    showControls = true
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        if (!photos.length || interval <= 0) return;

        const timer = setInterval(() => {
            nextPhoto();
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, photos.length, interval]);

    const nextPhoto = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    if (!photos.length) {
        return (
            <div className={cn("flex flex-col items-center justify-center bg-zinc-900/50 rounded-xl", className)}>
                <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-500">No photos</p>
            </div>
        );
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const currentPhoto = photos[currentIndex];

    return (
        <div className={cn("relative w-full h-full overflow-hidden group", className)}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={currentPhoto.url}
                        alt={currentPhoto.caption}
                        className={cn(
                            "w-full h-full",
                            variant === 'cover' ? "object-cover" : "object-contain bg-black"
                        )}
                    />

                    {(currentPhoto.caption || currentPhoto.photographer) && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            {currentPhoto.caption && <p className="text-white text-sm font-medium truncate">{currentPhoto.caption}</p>}
                            {currentPhoto.photographer && <p className="text-white/60 text-xs truncate">by {currentPhoto.photographer}</p>}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Controls (Hover only) */}
            {showControls && photos.length > 1 && (
                <>
                    <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {photos.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full shadow-sm transition-colors",
                                    idx === currentIndex ? "bg-white" : "bg-white/30"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PhotoGallery;
