import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Server, ChefHat, Briefcase, GraduationCap, Code, Heart,
    Play, Sparkles, ArrowRight, Monitor, Smartphone, Tablet,
    Check, Clock, Zap
} from 'lucide-react';

// Demo persona configurations
import { PERSONA_TEMPLATES, ICONS_MAP } from '../constants/templates';
import { WIDGET_REGISTRY } from '../components/widgets/registry';

// Helper to convert template to the format expected by the gallery
const DEMO_PERSONAS = PERSONA_TEMPLATES.map(t => ({
    ...t,
    icon: React.createElement(ICONS_MAP[t.iconName], { size: 24 }),
    preview: {
        widgets: t.widgets.map(w => ({
            ...w,
            name: WIDGET_REGISTRY[w.slug]?.name || w.slug,
            icon: WIDGET_REGISTRY[w.slug]?.icon || '?',
        }))
    }
}));

const DemoGallery: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPersona, setSelectedPersona] = useState<DemoPersona | null>(null);
    const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'phone'>('desktop');

    const applyLayout = (persona: DemoPersona) => {
        localStorage.setItem('ersen_preferred_layout', JSON.stringify({
            id: persona.id,
            widgets: persona.widgets,
        }));
        navigate('/dashboard');
    };

    return (
        <div className="space-y-8 p-6 md:p-8 min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/30 to-background border border-border p-8 md:p-12 text-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                        <Sparkles size={16} />
                        See What You Can Build
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Your Dashboard, Your Way
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                        Explore pre-built layouts designed for different workflows. Click to preview and start with any template.
                    </p>

                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                            <Check size={16} className="text-green-500" />
                            <span>Fully customizable</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-blue-500" />
                            <span>Setup in seconds</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-yellow-500" />
                            <span>All widgets included</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persona Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEMO_PERSONAS.map((persona) => (
                    <div
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona)}
                        className="group relative bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
                    >
                        {/* Header */}
                        <div className={`h-32 bg-gradient-to-br ${persona.gradient} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                            {/* Mini preview */}
                            <div className="absolute inset-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 grid grid-cols-6 gap-1 shadow-lg">
                                {persona.preview.widgets.slice(0, 4).map((w, i) => (
                                    <div
                                        key={i}
                                        className="bg-muted rounded-md flex items-center justify-center text-xs"
                                        style={{
                                            gridColumn: `span ${Math.min(w.w, 2)}`,
                                            gridRow: `span ${Math.min(w.h, 2)}`,
                                        }}
                                    >
                                        {w.icon}
                                    </div>
                                ))}
                            </div>

                            {/* Icon badge */}
                            <div className={`absolute -bottom-4 left-4 w-12 h-12 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center ${persona.color}`}>
                                {persona.icon}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 pt-8">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{persona.name}</h3>
                                    <p className="text-xs text-muted-foreground">{persona.title}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    {persona.widgets.length} widgets
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {persona.description}
                            </p>

                            {/* Features */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {persona.features.slice(0, 3).map((f, i) => (
                                    <span key={i} className="text-[10px] px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                                        {f}
                                    </span>
                                ))}
                            </div>

                            <button className="w-full py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                <Play size={14} />
                                Preview Layout
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Preview */}
            {selectedPersona && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedPersona(null)}
                >
                    <div
                        className="bg-card border border-border rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className={`p-6 bg-gradient-to-r ${selectedPersona.gradient} border-b border-border`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center ${selectedPersona.color}`}>
                                        {selectedPersona.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{selectedPersona.name}</h2>
                                        <p className="text-muted-foreground">{selectedPersona.title}</p>
                                    </div>
                                </div>

                                {/* Device toggle */}
                                <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm rounded-xl p-1">
                                    <button
                                        onClick={() => setDevicePreview('desktop')}
                                        className={`p-2 rounded-lg transition-all ${devicePreview === 'desktop' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
                                    >
                                        <Monitor size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDevicePreview('tablet')}
                                        className={`p-2 rounded-lg transition-all ${devicePreview === 'tablet' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
                                    >
                                        <Tablet size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDevicePreview('phone')}
                                        className={`p-2 rounded-lg transition-all ${devicePreview === 'phone' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
                                    >
                                        <Smartphone size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="p-6 bg-muted/30 overflow-auto max-h-[50vh]">
                            <div className={`mx-auto bg-background border border-border rounded-2xl p-4 transition-all duration-300 ${devicePreview === 'desktop' ? 'w-full' :
                                devicePreview === 'tablet' ? 'w-[600px]' :
                                    'w-[320px]'
                                }`}>
                                {/* Mock Dashboard Grid */}
                                <div className={`grid gap-3 ${devicePreview === 'phone' ? 'grid-cols-2' : 'grid-cols-6'}`}>
                                    {selectedPersona.preview.widgets.map((widget, i) => (
                                        <div
                                            key={i}
                                            className="bg-card border border-border rounded-xl p-3 flex flex-col"
                                            style={{
                                                gridColumn: devicePreview === 'phone' ? 'span 1' : `span ${widget.w}`,
                                                gridRow: devicePreview === 'phone' ? 'span 1' : `span ${widget.h}`,
                                                minHeight: devicePreview === 'phone' ? '80px' : `${widget.h * 60}px`,
                                            }}
                                        >
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                                <span className="text-lg">{widget.icon}</span>
                                                <span className="font-medium">{widget.name}</span>
                                            </div>
                                            <div className="flex-1 bg-muted/30 rounded-lg animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Features & CTA */}
                        <div className="p-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                {selectedPersona.features.map((f, i) => (
                                    <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Check size={14} className="text-green-500" />
                                        {f}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedPersona(null)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => applyLayout(selectedPersona)}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                                >
                                    Use This Layout
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DemoGallery;
