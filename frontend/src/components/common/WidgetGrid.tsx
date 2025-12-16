import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Responsive, WidthProvider, Layout, Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { getWidgetManifest } from '../widgets/registry';
import { X, GripVertical, Move, Maximize2 } from 'lucide-react';
import { WidgetErrorBoundary, WidgetLoadingFallback } from '../widgets/WidgetWrapper';

// Apply width provider for responsive behavior
const ResponsiveGridLayout = WidthProvider(Responsive) as any;

import { ActiveWidget } from '../../types/widget';

interface WidgetGridProps {
    widgets: ActiveWidget[];
    isEditing: boolean;
    onLayoutChange: (layout: Layout[]) => void;
    onDeleteWidget: (id: number) => void;
    onConfigChange: (id: number, config: Record<string, unknown>) => void;
}

// Responsive breakpoints - keep 4 columns on desktop
const BREAKPOINTS = { xl: 1536, lg: 1024, md: 768, sm: 480, xs: 0 };
const COLS = { xl: 8, lg: 6, md: 4, sm: 2, xs: 1 };
const ROW_HEIGHT = { xl: 180, lg: 180, md: 170, sm: 160, xs: 180 };

/**
 * WidgetGrid - Responsive grid for widgets
 * 
 * Breakpoints:
 * - xs (0-480px): 1 column - mobile
 * - sm (480-768px): 2 columns - mobile landscape / small tablet
 * - md/lg (768px+): 4 columns - tablet and desktop
 */
