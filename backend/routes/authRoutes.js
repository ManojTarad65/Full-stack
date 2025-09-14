// routes/authRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

dotenv.config();

const router = express.Router();

// Utility: create JWT token
const generateToken = (id) => {
  // payload: user id
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route  POST /api/auth/register
// @desc   Register a new user and return token
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // create user (pre-save hook will hash password)
    const user = await User.create({ name, email, password });

    // return user data + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during register" });
  }
});

// @route  POST /api/auth/login
// @desc   Login user and return token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route  GET /api/auth/me
// @desc   Return current user info (protected route)
router.get("/me", protect, async (req, res) => {
  // protect middleware sets req.user
  if (!req.user) return res.status(401).json({ message: "Not authorized" });
  res.json(req.user);
});

export default router;
