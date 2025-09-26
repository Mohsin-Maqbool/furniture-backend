const router = require("express").Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,   // ✅ plural
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/categoryController");

const { upload } = require("../utils/cloudinary");

// Categories
router.get("/", getCategories);
router.post("/", upload.single("image"), createCategory); 
router.put("/:id", upload.single("image"), updateCategory); 
router.delete("/:id", deleteCategory);

// Subcategories
router.get("/:id/subcategories", getSubcategories);  // ✅ fixed
router.post("/:id/subcategories", addSubcategory);
router.put("/subcategories/:id", updateSubcategory);
router.delete("/subcategories/:id", deleteSubcategory);

module.exports = router;
