const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  qty: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // 1 cart per user
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// virtual: calculate cart total
cartSchema.virtual("cartTotal").get(function () {
  return this.items.reduce((acc, item) => acc + (item.product?.price || 0) * item.qty, 0);
});

module.exports = mongoose.model("Cart", cartSchema);
