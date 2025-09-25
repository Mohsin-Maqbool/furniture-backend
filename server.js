const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config"); // MongoDB connection function
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// -------------------------
// Connect DB
// -------------------------
connectDB();

// -------------------------
// CORS - must come BEFORE routes
// -------------------------
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// -------------------------
// Body parsers
// -------------------------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------
// Serve uploaded images
// -------------------------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -------------------------
// Routes
// -------------------------
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cartRoutes"));
// app.use("/api/create-checkout-session", require("./routes/create-checkout-session"));
// app.use("/api/webhook", require("./routes/stripe-webhook"));
app.use("/api/users", require("./routes/userRoutes"));

// -------------------------
// Root route (for testing)
// -------------------------
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// -------------------------
// No app.listen in Vercel
// -------------------------
module.exports = app;
// server/config.js