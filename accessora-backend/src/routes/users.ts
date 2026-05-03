import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import User from "../models/User";

const router = Router();

// GET /api/users/me
router.get("/me", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PATCH /api/users/accessibility
router.patch("/accessibility", authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { accessibilityProfile: req.body },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;
