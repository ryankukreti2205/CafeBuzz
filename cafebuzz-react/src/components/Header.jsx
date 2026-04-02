import { ShoppingCart, Coffee, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header({ onCartOpen }) {
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="header-inner">
                {/* Logo */}
                <Link to={isAuthenticated ? '/dashboard' : '/login'} className="logo">
                    <Coffee size={26} className="logo-icon" />
                    <span>Cafe<span className="logo-buzz">Buzz</span></span>
                </Link>

                {/* Nav (only when logged in) */}
                {isAuthenticated && (
                    <nav className="nav">
                        <Link to="/dashboard" className="nav-link">Menu</Link>
                        <Link to="/track" className="nav-link">My Orders</Link>
                        <Link to="/admin" className="nav-link">Admin</Link>
                    </nav>
                )}

                {/* Right actions */}
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <span className="user-chip">
                                <User size={14} />
                                {user.name}
                            </span>
                            <button className="cart-btn" onClick={onCartOpen} aria-label="Open cart">
                                <ShoppingCart size={20} />
                                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                            </button>
                            <button className="logout-btn" onClick={handleLogout} aria-label="Logout">
                                <LogOut size={17} />
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
