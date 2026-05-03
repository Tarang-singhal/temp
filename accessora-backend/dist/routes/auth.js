"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
const signToken = (id, role) => jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET ?? "secret", {
    expiresIn: process.env.JWT_EXPIRE ?? "7d",
});
// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            res.status(400).json({ error: "Email already registered" });
            return;
        }
        const user = await User_1.default.create({ name, email, password });
        const token = signToken(String(user._id), user.role);
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});
// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = signToken(String(user._id), user.role);
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    }
    catch {
        res.status(500).json({ error: "Login failed" });
    }
});
exports.default = router;
