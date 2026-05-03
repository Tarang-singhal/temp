"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// GET /api/users/me
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
// PATCH /api/users/accessibility
router.patch("/accessibility", auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.user.id, { accessibilityProfile: req.body }, { new: true, runValidators: true });
        res.json(user);
    }
    catch {
        res.status(500).json({ error: "Failed to update profile" });
    }
});
exports.default = router;
