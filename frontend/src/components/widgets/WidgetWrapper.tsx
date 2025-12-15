import React, { Component, Suspense, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WidgetWrapperProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    onRetry?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error Boundary for individual widgets
 * Prevents a single widget crash from taking down the entire dashboard
 * Per Constitution Section 3: "A crash in one widget MUST NOT bring down the dashboard"
 */
class WidgetErrorBoundary extends Component<
    { children: ReactNode; widgetTitle: string; onRetry?: () => void },
    ErrorBoundaryState
> {
    constructor(props: { children: ReactNode; widgetTitle: string; onRetry?: () => void }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console (could send to error tracking service)
        console.error(`Widget Error [${this.props.widgetTitle}]:`, error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        this.props.onRetry?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Widget Error</h4>
                    <p className="text-xs text-zinc-500 mb-4 max-w-[200px]">
                        {this.state.error?.message || 'Something went wrong'}
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Loading fallback component
 */
const WidgetLoadingFallback: React.FC = () => (
    <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-600 border-t-zinc-600 dark:border-t-zinc-300 rounded-full animate-spin" />
            <span className="text-xs text-zinc-500">Loading...</span>
        </div>
    </div>
);

/**
 * WidgetWrapper - Wraps all widgets with consistent styling, error handling, and loading states
 * 
 * Features:
 * - Error boundary to isolate widget crashes
 * - Suspense for lazy loading
 * - Consistent header styling
 * - Retry capability
 */
const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
    title,
    children,
    className = '',
    onRetry
}) => {
    return (
        <div className={`w-full h-full flex flex-col glass-card rounded-2xl overflow-hidden ${className}`}>
            {/* Widget Header */}
            <div className="px-4 py-3 flex justify-between items-center border-b border-border bg-muted/30">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {title}
                </h3>
                {/* Future: Add widget actions menu here (settings, refresh, etc.) */}
            </div>

            {/* Widget Content with Error Boundary */}
            <div className="flex-1 relative overflow-hidden">
                <WidgetErrorBoundary widgetTitle={title} onRetry={onRetry}>
                    <Suspense fallback={<WidgetLoadingFallback />}>
                        <div className="h-full p-3 sm:p-4">
                            {children}
                        </div>
                    </Suspense>
                </WidgetErrorBoundary>
            </div>
        </div>
    );
};

export default WidgetWrapper;
export { WidgetErrorBoundary, WidgetLoadingFallback };
