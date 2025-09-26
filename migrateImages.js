require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./utils/cloudinary"); // aapke utils folder ka path
const path = require("path");
const fs = require("fs");

// Models
const Product = require("./models/Product"); // ya Categories
// const Category = require("./models/Category");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateImages() {
  try {
    const products = await Product.find();

    for (let product of products) {
      if (product.image && product.image.startsWith("uploads/")) {
        const localPath = path.join(__dirname, product.image);
        if (!fs.existsSync(localPath)) {
          console.log(`File not found: ${localPath}`);
          continue;
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(localPath, {
          folder: "furniture_app",
        });

        // Update DB
        product.image = result.secure_url;
        await product.save();
        console.log(`Uploaded & updated: ${product.name}`);
      }
    }

    console.log("✅ All images migrated successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrateImages();
