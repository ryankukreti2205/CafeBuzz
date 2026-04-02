// -----------------------------
// ☕ CafeBuzz Backend - server.js
// -----------------------------

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Order = require('./models/Order');

const app = express();

// -----------------------------
// ✅ Middleware
// -----------------------------
app.use(express.json());

app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  next();
});

// JWT auth middleware (used on protected routes)
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'temporarysecretkey');
    next();
  } catch {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// -----------------------------
// 🔗 MongoDB Connection
// -----------------------------
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cafebuzz')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// -----------------------------
// 🏠 Root Route
// -----------------------------
app.get('/', (req, res) => {
  res.send('☕ CafeBuzz Backend is Running!');
});

// -----------------------------
// 🧾 Register Route
// -----------------------------
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ message: 'Registration successful!' });
  } catch (err) {
    console.error('❌', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// -----------------------------
// 🔑 Login Route
// -----------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: 'Please fill all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'temporarysecretkey',
      { expiresIn: '2h' }
    );
    res.json({ message: 'Login successful!', token, name: user.name });
  } catch (err) {
    console.error('❌', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// -----------------------------
// 🍽️ Menu Route (GET /api/menu)
// -----------------------------
const MENU_ITEMS = [
  { _id: 'm1', name: 'Masala Chai', category: 'drinks', price: 30, description: 'Spiced milk tea brewed fresh', rating: '4.8', isPopular: true },
  { _id: 'm2', name: 'Cold Coffee', category: 'drinks', price: 60, description: 'Blended iced coffee with cream', rating: '4.7', isPopular: true },
  { _id: 'm3', name: 'Black Coffee', category: 'drinks', price: 40, description: 'Strong dark roast brew', rating: '4.5' },
  { _id: 'm4', name: 'Fresh Lime Soda', category: 'drinks', price: 35, description: 'Fizzy lime with a zing', rating: '4.4' },
  { _id: 'm5', name: 'Samosa', category: 'snacks', price: 15, description: 'Crispy fried pastry with potato filling', rating: '4.9', isPopular: true },
  { _id: 'm6', name: 'Vada Pav', category: 'snacks', price: 20, description: 'Mumbai street food staple', rating: '4.8', isPopular: true },
  { _id: 'm7', name: 'Bread Pakora', category: 'snacks', price: 25, description: 'Gram flour fried bread slices', rating: '4.6' },
  { _id: 'm8', name: 'Nachos', category: 'snacks', price: 50, description: 'Crunchy nachos with cheese dip', rating: '4.5' },
  { _id: 'm9', name: 'Dal Rice', category: 'meals', price: 80, description: 'Homestyle lentils with steamed rice', rating: '4.7', isPopular: true },
  { _id: 'm10', name: 'Paneer Roll', category: 'meals', price: 70, description: 'Grilled paneer wrap with chutney', rating: '4.6' },
  { _id: 'm11', name: 'Rajma Chawal', category: 'meals', price: 85, description: 'Kidney bean curry with rice', rating: '4.8', isPopular: true },
  { _id: 'm12', name: 'Veg Pulao', category: 'meals', price: 75, description: 'Fragrant rice with mixed vegetables', rating: '4.5' },
  { _id: 'm13', name: 'Gulab Jamun', category: 'desserts', price: 30, description: 'Soft milk dumplings in rose syrup', rating: '4.9', isPopular: true },
  { _id: 'm14', name: 'Rasgulla', category: 'desserts', price: 25, description: 'Spongy cheese balls in syrup', rating: '4.7' },
  { _id: 'm15', name: 'Kheer', category: 'desserts', price: 40, description: 'Creamy rice pudding with cardamom', rating: '4.6' },
];

app.get('/api/menu', (req, res) => {
  res.json(MENU_ITEMS);
});

// -----------------------------
// 📦 Orders Routes
// -----------------------------

// Create order
app.post('/api/orders', authMiddleware, async (req, res) => {
  try {
    const { items, total, paymentMethod } = req.body;
    if (!items?.length || !total)
      return res.status(400).json({ message: 'Invalid order data' });

    const order = new Order({
      user: req.user?.email ?? 'Guest',
      items, total, paymentMethod,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('❌', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// Get all orders (admin)
app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// -----------------------------
// 🚀 Start the Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
