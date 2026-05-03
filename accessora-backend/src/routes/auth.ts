import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = Router();

const signToken = (id: string, role: string) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET ?? "secret", {
    expiresIn: process.env.JWT_EXPIRE ?? "7d",
  } as jwt.SignOptions);

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
    const user = await User.create({ name, email, password });
    const token = signToken(String(user._id), user.role);
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken(String(user._id), user.role);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