const WidgetGrid: React.FC<WidgetGridProps> = ({
    widgets,
    isEditing,
    onLayoutChange,
    onDeleteWidget,
    onConfigChange,
}) => {
    const [mounted, setMounted] = useState(false);
    const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    // Prevent SSR issues
    useEffect(() => {
        setMounted(true);
    }, []);

    // Generate layouts for all breakpoints
    const generateLayouts = (): Layouts => {
        const layouts: Layouts = {};

        Object.keys(COLS).forEach((breakpoint) => {
            const cols = COLS[breakpoint as keyof typeof COLS];

            layouts[breakpoint] = widgets.map((widget, index) => {
                const manifest = getWidgetManifest(widget.slug);
                const defaultSize = manifest?.defaultSize || { w: 2, h: 2 };

                // Scale widget width based on available columns
                const scaledW = Math.min(widget.position?.w ?? defaultSize.w, cols);

                // For single column layouts, stack vertically
                const x = cols === 1 ? 0 : (widget.position?.x ?? (index % cols));
                const y = cols === 1 ? index * 2 : (widget.position?.y ?? Math.floor(index / cols) * 2);

                return {
                    i: String(widget.id),
                    x: x % cols,
                    y,
                    w: scaledW,
                    h: widget.position?.h ?? defaultSize.h,
                    minW: 1,
                    minH: 1,
                    maxW: cols,
                    maxH: 4,
                };
            });
        });

        return layouts;
    };

    const layouts = generateLayouts();

    // Handle layout changes
    const handleLayoutChange = useCallback((currentLayout: Layout[], _allLayouts: Layouts) => {
        if (isEditing) {
            onLayoutChange(currentLayout);
        }
    }, [isEditing, onLayoutChange]);

    // Track breakpoint changes
    const handleBreakpointChange = useCallback((newBreakpoint: string) => {
        setCurrentBreakpoint(newBreakpoint);
    }, []);

    // Get current row height based on breakpoint
    const rowHeight = ROW_HEIGHT[currentBreakpoint as keyof typeof ROW_HEIGHT] || 180;

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {widgets.map((widget) => (
                    <div
                        key={widget.id}
                        className="aspect-square sm:aspect-auto sm:h-[180px] bg-muted/50 rounded-2xl border border-border animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="widget-grid-container -mx-2 sm:mx-0">
            {/* Edit mode instructions */}
            {isEditing && (
                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground animate-fade-in">
                    <div className="flex items-center gap-1.5">
                        <Move size={14} className="text-blue-400" />
                        <span>Drag to move</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize2 size={14} className="text-blue-400" />
                        <span>Drag corner to resize</span>
                    </div>
                </div>
            )}

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={BREAKPOINTS}
                cols={COLS}
                rowHeight={rowHeight}
                margin={[12, 12]}
                containerPadding={[8, 8]}
                isDraggable={isEditing}
                isResizable={isEditing}
                onLayoutChange={handleLayoutChange}
                onBreakpointChange={handleBreakpointChange}
                onDragStart={() => setIsDragging(true)}
                onDragStop={() => setIsDragging(false)}
                onResizeStart={() => setIsResizing(true)}
                onResizeStop={() => setIsResizing(false)}
                draggableHandle=".widget-drag-handle"
                resizeHandles={['se']}
                useCSSTransforms={true}
                compactType="vertical"
            >
                {widgets.map((widget) => {
                    const manifest = getWidgetManifest(widget.slug);

                    if (!manifest) {
                        return (
                            <div
                                key={String(widget.id)}
                                className="relative"
                            >
                                <div className="h-full bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center justify-center">
                                    <p className="text-red-400 text-xs sm:text-sm font-medium text-center">
                                        Unknown: {widget.slug}
                                    </p>
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => onDeleteWidget(widget.id)}
                                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-600 text-white p-1 sm:p-1.5 rounded-full shadow-lg z-20"
                                    >
                                        <X size={12} className="sm:w-3.5 sm:h-3.5" />
                                    </button>
                                )}
                            </div>
                        );
                    }

                    const Component = manifest.component;

                    return (
                        <div
                            key={String(widget.id)}
                            className={`relative group ${isEditing ? 'cursor-move' : ''}`}
                        >
                            {/* Widget Container - Aura Linear Style */}
                            <div
                                className={`
                                    h-full w-full 
                                    rounded-[var(--radius)] 
                                    transition-all duration-200 ease-out
                                    ${isEditing
                                        ? 'bg-background border-2 border-primary/20 shadow-sm scale-[0.98]'
                                        : 'bg-card/30 border border-white/5 hover:border-white/10 hover:bg-card/50'
                                    }
                                `}
                            >
                                {/* Drag Handle (only in edit mode) - Minimalist */}
                                {isEditing && (
                                    <div className="widget-drag-handle absolute top-0 left-0 right-0 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing z-20 hover:bg-white/5 transition-colors">
                                        <div className="w-6 h-0.5 rounded-full bg-zinc-500/30" />
                                    </div>
                                )}

                                {/* Widget Content */}
                                <div className={`h-full w-full overflow-hidden ${isEditing ? 'pointer-events-none opacity-60' : ''}`}>
                                    <WidgetErrorBoundary widgetTitle={widget.name || widget.slug}>
                                        <Suspense fallback={<WidgetLoadingFallback />}>
                                            <Component
                                                id={widget.id}
                                                config={widget.config || {}}
                                                isEditing={isEditing}
                                                onConfigChange={(newConfig) => onConfigChange(widget.id, newConfig)}
                                            />
                                        </Suspense>
                                    </WidgetErrorBoundary>
                                </div>
                            </div>

                            {/* Delete Button (edit mode only) */}
                            {isEditing && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onDeleteWidget(widget.id);
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onTouchStart={(e) => e.stopPropagation()}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg z-20 transition-all hover:scale-110 active:scale-95"
                                    title="Remove widget"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            {/* Resize Handle (edit mode only) - More prominent */}
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center pointer-events-none z-10">
                                    <div className="w-4 h-4 rounded-br-lg border-r-2 border-b-2 border-primary/60 bg-primary/10" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </ResponsiveGridLayout>

            {/* Custom styles for react-grid-layout */}
            <style>{`
                .react-grid-layout {
                    position: relative;
                }
                .react-grid-item {
                    transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
                    transition-property: left, top, width, height;
                    touch-action: pan-y;
                }
                .react-grid-item.cssTransforms {
                    transition-property: transform, width, height;
                }
                .react-grid-item.resizing {
                    z-index: 1;
                    will-change: width, height;
                    transition: none;
                }
                .react-grid-item.react-draggable-dragging {
                    transition: none;
                    z-index: 3;
                    will-change: transform;
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
                }
                .react-grid-item.dropping {
                    visibility: hidden;
                }
                
                /* Custom resize handle - Linear style */
                .react-grid-item > .react-resizable-handle {
                    position: absolute;
                    width: 24px;
                    height: 24px;
                    background: transparent;
                }
                .react-grid-item > .react-resizable-handle::after {
                    content: "";
                    position: absolute;
                    right: 4px;
                    bottom: 4px;
                    width: 10px;
                    height: 10px;
                    border-right: 2px solid hsl(var(--primary) / 0.6);
                    border-bottom: 2px solid hsl(var(--primary) / 0.6);
                    border-radius: 0 0 4px 0;
                    transition: all 0.2s ease;
                }
                .react-grid-item > .react-resizable-handle:hover::after {
                    border-color: hsl(var(--primary));
                    width: 12px;
                    height: 12px;
                }
                .react-resizable-handle-se {
                    bottom: 0;
                    right: 0;
                    cursor: se-resize;
                }
                
                /* Placeholder - better visibility */
                .react-grid-placeholder {
                    background: hsl(var(--primary) / 0.15);
                    border: 2px dashed hsl(var(--primary) / 0.5);
                    border-radius: 1rem;
                    transition-duration: 100ms;
                    z-index: 2;
                    user-select: none;
                }
                
                /* Mobile scrolling fix - only disable when editing */
                @media (max-width: 768px) {
                    .react-grid-item {
                        touch-action: ${isEditing ? 'none' : 'pan-y'};
                    }
                    .react-grid-item > .react-resizable-handle {
                        width: 32px;
                        height: 32px;
                    }
                    .react-grid-item > .react-resizable-handle::after {
                        right: 6px;
                        bottom: 6px;
                        width: 12px;
                        height: 12px;
                    }
                }
                
                /* Ensure widget content doesn't block scroll */
                .widget-grid-container {
                    overflow-x: hidden;
                    overflow-y: visible;
                }
                
                /* Dragging state feedback */
                ${isDragging ? `
                    .react-grid-item:not(.react-draggable-dragging) {
                        opacity: 0.6;
                    }
                ` : ''}
                
                /* Resizing state feedback */
                ${isResizing ? `
                    .react-grid-item.resizing {
                        border: 2px solid hsl(var(--primary)) !important;
                        box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
                    }
                ` : ''}
            `}</style>
        </div>
    );
};

export default WidgetGrid;
