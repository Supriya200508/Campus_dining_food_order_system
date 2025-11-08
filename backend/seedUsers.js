const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema (matching User.js model)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Sample users
const sampleUsers = [
  {
    name: "Student User",
    username: "student@university.edu",
    password: "student123",
    role: "student"
  },
  {
    name: "Admin User",
    username: "admin@university.edu",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Test Student",
    username: "test@student.edu",
    password: "test123",
    role: "student"
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdining';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert sample users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Added user: ${user.username} (${user.role})`);
    }

    console.log('\n✅ Users seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('  Student: student@university.edu / student123');
    console.log('  Admin: admin@university.edu / admin123');
    console.log('  Test: test@student.edu / test123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
