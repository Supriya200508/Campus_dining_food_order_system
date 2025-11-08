const express = require('express');
const router = express.Router();
const Order = require('../models/Order.model');
const MenuItem = require('../models/Menu.model');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer'); // For file uploads
const path = require('path');     // For file path handling
const fs = require('fs');         // For file system operations

// --- Multer Configuration ---
// Defines where files should be stored and how they should be named
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensures the 'uploads' directory exists before saving
        const uploadPath = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Creates a unique filename (e.g., imageFile-1701382490.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// ===============================================
//           ADMIN: MENU MANAGEMENT ROUTES
// ===============================================

// @route   POST /api/order/menu
// @desc    Admin: Create a new menu item with optional image upload
// @access  Private/Admin
router.post('/menu', protect, admin, upload.single('imageFile'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        
        let imagePath = null;
        if (req.file) {
            // Multer saves the full path, we only want the relative path 
            // to store in the database (e.g., 'uploads/image-12345.jpg')
            imagePath = path.join('uploads', path.basename(req.file.path)).replace(/\\/g, '/');
        }

        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imagePath,
        });

        const createdMenuItem = await menuItem.save();
        res.status(201).json(createdMenuItem);

    } catch (error) {
        console.error('Error creating menu item:', error);
        // If an error occurs, and a file was uploaded, attempt to delete it
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete failed upload:', err);
            });
        }
        res.status(500).json({ message: 'Failed to create menu item.' });
    }
});


// @route   GET /api/order/menu
// @desc    Public: Get all available menu items
// @access  Public
// backend/routes/orderRoutes.js
router.get('/menu', async (req, res) => {
    try {
      // Use { available: true } if you want to show only available items
      const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ message: 'Failed to fetch menu.' });
    }
  });
// ===============================================
//           PUBLIC: ORDERING ROUTES
// ===============================================

// @route   POST /api/order
// @desc    Public: Place a new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { customerName, customerEmail, items, totalAmount } = req.body;

        // Generate unique order ID (e.g., ORD-1730185234567)
        const orderId = `ORD-${Date.now()}`;

        const newOrder = new Order({
            orderId,
            customerDetails: {
                name: customerName,
                contact: customerEmail
            },
            items,
            totalAmount,
            // Status defaults to 'Pending' in the model
        });

        const order = await newOrder.save();

        // Simulate payment data/QR code link generation
        const qrCodeData = `ORDER_ID:${order.orderId}|AMOUNT:${order.totalAmount}`;

        res.status(201).json({
            message: 'Order placed successfully.',
            orderId: order.orderId,
            _id: order._id,
            qrCodeData: qrCodeData // Data to generate the QR code on frontend
        });
    } catch (error) {
        console.error('Order placement error:', error);
        res.status(500).json({ message: 'Order placement failed.' });
    }
});

// @route   GET /api/order/track/:id
// @desc    Public: Get status of a specific order by orderId
// @access  Public
router.get('/track/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Search by orderId field (e.g., ORD-1730185234567)
        const order = await Order.findOne({ orderId: orderId });
        
        if (order) {
            res.json({
                id: order.orderId,
                status: order.status,
                items: order.items,
                total: order.totalAmount,
                customer: {
                    name: order.customerDetails.name,
                    phone: order.customerDetails.contact
                },
                placedAt: order.createdAt
            });
        } else {
            res.status(404).json({ message: 'Order not found. Please check your Order ID.' });
        }
    } catch (error) {
        console.error('Error tracking order:', error);
        res.status(500).json({ message: 'Server error while tracking order.' });
    }
});

// ===============================================
//           ADMIN: ORDER MANAGEMENT ROUTES
// ===============================================

