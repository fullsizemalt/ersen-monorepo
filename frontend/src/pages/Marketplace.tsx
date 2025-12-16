import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Download, Plus, Sparkles, Grid3X3, LayoutGrid } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PricingModal from '../components/subscription/PricingModal';
import { Skeleton } from '../components/ui/skeleton';
import { WIDGET_REGISTRY, getWidgetsByCategory, getAllCategories } from '../components/widgets/registry';
import { WIDGET_CATEGORIES, WidgetCategory, WidgetManifest } from '../types/widget';

interface WidgetTemplate {
    slug: string;
    manifest: WidgetManifest;
    deployed: boolean;
}

// Generate catalog from registry
const generateCatalog = (deployedSlugs: string[]): WidgetTemplate[] => {
    return Object.entries(WIDGET_REGISTRY).map(([slug, manifest]) => ({
        slug,
        manifest,
        deployed: deployedSlugs.includes(slug),
    }));
};

const Marketplace: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');
    const [deploying, setDeploying] = useState<string | null>(null);
    const [showPricing, setShowPricing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deployedSlugs, setDeployedSlugs] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

    const categories = getAllCategories();

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        try {
            const { data: widgets } = await api.get('/widgets/active');
            setDeployedSlugs(widgets.map((w: any) => w.slug));
            setTimeout(() => setLoading(false), 500);
        } catch (error) {
            console.error('Failed to fetch catalog data:', error);
            setLoading(false);
        }
    };

    const deployWidget = async (slug: string) => {
        setDeploying(slug);
        try {
            const manifest = WIDGET_REGISTRY[slug];
            if (!manifest) return;

            await api.post('/widgets/active', { slug });
            navigate('/dashboard');
        } catch (error) {
            console.error('Deploy failed:', error);
        } finally {
            setDeploying(null);
        }
    };

    const catalog = generateCatalog(deployedSlugs);

    const filteredTemplates = catalog.filter(template => {
        const matchSearch = template.manifest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.manifest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.manifest.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchCategory = selectedCategory === 'all' || template.manifest.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    // Sort: available first, then alphabetically
    const sortedTemplates = [...filteredTemplates].sort((a, b) => {
        if (a.manifest.available === false && b.manifest.available !== false) return 1;
        if (a.manifest.available !== false && b.manifest.available === false) return -1;
        return a.manifest.name.localeCompare(b.manifest.name);
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                currentTier={user?.tier || 'free'}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Sparkles size={24} className="text-primary" />
                        Widget Library
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {Object.keys(WIDGET_REGISTRY).length} widgets available • {deployedSlugs.length} in config
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="Search widgets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    {/* View toggle */}
                    <div className="flex bg-secondary rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('compact')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'compact' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Grid3X3 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                        }`}
                >
                    <span>🎯</span>
                    All Widgets
                    <span className="ml-1 text-xs opacity-70">({Object.keys(WIDGET_REGISTRY).length})</span>
                </button>
                {categories.map((cat) => {
                    const catInfo = WIDGET_CATEGORIES[cat];
                    const count = getWidgetsByCategory(cat).length;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                                }`}
                        >
                            <span>{catInfo.icon}</span>
                            {catInfo.label}
                            <span className="ml-1 text-xs opacity-70">({count})</span>
                        </button>
                    );
                })}
            </div>

            {/* Grid */}
            <div className={`grid gap-4 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
                }`}>
                {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-card rounded-2xl border border-border p-4 space-y-4">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))
                ) : (
                    sortedTemplates.map((template) => (
                        <WidgetCard
                            key={template.slug}
                            template={template}
                            viewMode={viewMode}
                            deploying={deploying === template.slug}
                            onDeploy={() => deployWidget(template.slug)}
                        />
                    ))
                )}
            </div>

            {!loading && filteredTemplates.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-secondary/30 rounded-2xl border border-dashed border-border">
                    <Filter size={40} className="mb-4 opacity-40" />
                    <p className="text-base font-medium text-foreground">No widgets found</p>
                    <p className="text-sm">Try adjusting your search or category</p>
                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                        className="mt-4 text-primary hover:text-primary/80 text-sm font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

// Widget Card Component
interface WidgetCardProps {
    template: WidgetTemplate;
    viewMode: 'grid' | 'compact';
    deploying: boolean;
    onDeploy: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ template, viewMode, deploying, onDeploy }) => {
    const { manifest, deployed } = template;
    const isAvailable = manifest.available !== false;
    const catInfo = WIDGET_CATEGORIES[manifest.category];

    if (viewMode === 'compact') {
        return (
            <div
                className={`group bg-card rounded-xl border border-border p-3 flex flex-col items-center text-center transition-all ${!isAvailable ? 'opacity-50' : 'hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
            >
                <div className="text-3xl mb-2">{manifest.icon || '📦'}</div>
                <h3 className="text-xs font-medium text-foreground truncate w-full">{manifest.name}</h3>

                <button
                    onClick={onDeploy}
                    disabled={!isAvailable || deploying || deployed}
                    className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-medium transition-all ${deployed
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : !isAvailable
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                >
                    {deploying ? '...' : deployed ? '✓' : isAvailable ? '+' : 'Soon'}
                </button>
            </div>
        );
    }

    return (
        <div
            className={`group bg-card rounded-2xl border border-border overflow-hidden flex flex-col transition-all duration-300 ${!isAvailable ? 'opacity-60' : 'hover:border-primary/20 hover:shadow-xl hover:-translate-y-1'
                }`}
        >
            {/* Thumbnail */}
            <div className="h-36 bg-secondary/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl">{manifest.icon || '📦'}</span>
                    </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-muted-foreground font-medium">
                        {catInfo.icon} {catInfo.label}
                    </span>
                </div>

                {/* Tags */}
                {manifest.tags && manifest.tags.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                        {manifest.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Coming Soon */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-card px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground shadow-sm">
                            Coming Soon
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-base font-semibold text-foreground mb-1">{manifest.name}</h3>
                <p className="text-muted-foreground text-xs mb-4 flex-1 line-clamp-2">{manifest.description}</p>

                <button
                    onClick={onDeploy}
                    disabled={deploying || !isAvailable || deployed}
                    className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${!isAvailable
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : deployed
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 cursor-default'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20'
                        }`}
                >
                    {deploying ? (
                        <span className="animate-pulse">Adding...</span>
                    ) : deployed ? (
                        <>
                            <Download size={16} />
                            In Config
                        </>
                    ) : isAvailable ? (
                        <>
                            <Plus size={16} />
                            Add to Config
                        </>
                    ) : (
                        'Coming Soon'
                    )}
                </button>
            </div>
        </div>
    );
};

export default Marketplace;
