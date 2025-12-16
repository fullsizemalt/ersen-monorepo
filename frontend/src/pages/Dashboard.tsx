import React, { useState, useEffect, useCallback } from 'react';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import { Layout } from 'react-grid-layout';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Settings, Check, Plus, Sparkles } from 'lucide-react';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import PricingModal from '../components/subscription/PricingModal';
import WidgetGrid from '../components/common/WidgetGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { WIDGET_REGISTRY } from '../components/widgets/registry';
import { ActiveWidget } from '../types/widget';

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
const LAYOUT_TEMPLATES: Record<string, { widgets: Array<{ slug: string; x: number; y: number; w: number; h: number }> }> = {
    sysadmin: {
        widgets: [
            { slug: 'system-info', x: 0, y: 0, w: 2, h: 2 },
            { slug: 'clock', x: 2, y: 0, w: 2, h: 1 },
            { slug: 'quick-links', x: 2, y: 1, w: 2, h: 2 },
            { slug: 'weather', x: 4, y: 0, w: 2, h: 2 },
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

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [widgets, setWidgets] = useState<ActiveWidget[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [demoMode, setDemoMode] = useState(false);
    const [widgetToDelete, setWidgetToDelete] = useState<ActiveWidget | null>(null);
    const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

    useEffect(() => {
        fetchWidgets();
    }, []);

    // Check for preferred layout from Demo Gallery
    useEffect(() => {
        const preferredLayout = localStorage.getItem('ersen_preferred_layout');
        if (preferredLayout && !loading) {
            try {
                const { id } = JSON.parse(preferredLayout);
                if (id && LAYOUT_TEMPLATES[id]) {
                    applyLayoutTemplate(id);
                    setAppliedTemplate(id);
                    // Clear the preference after applying
                    localStorage.removeItem('ersen_preferred_layout');
                }
            } catch (e) {
                console.error('Failed to parse preferred layout', e);
            }
        }
    }, [loading]);

    const applyLayoutTemplate = async (templateId: string) => {
        const template = LAYOUT_TEMPLATES[templateId];
        if (!template) return;

        const newWidgets: ActiveWidget[] = template.widgets.map((w, index) => {
            const manifest = WIDGET_REGISTRY[w.slug];
            return {
                id: Date.now() + index,
                name: manifest?.name || w.slug,
                slug: w.slug,
                config: {},
                position: { x: w.x, y: w.y, w: w.w, h: w.h },
            };
        });

        setWidgets(newWidgets);
        setDemoMode(true);

        // Save to localStorage
        localStorage.setItem('ersen_demo_widgets', JSON.stringify(newWidgets.map(w => ({
            id: w.id,
            slug: w.slug,
            position: w.position,
            config: w.config,
        }))));
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
                console.log('Layout saved to localStorage');
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

    return (
        <div className="space-y-6">
            <DeleteConfirmDialog
                isOpen={!!widgetToDelete}
                onClose={() => setWidgetToDelete(null)}
                onConfirm={handleConfirmDelete}
                widgetName={widgetToDelete?.name}
            />
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                currentTier={user?.tier || 'free'}
            />

            {/* Demo Mode Banner */}
            {demoMode && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🧪</span>
                        <div>
                            <p className="text-sm font-medium text-emerald-400">Demo Mode Active</p>
                            <p className="text-xs text-zinc-500">Showing sample widgets - no backend connected</p>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-600 bg-zinc-800/50 px-2 py-1 rounded">
                        Weather & Quote widgets fetch real data!
                    </div>
                </div>
            )}

            {/* Template Applied Banner */}
            {appliedTemplate && (
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between animate-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                Layout Applied: <span className="capitalize">{appliedTemplate}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Your dashboard has been configured. Feel free to customize!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setAppliedTemplate(null)}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-secondary transition-colors"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Header - Refined */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pb-6 border-b border-border/40">
                <div>
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
                <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-700">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                        <Plus size={24} className="text-zinc-500" />
                    </div>
                    <p className="text-zinc-400 mb-2">No widgets installed yet.</p>
                    <p className="text-zinc-500 text-sm mb-6">Add some widgets from the marketplace to get started.</p>
                    <Link
                        to="/marketplace"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors"
                    >
                        <Plus size={16} />
                        Browse Marketplace
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
