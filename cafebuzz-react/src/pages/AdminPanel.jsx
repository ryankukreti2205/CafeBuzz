import { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../services/api';
import './AdminPanel.css';

const STATUS_FLOW = ['Pending', 'Preparing', 'Ready', 'Completed'];
const STATUS_COLORS = {
    Pending: 'status--pending',
    Preparing: 'status--preparing',
    Ready: 'status--ready',
    Completed: 'status--done',
};

export default function AdminPanel({ addToast }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const load = () => {
        setLoading(true);
        fetchOrders()
            .then((r) => setOrders(r.data))
            .catch(() => addToast?.({ type: 'error', message: 'Failed to load orders' }))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const nextStatus = (cur) => STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(cur) + 1, STATUS_FLOW.length - 1)];

    const handleUpdate = async (id, current) => {
        const ns = nextStatus(current);
        if (ns === current) return;
        setUpdating(id);
        try {
            await updateOrderStatus(id, ns);
            setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: ns } : o));
            addToast?.({ type: 'success', message: `Order updated to "${ns}"` });
        } catch {
            addToast?.({ type: 'error', message: 'Failed to update status' });
        } finally {
            setUpdating(null);
        }
    };

    return (
        <main className="admin-page fade-in">
            <div className="admin-inner">
                <div className="admin-header">
                    <div>
                        <div className="admin-tag"><ShieldCheck size={14} /> Admin</div>
                        <h1 className="admin-heading">Order Dashboard</h1>
                    </div>
                    <button className="btn btn-ghost refresh-btn" onClick={load} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin-anim' : ''} /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="admin-loading">
                        {[...Array(4)].map((_, i) => <div key={i} className="skeleton-row" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="admin-empty">No orders yet.</div>
                ) : (
                    <div className="orders-table-wrap">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                                        <td>{order.user ?? '—'}</td>
                                        <td>{order.items?.length ?? 0} item(s)</td>
                                        <td className="order-total">₹{Number(order.total).toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${STATUS_COLORS[order.status] ?? ''}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.status !== 'Completed' ? (
                                                <button
                                                    className="btn btn-outline advance-btn"
                                                    onClick={() => handleUpdate(order._id, order.status)}
                                                    disabled={updating === order._id}
                                                >
                                                    {updating === order._id ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: '2px' }} /> : `→ ${nextStatus(order.status)}`}
                                                </button>
                                            ) : (
                                                <span className="done-label">✓ Done</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
