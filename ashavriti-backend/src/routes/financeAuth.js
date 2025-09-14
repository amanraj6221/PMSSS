import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import FinanceUser from "../models/FinanceUser.js";

const router = express.Router();

// 🔑 Register Finance Bureau User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exist = await FinanceUser.findOne({ email });
    if (exist) return res.status(400).json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await FinanceUser.create({ username, email, password: hashed });

    res.json({ success: true, message: "Finance user registered", user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 🔑 Login Finance Bureau User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await FinanceUser.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: "finance" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
