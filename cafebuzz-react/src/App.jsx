import { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Toast from './components/Toast';
import Cart from './components/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import TrackOrder from './pages/TrackOrder';
import AdminPanel from './pages/AdminPanel';
import './index.css';

let _toastId = 0;

function AppContent() {
  const [toasts, setToasts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToast = useCallback((toast) => {
    const id = ++_toastId;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      <Header onCartOpen={() => setCartOpen(true)} />
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login addToast={addToast} />} />
        <Route path="/register" element={<Register addToast={addToast} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard addToast={addToast} /></ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute><Payment addToast={addToast} /></ProtectedRoute>
        } />
        <Route path="/track" element={
          <ProtectedRoute><TrackOrder /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute><AdminPanel addToast={addToast} /></ProtectedRoute>
        } />
      </Routes>

      <Toast toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
