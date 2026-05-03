import { Router, Request, Response } from "express";

const router = Router();

// Stub — wire to MongoDB when courses are seeded
router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Courses endpoint — connect MongoDB and seed data", courses: [] });
});

export default router;
