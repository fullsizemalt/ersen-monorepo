import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import * as Icons from 'lucide-react';

interface WidgetIconProps {
    iconName: string;
    className?: string;
    size?: number;
    visualVariant?: 'default' | 'glow' | 'flat' | 'glass';
}

const WidgetIcon: React.FC<WidgetIconProps> = ({
    iconName,
    className,
    size = 24,
    visualVariant = 'default'
}) => {
    // Dynamic icon lookup
    const IconComponent = (Icons as any)[iconName] as LucideIcon;

    if (!IconComponent) {
        return null; // Or fallback icon
    }

    const baseStyles = "transition-all duration-300";

    const variants = {
        default: "text-foreground opacity-80",
        glow: "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]",
        flat: "text-muted-foreground",
        glass: "text-white/80 drop-shadow-md"
    };

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {/* Optional backing glow for 'glow' variant */}
            {visualVariant === 'glow' && (
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            )}

            <IconComponent
                size={size}
                className={cn(baseStyles, variants[visualVariant])}
                strokeWidth={1.5} // Thinner stroke for elegant "Aura" look
            />
        </div>
    );
};

export default WidgetIcon;
