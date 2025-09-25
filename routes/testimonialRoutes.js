const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getTestimonials,
  addTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Routes
router.get("/", getTestimonials);
router.post("/", upload.single("image"), addTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
