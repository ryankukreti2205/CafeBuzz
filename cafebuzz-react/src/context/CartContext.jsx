import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cafebuzz_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('cafebuzz_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addItem = (item) => {
        setCartItems((prev) => {
            const idx = prev.findIndex((i) => i._id === item._id);
            if (idx >= 0) {
                const updated = [...prev];
                updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
                return updated;
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeItem = (id) => setCartItems((prev) => prev.filter((i) => i._id !== id));

    const updateQty = (id, qty) => {
        if (qty <= 0) { removeItem(id); return; }
        setCartItems((prev) => prev.map((i) => i._id === id ? { ...i, qty } : i));
    };

    const clearCart = () => setCartItems([]);

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = +(subtotal * 0.05).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQty, clearCart, subtotal, tax, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
