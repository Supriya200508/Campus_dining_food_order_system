const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['Entree', 'Side', 'Drink', 'Dessert', 'Special'], // Example categories
    },
    // NEW: Field to store the relative path (e.g., 'uploads/image-12345.jpg')
    imagePath: { 
        type: String, 
        required: false, // Image is optional
    },
    available: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
