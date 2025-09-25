// const express = require("express");
// const Stripe = require("stripe");
// const Order = require("../models/Order");
// const { authMiddleware } = require("../middleware/auth");

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// router.post("/create-checkout-session", authMiddleware, async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const order = await Order.findById(orderId).populate("items.product");

//     if (!order) return res.status(404).json({ error: "Order not found" });

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: order.items.map(i => ({
//         price_data: {
//           currency: "pkr",
//           product_data: { name: i.product.name },
//           unit_amount: i.product.price * 100,
//         },
//         quantity: i.qty,
//       })),
//       success_url: `${process.env.CLIENT_URL}/orders?success=true`,
//       cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error("Stripe error:", err);
//     res.status(500).json({ error: "Stripe session failed" });
//   }
// });

// module.exports = router;
// Note: The above code is commented out to disable Stripe payment integration as per recent changes.
// If you wish to re-enable Stripe payments, uncomment the code and ensure all dependencies and environment variables are correctly set up.