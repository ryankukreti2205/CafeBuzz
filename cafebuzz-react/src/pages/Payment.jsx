import { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const METHODS = [
    { id: 'upi', label: 'UPI / GPay', icon: <Smartphone size={22} />, desc: 'Pay via UPI apps' },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={22} />, desc: 'Visa, Mastercard, RuPay' },
    { id: 'netbanking', label: 'Net Banking', icon: <Building2 size={22} />, desc: 'All major banks' },
];

export default function Payment({ addToast }) {
    const [method, setMethod] = useState('upi');
    const [loading, setLoading] = useState(false);
    const { cartItems, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        navigate('/dashboard');
        return null;
    }

    const handlePay = async () => {
        setLoading(true);
        try {
            const { data } = await placeOrder({
                items: cartItems,
                total,
                paymentMethod: method,
                user: user?.name,
            });
            clearCart();
            addToast?.({ type: 'success', message: 'Order placed successfully! 🎉' });
            navigate('/track', { state: { orderId: data._id, total } });
        } catch (err) {
            addToast?.({ type: 'error', message: err.response?.data?.message ?? 'Payment failed. Try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="payment-page fade-in">
            <div className="payment-card">
                <h1 className="payment-heading">Payment</h1>
                <p className="payment-sub">Choose your preferred payment method</p>

                <div className="method-list">
                    {METHODS.map((m) => (
                        <button
                            key={m.id}
                            className={`method-item ${method === m.id ? 'method-item--active' : ''}`}
                            onClick={() => setMethod(m.id)}
                        >
                            <span className="method-icon">{m.icon}</span>
                            <div className="method-info">
                                <span className="method-label">{m.label}</span>
                                <span className="method-desc">{m.desc}</span>
                            </div>
                            {method === m.id && <CheckCircle size={18} className="method-check" />}
                        </button>
                    ))}
                </div>

                <div className="payment-summary">
                    <div className="ps-row"><span>Items</span><span>{cartItems.length}</span></div>
                    <div className="ps-row ps-total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                </div>

                <button className="btn btn-primary pay-btn" onClick={handlePay} disabled={loading}>
                    {loading ? <span className="spinner" /> : `Pay ₹${total.toFixed(2)}`}
                </button>
            </div>
        </main>
    );
}
