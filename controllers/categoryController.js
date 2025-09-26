const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const slugify = require("slugify");

// ======================
// Categories
// ======================

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });
    const imageUrl = req.file ? req.file.path : null; // 👈 Cloudinary URL

    const category = new Category({
      name: name.trim(),
      slug,
      imageUrl,
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create category",
      error: err.message,
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });
    const updateData = { name: name.trim(), slug };

    if (req.file) {
      updateData.imageUrl = req.file.path; // 👈 Replace with new Cloudinary image
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update category",
      error: err.message,
    });
  }
};

// Delete category + its subcategories
exports.deleteCategory = async (req, res) => {
  try {
    await Subcategory.deleteMany({ category: req.params.id });
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "✅ Deleted category and all its subcategories" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete category",
      error: err.message,
    });
  }
};

// ======================
// Subcategories
// ======================

// Get subcategories of a category
exports.getSubcategories = async (req, res) => {
  try {
    const subs = await Subcategory.find({ category: req.params.id }).sort({
      name: 1,
    });
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch subcategories",
      error: err.message,
    });
  }
};

// Add subcategory
exports.addSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }

    const existing = await Subcategory.findOne({
      name: name.trim(),
      category: req.params.id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Subcategory already exists in this category" });
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });
    const imageUrl = req.file ? req.file.path : null; // 👈 Cloudinary support

    const sub = new Subcategory({
      name: name.trim(),
      slug,
      category: req.params.id,
      imageUrl,
    });

    await sub.save();
    res.status(201).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to create subcategory",
      error: err.message,
    });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Subcategory name is required" });
    }

    const slug = slugify(name.trim(), { lower: true, strict: true });
    const updateData = { name: name.trim(), slug };

    if (req.file) {
      updateData.imageUrl = req.file.path; // 👈 Replace with new Cloudinary image
    }

    const sub = await Subcategory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!sub) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update subcategory",
      error: err.message,
    });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const sub = await Subcategory.findByIdAndDelete(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json({ message: "✅ Deleted subcategory" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to delete subcategory",
      error: err.message,
    });
  }
};
