const express = require('express');
const router = express.Router();
const Order = require('./Order.model');
const Menu = require('./Menu.model'); // We will create this model next

// --- Utility Functions ---

// Simple function to generate a unique, short order ID
const generateOrderId = () => {
    // Example: Generate ORD- followed by a random 6-digit number
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000).toString();
};


// --- Menu Endpoints (Public) ---

// GET /api/menu - Get all menu items
router.get('/menu', async (req, res) => {
    try {
        // Since this is the first setup, we'll initialize the menu if it's empty
        let menuItems = await Menu.find();
        
        if (menuItems.length === 0) {
            // Seed initial data if the collection is empty
            await Menu.insertMany([
                { name: 'Classic Burger', price: 6.50, description: 'Beef patty, lettuce, tomato, cheese.' },
                { name: 'Veggie Wrap', price: 5.00, description: 'Seasonal vegetables in a whole-wheat wrap.' },
                { name: 'Chicken Salad', price: 7.25, description: 'Grilled chicken breast with mixed greens.' },
                { name: 'French Fries', price: 3.00, description: 'Crispy golden fries.' },
            ]);
            menuItems = await Menu.find();
        }

        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items', error });
    }
});


// --- Order Management Endpoints (Student) ---

// POST /api/order - Place a new order
router.post('/order', async (req, res) => {
    const { customerDetails, items, totalAmount } = req.body;

    if (!customerDetails || !items || items.length === 0 || !totalAmount) {
        return res.status(400).json({ message: 'Missing required order details.' });
    }

    try {
        const newOrderId = generateOrderId();
        const newOrder = new Order({
            orderId: newOrderId,
            customerDetails,
            items,
            totalAmount,
            status: 'Pending'
        });

        await newOrder.save();
        res.status(201).json({ 
            message: 'Order placed successfully!', 
            orderId: newOrderId,
            order: newOrder 
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to place order', error });
    }
});

// GET /api/track/:orderId - Get status of a specific order
router.get('/track/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        res.json({ 
            status: order.status, 
            orderId: order.orderId,
            items: order.items,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order status', error });
    }
});


// --- Admin Endpoints ---

// GET /api/admin/orders - Get all orders (Admin view)
router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders for admin', error });
    }
});

// PUT /api/admin/orders/:orderId/status - Update order status (Admin action)
router.put('/admin/orders/:orderId/status', async (req, res) => {
    const { newStatus } = req.body;
    const allowedStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

    if (!newStatus || !allowedStatuses.includes(newStatus)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status: newStatus, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found for status update.' });
        }

        res.json({ 
            message: 'Order status updated successfully', 
            order: updatedOrder 
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update order status', error });
    }
});

module.exports = router;