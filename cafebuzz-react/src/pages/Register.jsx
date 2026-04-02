import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Coffee, Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../services/api';
import './Auth.css';

export default function Register({ addToast }) {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(form);
            addToast?.({ type: 'success', message: 'Account created! Please sign in.' });
            navigate('/login');
        } catch (err) {
            addToast?.({ type: 'error', message: err.response?.data?.message ?? 'Registration failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="auth-logo">
                    <Coffee size={32} className="auth-logo-icon" />
                    <span>CafeBuzz</span>
                </div>
                <h1 className="auth-heading">Create account</h1>
                <p className="auth-sub">Join your campus café</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <div className="input-icon-wrap">
                            <User size={16} className="input-icon" />
                            <input className="input input-with-icon" type="text" required
                                placeholder="Your name" value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-icon-wrap">
                            <Mail size={16} className="input-icon" />
                            <input className="input input-with-icon" type="email" required
                                placeholder="you@example.com" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-icon-wrap">
                            <Lock size={16} className="input-icon" />
                            <input className="input input-with-icon"
                                type={showPw ? 'text' : 'password'} required
                                placeholder="Min. 6 characters" value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
                        {loading ? <span className="spinner" /> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
