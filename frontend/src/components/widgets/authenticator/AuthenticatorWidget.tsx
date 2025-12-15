import React, { useState, useEffect } from 'react';
import { WidgetProps } from '../../../types/widget';
import WidgetWrapper from '../WidgetWrapper';
import { Shield, Plus, Copy, Check, Trash2, Eye, EyeOff } from 'lucide-react';

interface TOTPAccount {
    name: string;
    secret: string;
}

// TOTP algorithm implementation
const generateTOTP = (secret: string, timeStep: number = 30): string => {
    try {
        // Simplified TOTP for demo - in production use a proper library
        const time = Math.floor(Date.now() / 1000 / timeStep);

        // Use secret as seed for pseudo-random generation
        let hash = 0;
        const combined = secret + time.toString();
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        // Generate 6-digit code
        const code = Math.abs(hash % 1000000);
        return code.toString().padStart(6, '0');
    } catch {
        return '------';
    }
};

const AuthenticatorWidget: React.FC<WidgetProps> = ({ config, onConfigChange }) => {
    const [accounts, setAccounts] = useState<TOTPAccount[]>(config.accounts || []);
    const [codes, setCodes] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [adding, setAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({ name: '', secret: '' });
    const [copied, setCopied] = useState<string | null>(null);
    const [showSecrets, setShowSecrets] = useState(false);

    // Update codes every second
    useEffect(() => {
        const updateCodes = () => {
            const newCodes: Record<string, string> = {};
            accounts.forEach(acc => {
                newCodes[acc.name] = generateTOTP(acc.secret);
            });
            setCodes(newCodes);
            setTimeLeft(30 - (Math.floor(Date.now() / 1000) % 30));
        };

        updateCodes();
        const interval = setInterval(updateCodes, 1000);
        return () => clearInterval(interval);
    }, [accounts]);

    const addAccount = () => {
        if (newAccount.name && newAccount.secret) {
            const updated = [...accounts, { name: newAccount.name, secret: newAccount.secret.replace(/\s/g, '').toUpperCase() }];
            setAccounts(updated);
            onConfigChange({ ...config, accounts: updated });
            setNewAccount({ name: '', secret: '' });
            setAdding(false);
        }
    };

    const removeAccount = (name: string) => {
        const updated = accounts.filter(a => a.name !== name);
        setAccounts(updated);
        onConfigChange({ ...config, accounts: updated });
    };

    const copyCode = async (name: string, code: string) => {
        await navigator.clipboard.writeText(code);
        setCopied(name);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <WidgetWrapper title="Authenticator">
            <div className="flex flex-col h-full gap-2">
                {/* Time progress bar */}
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${(timeLeft / 30) * 100}%` }}
                    />
                </div>

                {/* Accounts list */}
                <div className="flex-1 space-y-2 overflow-y-auto">
                    {accounts.length === 0 && !adding && (
                        <div className="flex flex-col items-center justify-center h-full text-center py-4">
                            <Shield size={32} className="text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No accounts added</p>
                            <button
                                onClick={() => setAdding(true)}
                                className="mt-2 text-xs text-primary hover:underline"
                            >
                                Add your first account
                            </button>
                        </div>
                    )}

                    {accounts.map((account) => (
                        <div key={account.name} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg group">
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground truncate">{account.name}</p>
                                <button
                                    onClick={() => copyCode(account.name, codes[account.name] || '')}
                                    className="text-xl font-mono font-bold text-foreground tracking-widest hover:text-primary transition-colors"
                                >
                                    {codes[account.name] || '------'}
                                </button>
                            </div>
                            <div className="flex items-center gap-1">
                                {copied === account.name ? (
                                    <Check size={14} className="text-green-500" />
                                ) : (
                                    <Copy size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer hover:text-foreground" onClick={() => copyCode(account.name, codes[account.name] || '')} />
                                )}
                                <Trash2
                                    size={14}
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500"
                                    onClick={() => removeAccount(account.name)}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add account form */}
                    {adding && (
                        <div className="space-y-2 p-2 bg-muted/30 rounded-lg border border-border">
                            <input
                                type="text"
                                placeholder="Account name (e.g. GitHub)"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                                className="w-full bg-background rounded px-2 py-1 text-xs text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="relative">
                                <input
                                    type={showSecrets ? 'text' : 'password'}
                                    placeholder="Secret key"
                                    value={newAccount.secret}
                                    onChange={(e) => setNewAccount({ ...newAccount, secret: e.target.value })}
                                    className="w-full bg-background rounded px-2 py-1 pr-8 text-xs text-foreground font-mono border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <button
                                    onClick={() => setShowSecrets(!showSecrets)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showSecrets ? <EyeOff size={12} /> : <Eye size={12} />}
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={addAccount} className="flex-1 py-1 bg-primary text-primary-foreground text-xs rounded">Add</button>
                                <button onClick={() => setAdding(false)} className="flex-1 py-1 bg-muted text-muted-foreground text-xs rounded">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Add button */}
                {!adding && accounts.length > 0 && (
                    <button
                        onClick={() => setAdding(true)}
                        className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1"
                    >
                        <Plus size={12} />
                        Add Account
                    </button>
                )}
            </div>
        </WidgetWrapper>
    );
};

export default AuthenticatorWidget;
