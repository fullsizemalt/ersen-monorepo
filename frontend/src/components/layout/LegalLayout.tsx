import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, ArrowLeft } from 'lucide-react';

interface LegalLayoutProps {
    children: React.ReactNode;
    title: string;
}

const LegalLayout: React.FC<LegalLayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LayoutTemplate size={18} className="text-white" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight">ERSEN</span>
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">{title}</h1>
                <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-p:text-muted-foreground">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Ersen. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LegalLayout;
