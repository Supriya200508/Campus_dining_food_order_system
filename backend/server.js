const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // <-- NEW: Required for serving static files

// Load environment variables (like MONGODB_URI)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdining';

// --- Database Connection ---
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
app.use(cors());
// Set body-parser to accept larger payloads (important for image uploads)
app.use(bodyParser.json({ limit: '5mb' })); 
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// --- Static File Serving (REQUIRED for images) ---
// When the frontend requests http://localhost:3000/uploads/image.jpg, 
// Express serves the file from the local 'uploads' directory.
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <-- NEW

// --- Routes ---
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/menu', menuRoutes);

// --- Simple Test Route ---
app.get('/', (req, res) => {
    res.send('Campus Dining API is running.');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
