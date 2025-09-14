// C:\Users\Aman Raj\PMSSS\ashavriti-backend\src\routes\sag\sagAuth.routes.js

import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SagBureau from "../../models/SagBureau.js";

const router = Router();

// POST /api/sag/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "username & password required" });
    }

    const exists = await SagBureau.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const doc = await SagBureau.create({ username, password: hashed });

    return res.status(201).json({
      success: true,
      message: "SAG Bureau registered",
      id: doc._id,
    });
  } catch (err) {
    console.error("SAG register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sag/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await SagBureau.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: "SAG_BUREAU" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: "SAG_BUREAU" },
    });
  } catch (err) {
    console.error("SAG login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
