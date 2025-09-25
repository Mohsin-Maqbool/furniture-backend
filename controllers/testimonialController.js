const Testimonial = require("../models/Testimonial");

exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};

exports.addTestimonial = async (req, res) => {
  try {
    console.log("👉 req.body:", req.body);
    console.log("👉 req.file:", req.file);

    const { name, feedback, rating } = req.body;

    if (!name || !feedback || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const testimonial = new Testimonial({
      name,
      feedback,
      rating: Number(rating), // force convert
      image: req.file ? req.file.filename : "",
    });

    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (err) {
    console.error("❌ Add testimonial error:", err);
    res.status(500).json({ error: "Failed to add testimonial" });
  }
};


exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete testimonial" });
  }
};
