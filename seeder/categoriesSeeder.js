const mongoose = require("mongoose");
const Category = require("../models/Category");

const MONGO_URI = "mongodb://127.0.0.1:27017/yourdbname"; // change to your DB

const categories = [
  { name: "Beds", subcategories: ["Single Bed", "Double Bed", "King Size"] },
  { name: "Dining Tables", subcategories: ["4 Seater", "6 Seater", "8 Seater"] },
  { name: "Sofas", subcategories: ["2 Seater", "3 Seater", "L Shape"] },
  { name: "Chairs", subcategories: ["Office Chair", "Dining Chair"] },
  { name: "Wardrobes" },
  { name: "Office Furniture" },
  { name: "Outdoor Furniture" },
  { name: "Decor" },
  { name: "Uncategorized" },
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log("✅ Categories seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
})();
