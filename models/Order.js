const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        qty: { type: Number, required: true, min: 1 },
      },
    ],
    customerName: { type: String, required: true, trim: true },
    address: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String }, // ✅ optional
      zip: { type: String },   // ✅ optional
    },
    paymentMethod: { 
      type: String, 
      enum: ["COD", "Online"], 
      default: "COD" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["unpaid", "paid", "refunded"], 
      default: "unpaid" 
    },
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0 },
      shipping: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    trackingNumber: { type: String }, // optional for shipping
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
