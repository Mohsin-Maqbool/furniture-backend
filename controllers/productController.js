// const Product = require("../models/Product");

// // Get all products
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find()
//       .populate("category", "name slug")
//       .sort({ createdAt: -1 });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch products", error: err.message });
//   }
// };

// // Create product
// exports.createProduct = async (req, res) => {
//   try {
//     const { title, price, discountPrice, stock, category, subcategory, description, status } = req.body;

//     const image = req.file ? req.file.path : null; // if using multer for uploads

//     const product = await Product.create({
//       title,
//       price,
//       discountPrice,
//       stock,
//       category,
//       subcategory,
//       description,
//       status,
//       image,
//     });

//     res.status(201).json(product);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to create product", error: err.message });
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   try {
//     const updates = { ...req.body };
//     if (req.file) updates.image = req.file.path;

//     const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });

//     if (!product) return res.status(404).json({ message: "Product not found" });

//     res.json(product);
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update product", error: err.message });
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "✅ Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete product", error: err.message });
//   }
// };
