const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");

const { getUsers, updateUser, deleteUser } = require("../controllers/userController");

// Admin-only user management
router.get("/", protect, adminOnly, getUsers);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
