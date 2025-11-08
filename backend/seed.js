const mongoose = require('mongoose');
require('dotenv').config();

// Import the actual Menu model
const MenuItem = require('./models/Menu.model');

// Sample menu items
const sampleItems = [
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    price: 150,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    available: true
  },
  {
    name: "Cheese Pizza",
    description: "Fresh mozzarella cheese on crispy crust",
    price: 200,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    available: true
  },
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice with tender chicken",
    price: 180,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    available: true
  },
  {
    name: "Veg Sandwich",
    description: "Grilled vegetables with cheese",
    price: 80,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
    available: true
  },
  {
    name: "Masala Dosa",
    description: "Crispy dosa with potato filling",
    price: 90,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1694758992138-97f23f2b4e84?w=400",
    available: true
  },
  {
    name: "Paneer Tikka",
    description: "Grilled cottage cheese with spices",
    price: 160,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
    available: true
  },
  {
    name: "French Fries",
    description: "Crispy golden fries",
    price: 60,
    category: "Side",
    imagePath: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
    available: true
  },
  {
    name: "Chocolate Shake",
    description: "Rich chocolate milkshake",
    price: 100,
    category: "Drink",
    imagePath: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
    available: true
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy white sauce pasta",
    price: 170,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    available: true
  },
  {
    name: "Ice Cream Sundae",
    description: "Vanilla ice cream with chocolate sauce",
    price: 80,
    category: "Dessert",
    imagePath: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    available: true
  },
  {
    name: "Chicken Wings",
    description: "Spicy buffalo wings with ranch dressing",
    price: 190,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400",
    available: true
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing",
    price: 120,
    category: "Side",
    imagePath: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    available: true
  },
  {
    name: "Mango Lassi",
    description: "Sweet yogurt drink with mango",
    price: 70,
    category: "Drink",
    imagePath: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400",
    available: true
  },
  {
    name: "Sushi Rolls",
    description: "Assorted fresh sushi rolls",
    price: 250,
    category: "Special",
    imagePath: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    available: true
  },
  {
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie with vanilla ice cream",
    price: 110,
    category: "Dessert",
    imagePath: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400",
    available: true
  },
  {
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter",
    price: 50,
    category: "Side",
    imagePath: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400",
    available: true
  },
  {
    name: "Iced Coffee",
    description: "Cold brew coffee with ice",
    price: 80,
    category: "Drink",
    imagePath: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
    available: true
  },
  {
    name: "Tacos",
    description: "Mexican tacos with beef and salsa",
    price: 140,
    category: "Entree",
    imagePath: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    available: true
  },
  {
    name: "Onion Rings",
    description: "Crispy fried onion rings",
    price: 70,
    category: "Side",
    imagePath: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400",
    available: true
  },
  {
    name: "Tiramisu",
    description: "Classic Italian coffee dessert",
    price: 130,
    category: "Dessert",
    imagePath: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    available: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusdining';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert sample items
    const result = await MenuItem.insertMany(sampleItems);
    console.log(`Successfully added ${result.length} menu items:`);
    result.forEach(item => {
      console.log(`  - ${item.name} (₹${item.price})`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
