// updateAdminPassword.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
require("./config"); // MongoDB connection

async function updateAdminPassword() {
  try {
    const email = "mohsin.dev182@gmail.com"; // existing admin email
    const plainPassword = "mohsin@2151";     // desired password

    const hashed = await bcrypt.hash(plainPassword, 10);

    const result = await User.updateOne(
      { email },
      { $set: { password: hashed, role: "admin" } }
    );

    console.log("✅ Admin password updated!", result);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

updateAdminPassword();
