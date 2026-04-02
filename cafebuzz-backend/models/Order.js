const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: String, default: 'Guest' },
    items: { type: Array, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, default: 'upi' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Preparing', 'Ready', 'Completed'] },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
