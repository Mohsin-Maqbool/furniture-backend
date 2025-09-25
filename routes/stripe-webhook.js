// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const Order = require("../models/Order");

// router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     console.log("Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const cart = JSON.parse(session.metadata.cart);
//     const address = JSON.parse(session.metadata.address);

//     // Save order to DB
//     await Order.create({
//       items: cart.map(i => ({ product: i.product._id, qty: i.qty })),
//       address,
//       paymentMethod: "Stripe",
//       totals: {
//         subtotal: cart.reduce((sum, i) => sum + i.qty * i.product.price, 0),
//         shipping: 0,
//         tax: 0,
//         total: cart.reduce((sum, i) => sum + i.qty * i.product.price, 0),
//       },
//       paymentId: session.payment_intent,
//     });

//     console.log("✅ Order created from Stripe Checkout");
//   }

//   res.json({ received: true });
// });

// module.exports = router;

// Note: The above code is commented out to disable Stripe webhook handling as per recent changes.
// If you wish to re-enable Stripe payments, uncomment the code and ensure all dependencies and environment variables are correctly set up.