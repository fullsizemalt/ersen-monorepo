import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutTemplate } from 'lucide-react';
import WidgetGrid from '../components/common/WidgetGrid';
import { ActiveWidget } from '../types/widget';

// Curated Hero Widgets
const HERO_WIDGETS: ActiveWidget[] = [
    { id: 1, name: 'Clock', slug: 'clock', config: { showDate: true }, position: { x: 0, y: 0, w: 2, h: 1 } },
    { id: 2, name: 'Weather', slug: 'weather', config: { location: 'Palm Springs, CA' }, position: { x: 2, y: 0, w: 2, h: 2 } },
    { id: 3, name: 'Quote', slug: 'quote', config: { category: 'inspirational' }, position: { x: 0, y: 1, w: 2, h: 1 } },
    { id: 4, name: 'Pomodoro', slug: 'pomodoro', config: {}, position: { x: 0, y: 2, w: 2, h: 2 } },
    { id: 5, name: 'Spotify', slug: 'spotify', config: {}, position: { x: 2, y: 2, w: 2, h: 1 } }, // Mock/Unconnected state looks good
    { id: 6, name: 'Quick Links', slug: 'quick-links', config: {}, position: { x: 4, y: 0, w: 2, h: 2 } },
    { id: 7, name: 'Sticky Note', slug: 'sticky-notes', config: { content: "Welcome to Ersen! \n\nThis is your new personal dashboard.\n\nEverything is customizable." }, position: { x: 4, y: 2, w: 2, h: 2 } },
];

const PERSONAS = [
    { label: 'Developers', color: 'text-blue-500' },
    { label: 'Students', color: 'text-emerald-500' },
    { label: 'Designers', color: 'text-purple-500' },
    { label: 'Productivity', color: 'text-orange-500' },
    { label: 'Focus', color: 'text-indigo-500' },
    { label: 'You', color: 'text-pink-500' },
];

const GuestDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [personaIndex, setPersonaIndex] = useState(0);
    const [widgets] = useState<ActiveWidget[]>(HERO_WIDGETS);
    const [isScrolled, setIsScrolled] = useState(false);

    // Cycle persona text
    useEffect(() => {
        const interval = setInterval(() => {
            setPersonaIndex((prev) => (prev + 1) % PERSONAS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Scroll listener for header blurring
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mock Login/Claim Handler
    const handleClaim = () => {
        // Save current layout preference if we want to carry it over
        localStorage.setItem('ersen_preferred_layout', JSON.stringify({ widgets }));
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-transparent relative">
            {/* Background Gradients - Subtle */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50" />

            {/* Header Section */}
            <div className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-card border-b border-white/5 py-3' : 'py-6'} px-4 sm:px-8`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <LayoutTemplate size={18} className="text-white" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight">ERSEN</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold flex flex-wrap justify-center md:justify-start gap-2 items-center">
                            <span>A dashboard for</span>
                            <div className="relative h-10 w-48 text-left inline-block">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={personaIndex}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`absolute inset-0 ${PERSONAS[personaIndex].color}`}
                                    >
                                        {PERSONAS[personaIndex].label}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                        >
                            Log In
                        </button>
                        <button
                            onClick={handleClaim}
                            className="group flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-foreground/10"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Widget Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 pb-32">
                <WidgetGrid
                    widgets={widgets}
                    isEditing={false} // Guest mode is read-only (mostly)
                    onLayoutChange={() => { }} // No-op
                    onDeleteWidget={() => { }}
                    onConfigChange={() => { }}
                />
            </main>

            {/* Floating Claim Bar (Mobile/Persistent) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 bg-gradient-to-t from-background via-background/95 to-transparent">
                <div className="max-w-2xl mx-auto glass-card border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/20 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Make this yours</p>
                            <p className="text-xs text-muted-foreground">Save this layout and add your own integrations.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleClaim}
                        className="whitespace-nowrap flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <span>Claim Dashboard</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GuestDashboard;
