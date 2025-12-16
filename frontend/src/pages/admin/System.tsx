import React from 'react';

const System: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">System Health</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-400 text-sm uppercase mb-2">Backend Status</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">Operational</span>
                    </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <h3 className="text-zinc-400 text-sm uppercase mb-2">Database</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium">Connected</span>
                    </div>
                </div>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-xl font-mono text-xs text-zinc-400 overflow-hidden">
                <div className="mb-2 text-zinc-500">Latest Logs (Stream)</div>
                <div className="space-y-1">
                    <p>[INFO] Server started on port 3000</p>
                    <p>[INFO] Connected to PostgreSQL</p>
                    <p>[INFO] Stripe Webhook received: invoice.payment_succeeded</p>
                    <p>[WARN] Rate limit threshold approaching for IP 192.168.1.5</p>
                </div>
            </div>
        </div>
    );
};

export default System;