// @route   GET /api/order/admin
// @desc    Admin: Get all pending orders (Admin Dashboard)
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
    try {
        // Fetch all orders that are NOT yet completed
        const orders = await Order.find({ status: { $ne: 'Completed' } }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route   POST /api/order/menu
// @desc    Admin: Create a new menu item with optional image upload
// @access  Private/Admin
router.post('/menu', protect, admin, upload.single('imageFile'), async (req, res) => {
    try {
        // 1. Extract Text Data: Get the fields sent from the Angular form.
        const { name, description, price, category } = req.body;
        
        let imagePath = null;
        
        // 2. Handle File Path: Check if Multer successfully processed a file.
        if (req.file) {
            // Multer saves the file to the 'uploads' directory.
            // req.file.path contains the full server path (e.g., C:\...\backend\uploads\image-123.jpg).
            
            // We need the RELATIVE path for the database (e.g., 'uploads/image-123.jpg') 
            // so the frontend can correctly construct the public URL.
            imagePath = path.join('uploads', path.basename(req.file.path)).replace(/\\/g, '/');
        }

        // 3. Create MongoDB Document: Instantiate a new MenuItem model.
        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imagePath, // Save the path
        });

        // 4. Save to Database: Commit the new document.
        const createdMenuItem = await menuItem.save();
        
        // 5. Success Response: Send the newly created document back to the frontend.
        res.status(201).json(createdMenuItem);

    } catch (error) {
        console.error('Error creating menu item:', error);
        
        // 6. Rollback (Critical Step): If the database save fails, delete the file!
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete failed upload:', err);
            });
        }
        
        res.status(500).json({ message: 'Failed to create menu item.' });
    }
});

// @route   PUT /api/order/menu/:id
// @desc    Admin: Update an existing menu item (handles optional image upload)
// @access  Private/Admin
router.put('/menu/:id', protect, admin, upload.single('imageFile'), async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            // Clean up any accidentally uploaded file if the item wasn't found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        // --- 1. Update Text Fields ---
        // We iterate through the fields provided in the body (name, price, category, etc.)
        // and update the document instance.
        const { name, description, price, category, available } = req.body;

        menuItem.name = name || menuItem.name;
        menuItem.description = description || menuItem.description;
        menuItem.price = price !== undefined ? price : menuItem.price;
        menuItem.category = category || menuItem.category;
        menuItem.available = available !== undefined ? (available === 'true') : menuItem.available; 
        
        // --- 2. Handle Image File Replacement ---
        if (req.file) {
            // A new file was uploaded.
            
            // A) Delete the old file from the server
            if (menuItem.imagePath) {
                const oldImagePath = path.join(__dirname, '..', menuItem.imagePath);
                // We use fs.existsSync as a safety check before unlinking
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // B) Save the new relative path
            menuItem.imagePath = path.join('uploads', path.basename(req.file.path)).replace(/\\/g, '/');
        } 
        // NOTE: If req.body.removeImage is true (from a checkbox), we could also add logic here 
        // to delete the image even if no new one was uploaded. For simplicity, we assume
        // a new image upload automatically replaces the old one.

        // --- 3. Save Changes ---
        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);

    } catch (error) {
        console.error('Error updating menu item:', error);
        // Clean up new file if database save fails
        if (req.file) {
             fs.unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete failed upload:', err);
            });
        }
        res.status(500).json({ message: 'Failed to update menu item.' });
    }
});

// @route   DELETE /api/order/menu/:id
// @desc    Admin: Delete a menu item by ID (and delete its image file)
// @access  Private/Admin
router.delete('/menu/:id', protect, admin, async (req, res) => {
    try {
        // 1. Find the item to get its imagePath
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found.' });
        }

        // 2. Delete the associated file from the server
        if (menuItem.imagePath) {
            const fullImagePath = path.join(__dirname, '..', menuItem.imagePath);
            if (fs.existsSync(fullImagePath)) {
                fs.unlinkSync(fullImagePath);
                console.log(`Deleted image file: ${fullImagePath}`);
            }
        }

        // 3. Delete the document from the database
        await MenuItem.deleteOne({ _id: req.params.id }); 
        
        res.json({ message: 'Menu item removed successfully.' });

    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ message: 'Failed to delete menu item.' });
    }
});

module.exports = router;
