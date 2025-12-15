import React, { useState, useEffect, useCallback } from 'react';
import { WidgetProps } from '../../../types/widget';
import FlipCardWidget, { SettingsToggle, SettingsInput } from '../FlipCardWidget';
import { RefreshCw, Copy, Check, Lock, Eye, EyeOff } from 'lucide-react';

const PasswordGeneratorWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(config.length || 16);
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [options, setOptions] = useState({
        uppercase: config.uppercase !== false,
        lowercase: config.lowercase !== false,
        numbers: config.numbers !== false,
        symbols: config.symbols ?? true,
    });

    const generate = useCallback(() => {
        setIsGenerating(true);

        let chars = '';
        if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.numbers) chars += '0123456789';
        if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

        // Use crypto for better randomness
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(array[i] % chars.length);
        }

        setTimeout(() => {
            setPassword(result);
            setIsGenerating(false);
        }, 150);
    }, [length, options]);

    useEffect(() => {
        generate();
    }, []);

    const copyPassword = async () => {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        onConfigChange({
            ...config,
            length,
            ...options,
        });
    };

    const getStrength = () => {
        let score = 0;
        if (length >= 12) score++;
        if (length >= 16) score++;
        if (length >= 20) score++;
        if (options.uppercase && options.lowercase) score++;
        if (options.numbers) score++;
        if (options.symbols) score++;
        return Math.min(score, 5);
    };

    const strength = getStrength();
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];

    const settingsContent = (
        <div className="space-y-4">
            <SettingsInput
                label="Default length"
                description="Characters in generated password"
                type="number"
                value={String(length)}
                onChange={(v) => setLength(Math.max(8, Math.min(64, Number(v) || 16)))}
            />
            <SettingsToggle
                label="Uppercase (A-Z)"
                checked={options.uppercase}
                onChange={(v) => setOptions(prev => ({ ...prev, uppercase: v }))}
            />
            <SettingsToggle
                label="Lowercase (a-z)"
                checked={options.lowercase}
                onChange={(v) => setOptions(prev => ({ ...prev, lowercase: v }))}
            />
            <SettingsToggle
                label="Numbers (0-9)"
                checked={options.numbers}
                onChange={(v) => setOptions(prev => ({ ...prev, numbers: v }))}
            />
            <SettingsToggle
                label="Symbols (!@#$%)"
                checked={options.symbols}
                onChange={(v) => setOptions(prev => ({ ...prev, symbols: v }))}
            />
        </div>
    );

    return (
        <FlipCardWidget
            title="Password Generator"
            settings={settingsContent}
            onSave={handleSave}
        >
            <div className="flex flex-col gap-3 h-full">
                {/* Password Display */}
                <div className="relative group">
                    <div
                        className={`bg-secondary border border-border rounded-xl p-3 font-mono text-sm transition-all ${isGenerating ? 'blur-sm' : ''
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Lock size={14} className="text-primary flex-shrink-0" />
                            <span className={`flex-1 break-all ${showPassword ? 'text-foreground' : 'text-transparent'}`}
                                style={!showPassword ? { textShadow: '0 0 8px currentColor', color: 'var(--muted-foreground)' } : {}}>
                                {password || 'Generating...'}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons overlay */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                            onClick={copyPassword}
                            className={`p-1.5 rounded-lg transition-all ${copied
                                    ? 'text-green-500 bg-green-500/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                {/* Strength Indicator */}
                <div className="space-y-1.5">
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColors[strength - 1] : 'bg-muted'
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-medium ${strengthColors[strength - 1]?.replace('bg-', 'text-') || 'text-muted-foreground'}`}>
                            {strengthLabels[strength - 1] || 'Add more options'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {length} characters
                        </span>
                    </div>
                </div>

                {/* Length Slider */}
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-6">8</span>
                    <input
                        type="range"
                        min="8"
                        max="64"
                        value={length}
                        onChange={(e) => {
                            setLength(parseInt(e.target.value));
                            generate();
                        }}
                        className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-xs font-mono text-muted-foreground w-6">64</span>
                </div>

                {/* Quick Options */}
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(options).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setOptions(prev => ({ ...prev, [key]: !value }));
                                setTimeout(generate, 50);
                            }}
                            className={`px-2.5 py-1 text-[10px] font-medium rounded-lg capitalize transition-all ${value
                                    ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {key.charAt(0).toUpperCase()}{key.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Generate Button */}
                <button
                    onClick={generate}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-all disabled:opacity-50 shadow-sm shadow-primary/20"
                >
                    <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                    {isGenerating ? 'Generating...' : 'Generate New'}
                </button>
            </div>
        </FlipCardWidget>
    );
};

export default PasswordGeneratorWidget;
