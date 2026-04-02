import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchMenu } from '../services/api';
import { useCart } from '../context/CartContext';
import './MenuContainer.css';

const CATEGORIES = ['all', 'drinks', 'snacks', 'meals', 'desserts'];

export default function MenuContainer({ addToast }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [cat, setCat] = useState('all');
    const { addItem } = useCart();

    useEffect(() => {
        fetchMenu()
            .then((r) => setItems(r.data))
            .catch(() => addToast?.({ type: 'error', message: 'Failed to load menu' }))
            .finally(() => setLoading(false));
    }, []);

    const filtered = items.filter((item) => {
        const matchesCat = cat === 'all' || item.category === cat;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    const handleAdd = (item) => {
        addItem(item);
        addToast?.({ type: 'success', message: `${item.name} added to cart!` });
    };

    return (
        <div className="menu-section">
            {/* Search + Filters */}
            <div className="menu-controls">
                <div className="search-wrap">
                    <Search size={16} className="search-icon" />
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search menu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="category-tabs">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            className={`cat-tab ${cat === c ? 'cat-tab--active' : ''}`}
                            onClick={() => setCat(c)}
                        >
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="menu-loading">
                    {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="menu-empty">
                    <Filter size={48} />
                    <p>No items found</p>
                    <span>Try a different search or category</span>
                </div>
            ) : (
                <div className="menu-grid">
                    {filtered.map((item, idx) => (
                        <ProductCard key={item._id ?? idx} item={item} onAdd={handleAdd} />
                    ))}
                </div>
            )}
        </div>
    );
}
