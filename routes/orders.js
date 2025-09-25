const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ------------------------
// CREATE ORDER
// ------------------------
router.post("/", protect, async (req, res) => {
  try {
    console.log("📦 Incoming Order Request Body:", req.body);

    const { items, address, paymentMethod, totals } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!address?.name || !address?.phone || !address?.line1)
      return res.status(400).json({ message: "Complete address is required" });

    const orderId = "ORD" + Date.now().toString().slice(-6);

    const order = new Order({
      orderId,
      user: req.user._id,
      customerName: address.name,
      items: items.map((i) => ({ product: i.product, qty: i.qty })),
      address,
      paymentMethod: paymentMethod === "Stripe" ? "Online" : paymentMethod,
      totals,
      status: "pending", // always start as pending
    });

    await order.save();
    await order.populate("items.product", "name price");

    res.status(201).json(order);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// GET MY ORDERS
// ------------------------
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price");

    res.json(orders);
  } catch (err) {
    console.error("Get My Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// GET ALL ORDERS (ADMIN)
// ------------------------
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Get All Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// UPDATE ORDER (customer/address)
// ------------------------
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { customerName, address } = req.body;

    if (!customerName || !address?.name || !address?.phone || !address?.line1)
      return res.status(400).json({ message: "Complete customer info required" });

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { customerName, address },
      { new: true }
    ).populate("items.product", "name price");

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// UPDATE ORDER STATUS
// ------------------------
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status required" });

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.product", "name price");

    if (!updated) return res.status(404).json({ message: "Order not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// DELETE SINGLE ORDER
// ------------------------
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ------------------------
// DELETE ALL ORDERS (ADMIN)
// ------------------------
router.delete("/", protect, adminOnly, async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders deleted" });
  } catch (err) {
    console.error("Delete All Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
