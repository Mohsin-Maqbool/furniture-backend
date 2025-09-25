const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional link to user
    name: { type: String, required: true, trim: true },
    feedback: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
