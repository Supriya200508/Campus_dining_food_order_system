const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for a single menu item within an order
const OrderItemSchema = new Schema({
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

// Main Order Schema
const OrderSchema = new Schema({
    // Unique, human-readable identifier for tracking
    orderId: { type: String, required: true, unique: true }, 
    
    // User details (could be student ID or name)
    customerDetails: {
        name: { type: String, required: true },
        contact: { type: String, required: true }
    },
    
    // Array of items ordered
    items: [OrderItemSchema],
    
    // Financial details
    totalAmount: { type: Number, required: true },
    
    // Tracking information
    status: { 
        type: String, 
        enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        default: 'Pending' 
    },
    
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
