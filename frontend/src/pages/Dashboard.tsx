import React, { useState, useEffect, useCallback } from 'react';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import { Layout } from 'react-grid-layout';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Settings, Check, Plus, Sparkles } from 'lucide-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import PricingModal from '../components/subscription/PricingModal';
import WidgetGrid from '../components/common/WidgetGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { WIDGET_REGISTRY } from '../components/widgets/registry';
import { ActiveWidget } from '../types/widget';
import AmbianceControls from '../components/premium/AmbianceControls';

// Demo widgets for frontend-only testing
const DEMO_WIDGETS: ActiveWidget[] = [
    { id: 1, name: 'Clock', slug: 'clock', config: {}, position: { x: 0, y: 0, w: 2, h: 1 } },
    { id: 2, name: 'Weather', slug: 'weather', config: { location: 'San Francisco' }, position: { x: 2, y: 0, w: 2, h: 2 } },
    { id: 3, name: 'Quote', slug: 'quote', config: {}, position: { x: 0, y: 1, w: 2, h: 1 } },
    { id: 4, name: 'Task Manager', slug: 'task-manager', config: {}, position: { x: 0, y: 2, w: 2, h: 2 } },
    { id: 5, name: 'Pomodoro', slug: 'pomodoro', config: {}, position: { x: 2, y: 2, w: 2, h: 2 } },
    { id: 6, name: 'GitHub', slug: 'github', config: {}, position: { x: 0, y: 4, w: 2, h: 3 } },
    { id: 7, name: 'Spotify', slug: 'spotify', config: {}, position: { x: 2, y: 4, w: 2, h: 2 } },
];

// Layout templates from Demo Gallery personas
const LAYOUT_TEMPLATES: Record<string, { widgets: Array<{ slug: string; x: number; y: number; w: number; h: number; config?: Record<string, any> }> }> = {
    sysadmin: {
        widgets: [
            { slug: 'system-info', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'clock', x: 2, y: 0, w: 2, h: 1 },
            { slug: 'quick-links', x: 2, y: 1, w: 2, h: 2 },
            { slug: 'weather', x: 4, y: 0, w: 2, h: 2 },
        ],
    },
    commuter: {
        widgets: [
            { slug: 'flip-board', x: 0, y: 0, w: 4, h: 2, config: { title: 'TRANSIT' } },
            { slug: 'weather', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'quick-links', x: 0, y: 2, w: 2, h: 2 },
            { slug: 'clock', x: 2, y: 2, w: 2, h: 1 },
        ],
    },
    receptionist: {
        widgets: [
            { slug: 'photo-frame', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'sticky-notes', x: 2, y: 0, w: 2, h: 2, config: { content: '👋 Welcome to Ersen HQ!\nWiFi: Guest-Network\nPass: welcome123' } },
            { slug: 'qr-code', x: 4, y: 0, w: 2, h: 2, config: { initialValue: 'WIFI:S:ErsenGuest;T:WPA;P:password123;;', initialLabel: 'Guest Wi-Fi' } },
            { slug: 'clock', x: 0, y: 2, w: 4, h: 2 },
        ],
    },
    streamer: {
        widgets: [
            { slug: 'stream-tools', x: 0, y: 0, w: 4, h: 3 },
            { slug: 'spotify', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'system-info', x: 4, y: 2, w: 2, h: 2 },
            { slug: 'clock', x: 0, y: 3, w: 2, h: 1 },
        ],
    },
    homechef: {
        widgets: [
            { slug: 'stopwatch', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'countdown', x: 2, y: 0, w: 2, h: 1 },
            { slug: 'pomodoro', x: 2, y: 1, w: 2, h: 2 },
            { slug: 'spotify', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'sticky-notes', x: 0, y: 2, w: 4, h: 2 },
            { slug: 'quick-links', x: 4, y: 2, w: 2, h: 2 },
        ],
    },
    poweruser: {
        widgets: [
            { slug: 'clock', x: 0, y: 0, w: 2, h: 1 },
            { slug: 'task-manager', x: 0, y: 1, w: 2, h: 3 },
            { slug: 'weather', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'quick-links', x: 2, y: 2, w: 2, h: 2 },
            { slug: 'quote', x: 4, y: 0, w: 2, h: 1 },
            { slug: 'sticky-notes', x: 4, y: 1, w: 2, h: 2 },
        ],
    },
    student: {
        widgets: [
            { slug: 'pomodoro', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'task-manager', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'countdown', x: 4, y: 0, w: 2, h: 1 },
            { slug: 'calculator', x: 4, y: 1, w: 2, h: 2 },
            { slug: 'sticky-notes', x: 0, y: 2, w: 2, h: 2 },
            { slug: 'quote', x: 2, y: 2, w: 2, h: 1 },
        ],
    },
    developer: {
        widgets: [
            { slug: 'clock', x: 0, y: 0, w: 2, h: 1 },
            { slug: 'pomodoro', x: 0, y: 1, w: 2, h: 2 },
            { slug: 'quick-links', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'authenticator', x: 2, y: 2, w: 2, h: 2 },
            { slug: 'ai-assistant', x: 4, y: 0, w: 2, h: 4 },
        ],
    },
    wellness: {
        widgets: [
            { slug: 'breathing', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'water-tracker', x: 2, y: 0, w: 2, h: 2 },
            { slug: 'mood-tracker', x: 4, y: 0, w: 2, h: 2 },
            { slug: 'habit-tracker', x: 0, y: 2, w: 2, h: 2 },
            { slug: 'quote', x: 2, y: 2, w: 2, h: 1 },
            { slug: 'weather', x: 2, y: 3, w: 2, h: 2 },
        ],
    },
};

