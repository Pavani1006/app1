const express = require("express");
const UserModel = require("../models/UserModel");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
require('dotenv').config();
// --- Signup Route ---
router.post("/signup", async (req, res) => {
  const { name, email, password, pic } = req.body;
      try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json("Exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashedPassword, pic });
        const token = jwt.sign({ userId: newUser._id, username: newUser.name }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ status: "Success",token, userId: newUser._id, username: newUser.name });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json("Error creating user");
    }
});

// --- Login Route ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json("No such record exist");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json("Password is incorrect");
    }

    const token = jwt.sign(
      { userId: user._id, username: user.name },
      process.env.JWT_SECRET, // Ensure this is set in your .env
      { expiresIn: "1h" }
    );

    res.json({ status: "Success", token, userId: user._id, username: user.name });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json("Error during login");
  }
});


module.exports = router;
