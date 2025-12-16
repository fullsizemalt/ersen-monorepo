import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users as UsersIcon, Tag, Server, LogOut, ArrowLeft } from 'lucide-react';

// Modules
import Overview from './admin/Overview';
import Users from './admin/Users';
import Promotions from './admin/Promotions';
import System from './admin/System';

const AdminDashboard: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'promotions' | 'system'>('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/dashboard');
                return;
            }
            fetchInitialData();
        }
    }, [user, authLoading, navigate]);

    const fetchInitialData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
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

    const NavItem = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
                ? 'bg-red-500/10 text-red-500 font-medium'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
        >
            <Icon size={18} />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col fixed h-full bg-black/50 backdrop-blur-xl z-20">
                <div className="mb-8 px-2">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        Admin Console
                    </h1>
                    <p className="text-xs text-zinc-500 mt-1">v2.0.0 (Comprehensive)</p>
                </div>

                <nav className="space-y-1 flex-1">
                    <NavItem id="overview" label="Overview" icon={LayoutDashboard} />
                    <NavItem id="users" label="Users" icon={UsersIcon} />
                    <NavItem id="promotions" label="Promotions" icon={Tag} />
                    <NavItem id="system" label="System Health" icon={Server} />
                </nav>

                <div className="pt-6 border-t border-zinc-900 space-y-2">
                    <button
                        onClick={() => {
                            // Logic would go here, for now just redirect
                            navigate('/login');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-900 hover:text-red-300 transition-colors rounded-xl"
                    >
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to App</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto min-h-screen">
                <header className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="bg-zinc-900 px-4 py-2 rounded-lg text-sm text-zinc-400 border border-zinc-800">
                            Logged in as <span className="text-white">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'overview' && <Overview stats={stats} />}
                    {activeTab === 'users' && <Users users={users} />}
                    {activeTab === 'promotions' && <Promotions />}
                    {activeTab === 'system' && <System />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

