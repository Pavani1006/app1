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
      JWT_SECRET, // Ensure this is set in your .env
      { expiresIn: "1h" }
    );

    res.json({ status: "Success", token, userId: user._id, username: user.name });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json("Error during login");
  }
});

// --- Get all users (except logged-in) with optional search ---
router.get("/all", async (req, res) => {
  try {
    // Get the token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.userId;

    // If there's a search query
    const searchKeyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    // Get users excluding the logged-in one
    const users = await UserModel.find(searchKeyword).find({
      _id: { $ne: currentUserId },
    });

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/seed", async (req, res) => {
  console.log("First line of see");
  try {
    const currentToken = req.headers.authorization?.split(" ")[1];

      let currentUser = null;
    if (currentToken) {
      try {
        currentUser = jwt.verify(currentToken, JWT_SECRET);
      } catch (err) {
        console.log("Token invalid:", err.message);
        return res.status(401).json("Invalid token");
      }
    }
    const staticUsers = [
      { name: "Alice", email: "alice@example.com", password: "alice123" },
      { name: "Bob", email: "bob@example.com", password: "bob123" },
      { name: "Shudhhi", email: "shudhhi@gmail.com", password: "Shudhhi123"},
      { name: "Charlie", email: "charlie@example.com", password: "charlie123" },
      { name: "John", email: "johndoe@gmail.com", password: "john123"},
      
    ];
    for (let user of staticUsers) {
      const exists = await UserModel.findOne({ email: user.email });

      if (!exists) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await UserModel.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
        });
      }
    }
    res.status(200).json("Static users inserted (excluding duplicates).");
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json("Seeding failed");
  }
});

router.post("/message", async (req, res) => {
  const { to, content } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const from = decoded.userId;

  const newMessage = await MessageModel.create({ from, to, content });
  res.status(201).json(newMessage);
});

const MessageModel = require("../models/MessageModel"); // ✅ Make sure this line is at the top if not already

// ✅ Fetch messages between logged-in user and selected user
router.get("/messages/:userId", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("Unauthorized");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const currentUserId = decoded.userId;
    const targetUserId = req.params.userId;

    const messages = await MessageModel.find({
      $or: [
        { from: currentUserId, to: targetUserId },
        { from: targetUserId, to: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Sort oldest to latest

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json("Server error");
  }
});


module.exports = router;
