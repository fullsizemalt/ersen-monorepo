
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    ShoppingBag,
    LogOut,
    Zap,
    Terminal,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/common/ThemeToggle';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
        { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
        { icon: Sparkles, label: 'Demo Gallery', path: '/gallery' },
        { icon: Terminal, label: 'CLI Access', path: '/cli' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300">
            {/* Subtle Noise Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/20">
                        <Zap className="w-4 h-4 text-white" fill="currentColor" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">DAEMON</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <div className="flex min-h-screen pt-16 lg:pt-0">
                {/* Sidebar Navigation */}
                <aside className={cn(
                    "fixed lg:sticky top-0 left-0 z-40 h-[calc(100vh-4rem)] lg:h-screen",
                    "bg-card/95 dark:bg-card/95 backdrop-blur-md lg:backdrop-blur-none",
                    "border-r border-border/50",
                    "transform transition-all duration-300 ease-out flex flex-col",
                    isMobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
                    isCollapsed ? "lg:w-20" : "lg:w-72"
                )}>
                    {/* Desktop Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-card border border-border rounded-full items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-colors z-50"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Logo */}
                    <div className={cn(
                        "flex items-center gap-3 transition-all duration-300",
                        isCollapsed ? "p-4 justify-center" : "p-8 pb-6"
                    )}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-900/20 shrink-0">
                            <Zap className="w-5 h-5 text-white" fill="currentColor" />
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap">
                                <h1 className="font-bold text-xl tracking-tight leading-none">DAEMON</h1>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">v2.0.0</span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="px-3 py-6 space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
                        {!isCollapsed && (
                            <div className="px-4 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider fade-in">Platform</div>
                        )}
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                                    isActive(item.path)
                                        ? "text-foreground bg-primary/10 dark:bg-white/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                                    isCollapsed && "justify-center px-0"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon
                                    size={20}
                                    className={cn(
                                        "transition-colors shrink-0",
                                        isActive(item.path) ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}
                                {isActive(item.path) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                            </Link>
                        ))}

                        {/* Theme Toggle */}
                        <div className={cn("mt-6 transition-all duration-300", isCollapsed ? "flex justify-center" : "px-4")}>
                            {!isCollapsed && <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Appearance</div>}
                            <ThemeToggle compact={isCollapsed} />
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className={cn(
                        "border-t border-border/50 bg-secondary/30 transition-all duration-300",
                        isCollapsed ? "p-2" : "p-4"
                    )}>
                        <div className={cn(
                            "flex items-center gap-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer group",
                            isCollapsed ? "justify-center p-2" : "p-2"
                        )}>
                            <div className="w-9 h-9 rounded-full bg-muted border border-border overflow-hidden shrink-0">
                                <img src={user?.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate group-hover:text-foreground transition-colors">{user?.name}</h3>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            )}
                            {!isCollapsed && (
                                <button
                                    onClick={logout}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                    title="Sign Out"
                                >
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="mt-3 flex items-center justify-between px-2 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-2 h-2 rounded-full shrink-0",
                                        user?.tier === 'pro' ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" :
                                            user?.tier === 'standard' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                                                "bg-muted-foreground"
                                    )} />
                                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{user?.tier} Plan</span>
                                </div>
                                {user?.tier !== 'pro' && (
                                    <Link to="/pricing" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider ml-2">
                                        Upgrade
                                    </Link>
                                )}
                            </div>
                        )}
                        {isCollapsed && (
                            <div className="mt-2 flex justify-center">
                                <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" title="Sign Out">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={cn(
                    "flex-1 min-w-0 bg-background relative transition-all duration-300",
                    // Main content doesn't need margin shift because aside is sticky in flow
                )}>
                    {/* Top Fade for Scroll */}
                    <div className="sticky top-0 z-30 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none lg:block hidden" />

                    <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pt-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;

