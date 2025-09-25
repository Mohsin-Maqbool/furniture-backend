const router = require("express").Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/categoryController");

// Categories
router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

// Subcategories
router.get("/:id/subcategories", getSubcategories);
router.post("/:id/subcategories", addSubcategory);
router.put("/subcategories/:id", updateSubcategory);
router.delete("/subcategories/:id", deleteSubcategory);

module.exports = router;
