import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Sparkles } from 'lucide-react';

interface PremiumGateProps {
    children: ReactNode;
    fallback?: ReactNode; // Custom fallback UI
    featureName?: string; // e.g. "Voice Control"
}

const PremiumGate: React.FC<PremiumGateProps> = ({
    children,
    fallback,
    featureName = "Premium Feature"
}) => {
    const { user } = useAuth();

    // Check if user is on 'pro' tier
    const hasAccess = user?.tier === 'pro';

    if (hasAccess) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    // Default Lock UI
    return (
        <div className="flex flex-col items-center justify-center p-6 text-center h-full w-full bg-zinc-900/50 rounded-xl border border-zinc-800 border-dashed">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <Lock size={20} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">{featureName}</h3>
            <p className="text-sm text-zinc-400 mb-4 px-4">
                Upgrade to Pro to unlock this feature and more.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-900/20 text-sm font-medium">
                <Sparkles size={14} />
                Upgrade Now
            </button>
        </div>
    );
};

export default PremiumGate;
