import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cafebuzz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────
export const loginUser     = (data) => api.post('/login', data);
export const registerUser  = (data) => api.post('/register', data);

// ── Menu ──────────────────────────────────────────────
export const fetchMenu     = ()     => api.get('/api/menu');

// ── Orders ────────────────────────────────────────────
export const placeOrder        = (data) => api.post('/api/orders', data);
export const fetchOrders       = ()     => api.get('/api/orders');
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}`, { status });

export default api;
