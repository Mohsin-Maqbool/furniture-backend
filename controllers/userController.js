// server/controllers/userController.js
const User = require("../models/User");

// GET all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


// UPDATE user role
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = req.body.role || user.role;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
