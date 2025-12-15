import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
    totalUsers: number;
    activeSubscriptions: number;
    proUsers: number;
}

interface UserData {
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
    tier: string;
    subscription_status: string;
}

const AdminDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/dashboard');
                return;
            }
            fetchData();
        }
    }, [user, authLoading, navigate]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Admin Dashboard
                    </h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        Back to App
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-8">
                        {error}
                    </div>
                )}

                {/* Stats Grid */}
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

                {/* Users Table */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold">User Management</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs font-medium">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Tier</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <div className="px-6 py-4 flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white">{u.name}</div>
                                                <div className="text-xs text-zinc-500">{u.email}</div>
                                            </div>
                                        </div>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.tier === 'pro' ? 'bg-purple-500/20 text-purple-400' :
                                                    u.tier === 'standard' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                {u.tier || 'free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.subscription_status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'
                                                }`}>
                                                {u.subscription_status || 'none'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
