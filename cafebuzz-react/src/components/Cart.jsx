import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart({ open, onClose }) {
    const { cartItems, removeItem, updateQty, subtotal, tax, total, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/payment');
    };

    return (
        <>
            {/* Backdrop */}
            <div className={`cart-backdrop ${open ? 'cart-backdrop--open' : ''}`} onClick={onClose} />

            {/* Drawer */}
            <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`}>
                <div className="cart-header">
                    <h2 className="cart-title"><ShoppingBag size={20} /> Your Order</h2>
                    <button className="cart-close" onClick={onClose}><X size={20} /></button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <span className="cart-empty-emoji">🛒</span>
                        <p>Your cart is empty</p>
                        <span>Add something delicious!</span>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <span className="cart-item-emoji">
                                        {item.category === 'drinks' ? '☕' : item.category === 'snacks' ? '🍿' : item.category === 'desserts' ? '🍰' : '🍜'}
                                    </span>
                                    <div className="cart-item-info">
                                        <p className="cart-item-name">{item.name}</p>
                                        <p className="cart-item-price">₹{item.price}</p>
                                    </div>
                                    <div className="cart-qty">
                                        <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}><Minus size={12} /></button>
                                        <span className="qty-num">{item.qty}</span>
                                        <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}><Plus size={12} /></button>
                                    </div>
                                    <span className="cart-item-total">₹{(item.price * item.qty).toFixed(2)}</span>
                                    <button className="cart-remove" onClick={() => removeItem(item._id)}><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-totals">
                                <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                                <div className="total-row"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                                <div className="total-row total-row--grand"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                            </div>
                            <button className="btn btn-primary btn-checkout" onClick={handleCheckout}>
                                Proceed to Checkout →
                            </button>
                            <button className="btn-clear" onClick={clearCart}>Clear cart</button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
}
