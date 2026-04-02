import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

// Per-item image mapping using the collage images as backgrounds
// Each item ID maps to a background-position that shows its quadrant in the collage
const ITEM_IMAGE = {
    // Drinks collage: 2x2 grid → top-left, top-right, bottom-left, bottom-right
    m1: { src: '/food/drinks.png', pos: '0% 0%' },         // Masala Chai — top-left
    m2: { src: '/food/drinks.png', pos: '100% 0%' },        // Cold Coffee — top-right
    m3: { src: '/food/drinks.png', pos: '0% 100%' },        // Black Coffee — bottom-left
    m4: { src: '/food/drinks.png', pos: '100% 100%' },      // Fresh Lime Soda — bottom-right

    // Snacks collage
    m5: { src: '/food/snacks.png', pos: '0% 0%' },          // Samosa — top-left
    m6: { src: '/food/snacks.png', pos: '100% 0%' },         // Vada Pav — top-right
    m7: { src: '/food/snacks.png', pos: '0% 100%' },         // Bread Pakora — bottom-left
    m8: { src: '/food/snacks.png', pos: '100% 100%' },       // Nachos — bottom-right

    // Meals collage
    m9: { src: '/food/meals.png', pos: '0% 0%' },          // Dal Rice — top-left
    m10: { src: '/food/meals.png', pos: '100% 0%' },         // Paneer Roll — top-right
    m11: { src: '/food/meals.png', pos: '0% 100%' },         // Rajma Chawal — bottom-left
    m12: { src: '/food/meals.png', pos: '100% 100%' },       // Veg Pulao — bottom-right

    // Desserts collage (3 items, use full image for each with slight offset)
    m13: { src: '/food/desserts.png', pos: '0% 0%' },        // Gulab Jamun
    m14: { src: '/food/desserts.png', pos: '100% 0%' },      // Rasgulla
    m15: { src: '/food/desserts.png', pos: '50% 100%' },     // Kheer
};

const CATEGORY_EMOJI = { drinks: '☕', snacks: '🍿', meals: '🍜', desserts: '🍰' };

export default function ProductCard({ item, onAdd }) {
    const { cartItems } = useCart();
    const inCart = cartItems.some((i) => i._id === item._id);
    const img = ITEM_IMAGE[item._id];

    return (
        <div className="product-card fade-in">
            <div
                className="product-img-wrap"
                style={img ? {
                    backgroundImage: `url(${img.src})`,
                    backgroundSize: '200%',
                    backgroundPosition: img.pos,
                } : {}}
            >
                {!img && (
                    <span className="product-emoji">{CATEGORY_EMOJI[item.category] ?? '🍽️'}</span>
                )}
                {item.isPopular && <span className="product-badge">Popular</span>}
                <div className="product-img-overlay" />
            </div>
            <div className="product-body">
                <div className="product-meta">
                    <span className="product-category">{item.category}</span>
                    <span className="product-rating">
                        <Star size={12} fill="currentColor" /> {item.rating ?? '4.5'}
                    </span>
                </div>
                <h3 className="product-name">{item.name}</h3>
                <p className="product-desc">{item.description}</p>
                <div className="product-footer">
                    <span className="product-price">₹{item.price}</span>
                    <button
                        className={`btn btn-primary product-add-btn ${inCart ? 'product-add-btn--in-cart' : ''}`}
                        onClick={() => onAdd(item)}
                    >
                        <ShoppingCart size={15} />
                        {inCart ? 'Added ✓' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
