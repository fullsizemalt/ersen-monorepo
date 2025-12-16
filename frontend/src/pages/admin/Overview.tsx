import React from 'react';

interface StatsProps {
    stats: {
        totalUsers: number;
        activeSubscriptions: number;
        proUsers: number;
    } | null;
}

const Overview: React.FC<StatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-white">{stats?.totalUsers}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Active Subscriptions</h3>
                <p className="text-4xl font-bold text-green-400">{stats?.activeSubscriptions}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm">
                <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Pro Users</h3>
                <p className="text-4xl font-bold text-purple-400">{stats?.proUsers}</p>
            </div>
        </div>
    );
};

export default Overview;
