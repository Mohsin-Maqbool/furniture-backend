const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const multer = require("multer");
const slugify = require("slugify");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary"); // ✅ new import
const streamifier = require("streamifier"); // ✅ for buffer upload

// Multer: memory storage (buffer only, no local files)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =========================
// 📌 Helper: resolve category/subcategory name -> ObjectId
// =========================
async function resolveCategoryFields(body) {
  if (body.category && !mongoose.isValidObjectId(body.category)) {
    const foundCategory = await Category.findOne({ name: body.category });
    if (foundCategory) body.category = foundCategory._id;
  }

  if (body.subcategory && !mongoose.isValidObjectId(body.subcategory)) {
    const foundSubcategory = await Subcategory.findOne({ name: body.subcategory });
    if (foundSubcategory) body.subcategory = foundSubcategory._id;
  }

  return body;
}

// =========================
// 📌 Upload to Cloudinary helper
// =========================
function uploadToCloudinary(fileBuffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

// =========================
// 📌 Create product (Admin)
// =========================
router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    let body = await resolveCategoryFields(req.body);

    if (!body.category) delete body.category;
    if (!body.subcategory) delete body.subcategory;

    const { title, price, stock, category, subcategory } = body;
    const slug = slugify(title, { lower: true, strict: true });

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const product = new Product({
      title,
      slug,
      price,
      stock,
      category,
      subcategory,
      description: body.description,
      status: body.status,
      image: imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Create Product Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// 📌 Get all products (with optional category filter)
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// 📌 Update product (Admin)
// =========================
router.put("/:id", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    let updates = await resolveCategoryFields(req.body);

    if (!updates.category) delete updates.category;
    if (!updates.subcategory) delete updates.subcategory;

    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updates.image = imageUrl;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// =========================
// 📌 Delete product (Admin)
// =========================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
// =========================
// =========================