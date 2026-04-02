import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MenuContainer from '../components/MenuContainer';
import './Dashboard.css';

export default function Dashboard({ addToast }) {
    const { user } = useAuth();

    return (
        <main className="dashboard">
            {/* Hero Banner */}
            <div className="hero-banner">
                <div className="hero-content">
                    <span className="hero-tag"><Sparkles size={14} /> Campus Café</span>
                    <h1 className="hero-title">
                        Hey, <span className="hero-name">{user?.name ?? 'there'}</span> 👋
                    </h1>
                    <p className="hero-sub">What are you craving today?</p>
                </div>
                <div className="hero-decor">☕</div>
            </div>

            {/* Menu Section */}
            <section className="dashboard-body">
                <h2 className="section-heading">Our Menu</h2>
                <MenuContainer addToast={addToast} />
            </section>
        </main>
    );
}
