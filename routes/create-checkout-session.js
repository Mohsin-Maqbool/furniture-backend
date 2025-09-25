// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const Order = require("../models/Order");
// const Product = require("../models/Product"); // ✅ import product model
// const { protect } = require("../middleware/authMiddleware");
// require("dotenv").config();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ✅ Stripe checkout
// router.post("/", protect, async (req, res) => {
//   console.log("Stripe key in route:", process.env.STRIPE_SECRET_KEY);

//   try {
//     const { cartItems, address, orderId } = req.body;

//     if (!orderId) {
//       return res.status(400).json({ error: "OrderId is required" });
//     }

//     // Fetch order for validation
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // ✅ Fetch actual product details
//     const lineItems = await Promise.all(
//       cartItems.map(async (i) => {
//         const prod = await Product.findById(i.productId);

//         if (!prod) {
//           throw new Error(`Product not found: ${i.productId}`);
//         }

//         return {
//           price_data: {
//             currency: "pkr",
//             product_data: { name: prod.name },
//             unit_amount: prod.price * 100, // Stripe amount is in paisa
//           },
//           quantity: i.qty,
//         };
//       })
//     );

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/orders?success=true`,
//       cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
//       metadata: { orderId },
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe session error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// Note: The above code is commented out to disable Stripe payment integration as per recent changes.
// If you wish to re-enable Stripe payments, uncomment the code and ensure all dependencies and environment variables are correctly set up.