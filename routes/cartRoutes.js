const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");

const router = express.Router();

// ✅ Get user cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  res.json(cart || { items: [] });
});

// ✅ Add item to cart
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty += qty;
  } else {
    cart.items.push({ product: productId, qty });
  }

  await cart.save();
  res.json(cart);
});

// server/routes/cart.js
router.post("/decrease", protect, async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty -= 1;
    if (cart.items[itemIndex].qty <= 0) {
      cart.items.splice(itemIndex, 1);
    }
  }

  await cart.save();
  res.json(cart);
});
// ✅ Update cart item quantity
router.put("/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });  
  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty = qty;
    if (cart.items[itemIndex].qty <= 0) {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();
    return res.json(cart);
  }
  res.status(404).json({ message: "Product not in cart" });
});

// ✅ Remove item from cart
router.delete("/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });


  const itemIndex = cart.items.findIndex((i) => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.json(cart);
  }
  res.status(404).json({ message: "Product not in cart" });
});



module.exports = router;
