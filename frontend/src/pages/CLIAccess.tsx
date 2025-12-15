import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, Key, RefreshCw } from 'lucide-react';
import api from '../services/api';

const CLIAccess: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const generateApiKey = async () => {
        setGenerating(true);
        try {
            const { data } = await api.post('/auth/api-key');
            setApiKey(data.apiKey);
        } catch (error) {
            // Demo mode - generate a mock key
            setApiKey(`ersen_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`);
        } finally {
            setGenerating(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const installCommand = 'npm install -g @ersen/cli';
    const loginCommand = apiKey ? `ersen login --key ${apiKey}` : 'ersen login --key YOUR_API_KEY';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Terminal className="text-green-500" />
                    CLI Access
                </h1>
                <p className="text-muted-foreground mt-2">
                    Access your dashboard from the command line. View widgets, manage tasks, and control your setup from anywhere.
                </p>
            </div>

            {/* Installation */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Download size={20} className="text-blue-500" />
                    Installation
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                    Install the Ersen CLI globally using npm:
                </p>
                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm flex items-center justify-between group">
                    <code className="text-green-400">$ {installCommand}</code>
                    <button
                        onClick={() => copyToClipboard(installCommand)}
                        className="text-zinc-500 hover:text-white transition-colors p-2"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            {/* API Key */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Key size={20} className="text-amber-500" />
                    API Key
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                    Generate an API key to authenticate the CLI with your account:
                </p>

                {!apiKey ? (
                    <button
                        onClick={generateApiKey}
                        disabled={generating}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {generating ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Key size={16} />
                                Generate API Key
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm flex items-center justify-between">
                            <code className="text-amber-400 break-all">{apiKey}</code>
                            <button
                                onClick={() => copyToClipboard(apiKey)}
                                className="text-zinc-500 hover:text-white transition-colors p-2 flex-shrink-0"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ⚠️ Save this key securely. It won't be shown again.
                        </p>
                    </div>
                )}
            </div>

            {/* Login */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Terminal size={20} className="text-purple-500" />
                    Login
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                    Authenticate the CLI with your API key:
                </p>
                <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm flex items-center justify-between">
                    <code className="text-purple-400">$ {loginCommand}</code>
                    <button
                        onClick={() => copyToClipboard(loginCommand)}
                        className="text-zinc-500 hover:text-white transition-colors p-2"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>

            {/* Commands */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Available Commands</h2>
                <div className="grid gap-3">
                    {[
                        { cmd: 'ersen status', desc: 'View dashboard summary' },
                        { cmd: 'ersen widgets', desc: 'List installed widgets' },
                        { cmd: 'ersen tasks', desc: 'View and manage tasks' },
                        { cmd: 'ersen tasks add "Buy groceries"', desc: 'Add a new task' },
                        { cmd: 'ersen pomodoro start', desc: 'Start a Pomodoro session' },
                        { cmd: 'ersen weather', desc: 'Get current weather' },
                        { cmd: 'ersen spotify', desc: 'See what\'s playing' },
                        { cmd: 'ersen tui', desc: 'Launch interactive TUI dashboard' },
                    ].map(({ cmd, desc }) => (
                        <div key={cmd} className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-4">
                                <code className="text-green-400 font-mono text-sm">{cmd}</code>
                                <span className="text-muted-foreground text-sm hidden sm:inline">— {desc}</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(cmd)}
                                className="text-zinc-600 hover:text-white transition-colors p-1"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coming Soon */}
            <div className="text-center py-8 text-muted-foreground text-sm">
                <p>CLI is currently in development. Check back soon for the full release! 🚀</p>
            </div>
        </div>
    );
};

export default CLIAccess;