import { useVoiceControl } from '../hooks/useVoiceControl';
import VoiceOverlay from '../components/premium/VoiceOverlay';
import { Mic } from 'lucide-react';

const Dashboard: React.FC = () => {
    // ... hooks ...
    const { user } = useAuth();
    const [widgets, setWidgets] = useState<ActiveWidget[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [widgetToDelete, setWidgetToDelete] = useState<ActiveWidget | null>(null);
    const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

    const [showVoice, setShowVoice] = useState(false);
    const { isListening, transcript, startListening } = useVoiceControl(showVoice);

    useEffect(() => {
        fetchWidgets();
    }, []);

    const handleVoiceClick = () => {
        if (user?.tier !== 'pro') {
            setShowPricing(true);
            return;
        }
        setShowVoice(true);
        startListening();
    };

    const fetchWidgets = async () => {
        // Check if we're in demo mode (frontend-only dev bypass)
        const isDevBypass = localStorage.getItem('ersen_dev_bypass') === 'true';

        try {
            const { data } = await api.get('/widgets/active');
            setWidgets(data);
            setDemoMode(false);
        } catch (error) {
            console.log('Backend unavailable, using demo widgets');
            if (isDevBypass) {
                // Try to load saved layout from localStorage first
                const savedLayout = localStorage.getItem('ersen_demo_widgets');
                if (savedLayout) {
                    try {
                        const parsed = JSON.parse(savedLayout);
                        // Merge saved positions with demo widgets
                        const mergedWidgets = DEMO_WIDGETS.map(dw => {
                            const saved = parsed.find((s: any) => s.id === dw.id || s.slug === dw.slug);
                            return saved ? { ...dw, position: saved.position, config: saved.config } : dw;
                        });
                        setWidgets(mergedWidgets);
                    } catch {
                        setWidgets(DEMO_WIDGETS);
                    }
                } else {
                    setWidgets(DEMO_WIDGETS);
                }
                setDemoMode(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (id: number) => {
        const widget = widgets.find(w => w.id === id);
        if (widget) {
            setWidgetToDelete(widget);
        }
    };

    const handleConfirmDelete = async () => {
        if (!widgetToDelete) return;
        const id = widgetToDelete.id;

        // Optimistic update - remove immediately
        setWidgets(prev => prev.filter(w => w.id !== id));

        if (demoMode) {
            // Save to localStorage
            const remaining = widgets.filter(w => w.id !== id);
            localStorage.setItem('ersen_demo_widgets', JSON.stringify(remaining));
        } else {
            try {
                await api.delete(`/widgets/active/${id}`);
            } catch (error) {
                console.error('Failed to delete widget', error);
            }
        }
        setWidgetToDelete(null);
    };

    const handleConfigChange = async (id: number, newConfig: Record<string, unknown>) => {
        try {
            // Optimistic update
            setWidgets(prev => prev.map(w =>
                w.id === id ? { ...w, config: newConfig } : w
            ));
            await api.patch(`/widgets/active/${id}`, { config: newConfig });
        } catch (error) {
            console.error('Failed to update widget config', error);
        }
    };

    const handleLayoutChange = useCallback(async (layout: Layout[]) => {
        // Update local state with new positions
        setWidgets(prev => prev.map(widget => {
            const layoutItem = layout.find(l => l.i === String(widget.id));
            if (layoutItem) {
                return {
                    ...widget,
                    position: {
                        x: layoutItem.x,
                        y: layoutItem.y,
                        w: layoutItem.w,
                        h: layoutItem.h,
                    }
                };
            }
            return widget;
        }));
    }, []);

    const saveLayout = async () => {
        setSaving(true);

        try {
            if (demoMode) {
                // In demo mode, save to localStorage
                const savedWidgets = widgets.map(w => ({
                    id: w.id,
                    slug: w.slug,
                    position: w.position,
                    config: w.config
                }));
                localStorage.setItem('ersen_demo_widgets', JSON.stringify(savedWidgets));
            } else {
                // Save all widget positions to backend
                await Promise.all(widgets.map(widget =>
                    api.patch(`/widgets/active/${widget.id}`, {
                        position: widget.position
                    })
                ));
            }
        } catch (error) {
            console.error('Failed to save layout', error);
        } finally {
            setSaving(false);
            setIsEditing(false); // Always exit editing mode
        }
    };

    const handleFinishEditing = () => {
        saveLayout();
    };

    // Apply layout templates from Demo Gallery
    useEffect(() => {
        const preferredLayout = localStorage.getItem('ersen_preferred_layout');
        if (preferredLayout && !loading) {
            try {
                const { id } = JSON.parse(preferredLayout);
                if (id && LAYOUT_TEMPLATES[id]) {
                    applyLayoutTemplate(id);
                    setAppliedTemplate(id);
                    localStorage.removeItem('ersen_preferred_layout');
                }
            } catch (e) {
                console.error('Failed to parse preferred layout', e);
            }
        }
    }, [loading]);

    const applyLayoutTemplate = (templateId: string) => {
        const template = LAYOUT_TEMPLATES[templateId];
        if (!template) return;

        const newWidgets: ActiveWidget[] = template.widgets.map((w, index) => {
            const manifest = WIDGET_REGISTRY[w.slug];
            return {
                id: Date.now() + index,
                name: manifest?.name || w.slug,
                slug: w.slug,
                config: w.config || {},
                position: { x: w.x, y: w.y, w: w.w, h: w.h },
            };
        });

        setWidgets(newWidgets);
        setDemoMode(true);

        localStorage.setItem('ersen_demo_widgets', JSON.stringify(newWidgets.map(w => ({
            id: w.id,
            slug: w.slug,
            position: w.position,
            config: w.config,
        }))));
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-sans selection:bg-primary/20 relative">
            {/* Aurora background effect */}
            <div className="aurora-bg" aria-hidden="true" />

            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} currentTier={user?.tier || 'free'} />

            <VoiceOverlay
                isOpen={showVoice}
                onClose={() => setShowVoice(false)}
                isListening={isListening}
                transcript={transcript}
            />

            <DeleteConfirmDialog
                isOpen={!!widgetToDelete}
                onClose={() => setWidgetToDelete(null)}
                onConfirm={handleConfirmDelete}
                widgetName={widgetToDelete?.name || 'Widget'}
            />

            {/* Header - Refined */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-border/40">
                <div>
                    {/* ... Title ... */}
                    <h1 className="text-4xl font-light tracking-tight text-foreground/90">
                        {appliedTemplate ? (
                            <span className="capitalize">{appliedTemplate}</span>
                        ) : (
                            "My Workspace"
                        )}
                    </h1>
                    <p className="text-muted-foreground/60 text-sm mt-1 font-mono tracking-wide uppercase">
                        {isEditing ? 'Editing Layout' : 'Ready'}
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    {/* Voice Button */}
                    <button
                        onClick={handleVoiceClick}
                        className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors relative group"
                        title="Voice Control (Pro)"
                    >
                        <Mic size={18} />
                        {user?.tier !== 'pro' && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-background" />
                        )}
                    </button>

                    {/* Ambiance Controls */}
                    <AmbianceControls onUpgradeClick={() => setShowPricing(true)} />

                    {user?.tier !== 'pro' && (
                        <button
                            onClick={() => setShowPricing(true)}
                            className="text-xs text-muted-foreground/50 hover:text-primary transition-colors hover:underline underline-offset-4"
                        >
                            Upgrade Plan
                        </button>
                    )}

                    <LanguageSwitcher />

                    <button
                        onClick={() => isEditing ? handleFinishEditing() : setIsEditing(true)}
                        disabled={saving}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${isEditing
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                            : 'bg-transparent border-transparent hover:border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                            } ${saving ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isEditing ? (
                            <>
                                <Check size={14} />
                                {saving ? 'Saving...' : 'Done'}
                            </>
                        ) : (
                            <>
                                <Settings size={14} />
                                Customize
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Widget Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="col-span-1 row-span-1">
                            <Skeleton className="w-full h-full rounded-2xl bg-zinc-900/50 border border-white/5" />
                        </div>
                    ))}
                </div>
            ) : widgets.length > 0 ? (
                <WidgetGrid
                    widgets={widgets}
                    isEditing={isEditing}
                    onLayoutChange={handleLayoutChange}
                    onDeleteWidget={handleDeleteRequest}
                    onConfigChange={handleConfigChange}
                />
            ) : (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                    <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                        <Sparkles size={24} className="text-zinc-500" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-2">Your Dashboard is Empty</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-sm">
                        Start building your personal OS by adding widgets or choosing a template.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Widget
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

