import React from 'react';

interface UserData {
    id: number;
    email: string;
    name: string;
    role: string;
    created_at: string;
    tier: string;
    subscription_status: string;
}

interface UsersProps {
    users: UserData[];
}

const Users: React.FC<UsersProps> = ({ users }) => {
    return (
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
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold shrink-0">
                                        {u.name?.charAt(0) || u.email.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{u.name}</div>
                                        <div className="text-xs text-zinc-500">{u.email}</div>
                                    </div>
                                </td>
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
                                <td className="px-6 py-4 flex gap-2">
                                    {/* Action Placeholders */}
                                    <button className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded transition-colors text-zinc-300">
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
