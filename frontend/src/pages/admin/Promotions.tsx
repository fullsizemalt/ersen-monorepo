import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Coupon {
    id: string;
    name: string;
    percent_off: number;
    duration: string;
    times_redeemed: number;
    valid: boolean;
}

const Promotions: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ name: '', percent_off: 20, duration: 'forever', duration_in_months: 3 });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const res = await api.get('/admin/coupons');
            setCoupons(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/coupons', newCoupon);
            setCreating(false);
            fetchCoupons();
        } catch (err) {
            console.error(err);
            alert('Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/coupons/${id}`);
            fetchCoupons();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Active Coupons</h2>
                <button
                    onClick={() => setCreating(!creating)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors font-medium text-sm"
                >
                    + Create Coupon
                </button>
            </div>

            {creating && (
                <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleCreate} className="grid gap-4 max-w-md">
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-1">Coupon Name (Code)</label>
                            <input
                                type="text"
                                required
                                value={newCoupon.name}
                                onChange={e => setNewCoupon({ ...newCoupon, name: e.target.value })}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                                placeholder="SUMMER20"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-zinc-400 mb-1">Percentage Off</label>
                            <input
                                type="number"
                                required
                                min="1" max="100"
                                value={newCoupon.percent_off}
                                onChange={e => setNewCoupon({ ...newCoupon, percent_off: parseInt(e.target.value) })}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded">Cancel</button>
                            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-medium">Create</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {coupons.map(coupon => (
                    <div key={coupon.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <div className="font-bold text-lg text-white">{coupon.name}</div>
                            <div className="text-sm text-zinc-400">
                                {coupon.percent_off}% OFF • {coupon.duration} • Redeemed: {coupon.times_redeemed}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(coupon.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            Delete
                        </button>
                    </div>
                ))}
                {coupons.length === 0 && !loading && (
                    <div className="text-center py-12 text-zinc-500">No active coupons found.</div>
                )}
            </div>
        </div>
    );
};

export default Promotions;
