const Order = require("../models/Order");

// ✅ Get all orders (Admin)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("user", "name email"); // show customer info
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ✅ Create new order (Customer checkout)
exports.createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod, totals } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = await Order.create({
      user: req.user._id, // from authMiddleware
      products: items,    // save as products
      customerName: req.user.name,
      address,
      paymentMethod,
      totals,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Create order error:", err.message);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// ✅ Update general order details (edit customer/address)
exports.updateOrder = async (req, res) => {
  try {
    const { customerName, address } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (customerName) order.customerName = customerName;
    if (address) order.address = { ...order.address, ...address };

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    console.error("❌ Update order error:", err);
    res.status(500).json({ message: "Failed to update order" });
  }
};


// ✅ Delete order (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("❌ Delete order error:", err.message);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

// ✅ Update only order status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.json({ message: "Order status updated", status: order.status });
  } catch (err) {
    console.error("❌ Update status error:", err.message);
    res.status(500).json({ error: "Failed to update status" });
  }
};
