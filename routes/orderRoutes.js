// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// ✅ Customer routes
router.post("/", protect, createOrder); // checkout

// Customer "My Orders"
router.get("/my-orders", protect, async (req, res) => {
  try {
    const myOrders = await require("../models/Order")
      .find({ user: req.user._id })
      .populate("products.product"); // ✅ fixed (was items.product)

    res.json(myOrders);
  } catch (err) {
    console.error("❌ My orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
});

// Admin routes
router.get("/", protect, adminOnly, getOrders);
router.put("/:id", protect, adminOnly, updateOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.delete("/:id", protect, adminOnly, deleteOrder);

module.exports = router;
