const express = require("express");
const serverless = require("serverless-http"); // 👈 Uncomment only for Vercel
require("dotenv").config();
const connectDB = require("../config/db"); // Make sure db.js is in config folder
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// -------------------------
// Connect DB
// -------------------------
connectDB();

// -------------------------
// CORS
// -------------------------
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// -------------------------
// Body parsers
// -------------------------
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------
// Serve uploads (⚠️ Vercel has no local storage)
// -------------------------
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// -------------------------
// Routes
// -------------------------
app.use("/api/testimonials", require("../routes/testimonialRoutes"));
app.use("/api/auth", require("../routes/auth"));
app.use("/api/products", require("../routes/products"));
app.use("/api/categories", require("../routes/categories"));
app.use("/api/orders", require("../routes/orders"));
app.use("/api/cart", require("../routes/cartRoutes"));
app.use("/api/users", require("../routes/userRoutes"));

// -------------------------
// Root test route
// -------------------------
app.get("/", (req, res) => {
  res.send("✅ Server is running (local mode)");
});

// -------------------------
// Export
// -------------------------
// For local dev
// module.exports = app;

// For Vercel deployment (later):
module.exports = serverless(app);
