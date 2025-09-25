// server/routes/cart.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const Setting = require("../models/Setting"); // ✅ shipping/tax rules

const router = express.Router();

// Helper → calculate totals
const calcTotals = async (items) => {
  const settings = await Setting.findOne() || { taxRate: 0.02, shippingFee: 100, freeShippingAbove: 1000 };

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const tax = subtotal * settings.taxRate;
  const shippingFee = subtotal > settings.freeShippingAbove ? 0 : settings.shippingFee;
  const total = subtotal + tax + shippingFee;

  return { subtotal, tax, shippingFee, total };
};

// ✅ Get user cart
router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.json({ items: [], subtotal: 0, tax: 0, shippingFee: 0, total: 0 });

  const totals = await calcTotals(cart.items);
  res.json({ items: cart.items, ...totals });
});

// ✅ Add item
router.post("/add", protect, async (req, res) => {
  const { productId, qty } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty += qty;
  } else {
    cart.items.push({ product: productId, qty });
  }

  await cart.save();
  await cart.populate("items.product");
  const totals = await calcTotals(cart.items);
  res.json({ items: cart.items, ...totals });
});

// ✅ Decrease qty
router.post("/decrease", protect, async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty -= 1;
    if (cart.items[itemIndex].qty <= 0) cart.items.splice(itemIndex, 1);
  }

  await cart.save();
  await cart.populate("items.product");
  const totals = await calcTotals(cart.items);
  res.json({ items: cart.items, ...totals });
});

// ✅ Update qty
router.put("/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].qty = qty;
    if (qty <= 0) cart.items.splice(itemIndex, 1);
  }

  await cart.save();
  await cart.populate("items.product");
  const totals = await calcTotals(cart.items);
  res.json({ items: cart.items, ...totals });
});

// ✅ Remove item
router.delete("/:productId", protect, async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  await cart.populate("items.product");
  const totals = await calcTotals(cart.items);
  res.json({ items: cart.items, ...totals });
});

module.exports = router;
