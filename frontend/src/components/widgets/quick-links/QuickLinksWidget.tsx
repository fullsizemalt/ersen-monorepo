import React, { useState } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget from '../FlipCardWidget';
import { ExternalLink, Plus, X, Link2, Globe } from 'lucide-react';

interface QuickLink {
    name: string;
    url: string;
}

const DEFAULT_LINKS: QuickLink[] = [
    { name: 'Google', url: 'https://google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'YouTube', url: 'https://youtube.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
];

const QuickLinksWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [links, setLinks] = useState<QuickLink[]>(config.links || DEFAULT_LINKS);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLink, setNewLink] = useState({ name: '', url: '' });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const addLink = () => {
        if (newLink.name && newLink.url) {
            let url = newLink.url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            const updated = [...links, { name: newLink.name, url }];
            setLinks(updated);
            onConfigChange({ ...config, links: updated });
            setNewLink({ name: '', url: '' });
            setShowAddForm(false);
        }
    };

    const removeLink = (index: number) => {
        const updated = links.filter((_, i) => i !== index);
        setLinks(updated);
        onConfigChange({ ...config, links: updated });
    };

    const getFavicon = (url: string): string | null => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const getDomainName = (url: string): string => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    return (
        <FlipCardWidget title="Quick Links">
            <div className="flex flex-col h-full">
                {/* Links Grid */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2">
                        {links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group flex items-center gap-2.5 p-2.5 bg-secondary/50 hover:bg-secondary rounded-xl transition-all hover:shadow-sm"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-muted to-secondary flex items-center justify-center overflow-hidden">
                                    {getFavicon(link.url) ? (
                                        <img
                                            src={getFavicon(link.url)!}
                                            alt=""
                                            className="w-5 h-5"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <Globe size={16} className={`text-muted-foreground ${getFavicon(link.url) ? 'hidden' : ''}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{link.name}</p>
                                    <p className="text-[10px] text-muted-foreground truncate">{getDomainName(link.url)}</p>
                                </div>
                                <ExternalLink
                                    size={12}
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                />

                                {/* Delete button on hover */}
                                {hoveredIndex === i && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeLink(i);
                                        }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-sm transition-all animate-scale-in"
                                    >
                                        <X size={10} />
                                    </button>
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Add Form */}
                {showAddForm ? (
                    <div className="mt-3 p-3 bg-secondary/50 rounded-xl border border-border animate-slide-up">
                        <div className="flex items-center gap-2 mb-2">
                            <Link2 size={14} className="text-primary" />
                            <span className="text-xs font-medium text-foreground">Add New Link</span>
                        </div>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Name (e.g., My Blog)"
                                value={newLink.name}
                                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                autoFocus
                            />
                            <input
                                type="url"
                                placeholder="URL (e.g., example.com)"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={addLink}
                                    className="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium rounded-lg transition-colors"
                                >
                                    Add Link
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewLink({ name: '', url: '' });
                                    }}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="mt-3 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-dashed border-border hover:border-primary/30 rounded-xl transition-all hover:bg-secondary/30"
                    >
                        <Plus size={14} />
                        Add Link
                    </button>
                )}
            </div>
        </FlipCardWidget>
    );
};

export default QuickLinksWidget;
