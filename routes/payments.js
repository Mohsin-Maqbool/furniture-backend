// const express = require("express");
// const router = express.Router();
// const Stripe = require("stripe");
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // add your Stripe secret key in .env

// // Create payment intent
// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     const { amount } = req.body; // amount in smallest currency unit (paisa)
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "pk", // replace with your currency like "usd" or "inr"
//       automatic_payment_methods: { enabled: true },
//     });
//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     console.error("Stripe Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// Note: The above code is commented out to disable Stripe payment integration as per recent changes.
// If you wish to re-enable Stripe payments, uncomment the code and ensure all dependencies and environment variables are correctly set up.