const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// -------------------------
// Cloudinary Config
// -------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. "mycloud123"
  api_key: process.env.CLOUDINARY_API_KEY,       // from Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET, // keep secure
});

// -------------------------
// Multer + Cloudinary Storage
// -------------------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "furniture-ecommerce",   // folder name inside Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
