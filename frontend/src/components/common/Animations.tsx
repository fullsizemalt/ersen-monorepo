/**
 * Linear-style SVG Micro-animations
 * Modern, subtle animations for delightful UX
 */

import React from 'react';

interface AnimatedIconProps {
    className?: string;
    size?: number;
}

/**
 * Animated checkmark that draws itself
 */
export const AnimatedCheck: React.FC<AnimatedIconProps> = ({ className = '', size = 24 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
    >
        <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-draw-check"
            style={{
                strokeDasharray: 24,
                strokeDashoffset: 24,
                animation: 'draw-check 0.4s ease-out forwards',
            }}
        />
        <style>{`
            @keyframes draw-check {
                to { stroke-dashoffset: 0; }
            }
        `}</style>
    </svg>
);

/**
 * Pulsing dot for status indicators
 */
export const PulsingDot: React.FC<AnimatedIconProps & { color?: string }> = ({
    className = '',
    size = 8,
    color = 'currentColor'
}) => (
    <span className={`relative inline-flex ${className}`}>
        <span
            className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ backgroundColor: color }}
        />
        <span
            className="relative inline-flex rounded-full"
            style={{ width: size, height: size, backgroundColor: color }}
        />
    </span>
);

/**
 * Smooth spinner with gradient
 */
export const GradientSpinner: React.FC<AnimatedIconProps> = ({ className = '', size = 20 }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`animate-spin ${className}`}
    >
        <defs>
            <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
        </defs>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="url(#spinner-gradient)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
        />
    </svg>
);

/**
 * Bouncing dots loader (Linear style)
 */
export const BouncingDots: React.FC<AnimatedIconProps> = ({ className = '', size = 4 }) => (
    <span className={`inline-flex items-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
            <span
                key={i}
                className="rounded-full bg-current"
                style={{
                    width: size,
                    height: size,
                    animation: `bounce-dot 1.4s ease-in-out ${i * 0.16}s infinite`,
                }}
            />
        ))}
        <style>{`
            @keyframes bounce-dot {
                0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                40% { transform: translateY(-6px); opacity: 1; }
            }
        `}</style>
    </span>
);

/**
 * Animated arrow for expandable sections
 */
export const AnimatedChevron: React.FC<AnimatedIconProps & { isOpen?: boolean }> = ({
    className = '',
    size = 16,
    isOpen = false
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={`transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''} ${className}`}
    >
        <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/**
 * Success/Error state transition with morphing icon
 */
export const StateIcon: React.FC<AnimatedIconProps & { state: 'idle' | 'loading' | 'success' | 'error' }> = ({
    className = '',
    size = 24,
    state = 'idle'
}) => {
    if (state === 'loading') {
        return <GradientSpinner size={size} className={className} />;
    }

    if (state === 'success') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-green-500"
                    style={{
                        strokeDasharray: 63,
                        strokeDashoffset: 63,
                        animation: 'draw-circle 0.3s ease-out forwards',
                    }}
                />
                <path
                    d="M8 12l2.5 2.5L16 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-500"
                    style={{
                        strokeDasharray: 15,
                        strokeDashoffset: 15,
                        animation: 'draw-check 0.3s ease-out 0.2s forwards',
                    }}
                />
                <style>{`
                    @keyframes draw-circle { to { stroke-dashoffset: 0; } }
                    @keyframes draw-check { to { stroke-dashoffset: 0; } }
                `}</style>
            </svg>
        );
    }

    if (state === 'error') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-red-500"
                    style={{
                        strokeDasharray: 63,
                        strokeDashoffset: 63,
                        animation: 'draw-circle 0.3s ease-out forwards',
                    }}
                />
                <path
                    d="M15 9l-6 6M9 9l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="text-red-500"
                    style={{
                        strokeDasharray: 17,
                        strokeDashoffset: 17,
                        animation: 'draw-x 0.3s ease-out 0.2s forwards',
                    }}
                />
                <style>{`
                    @keyframes draw-circle { to { stroke-dashoffset: 0; } }
                    @keyframes draw-x { to { stroke-dashoffset: 0; } }
                `}</style>
            </svg>
        );
    }

    return null;
};

/**
 * Shimmer loading placeholder
 */
export const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`relative overflow-hidden bg-muted rounded ${className}`}>
        <div
            className="absolute inset-0"
            style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'shimmer 2s infinite',
            }}
        />
        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
    </div>
);

/**
 * Floating label input (Linear style)
 */
export const FloatingLabelInput: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    className?: string;
}> = ({ label, value, onChange, type = 'text', className = '' }) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value.length > 0;

    return (
        <div className={`relative ${className}`}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full px-4 pt-5 pb-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all peer"
                placeholder=" "
            />
            <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocused || hasValue
                        ? 'top-2 text-[10px] text-primary font-medium'
                        : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
                    }`}
            >
                {label}
            </label>
        </div>
    );
};

/**
 * Modern tooltip with smooth animations
 */
export const Tooltip: React.FC<{
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <div
                className={`absolute ${positionClasses[position]} z-50 px-2.5 py-1.5 text-xs font-medium bg-foreground text-background rounded-lg shadow-lg whitespace-nowrap transition-all duration-200 ${isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-1 pointer-events-none'
                    }`}
            >
                {content}
            </div>
        </div>
    );
};
