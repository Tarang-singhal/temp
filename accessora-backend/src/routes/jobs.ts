import { Router, Request, Response } from "express";
import Job from "../models/Job";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/jobs — list with filters
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, type, disabilityFriendly, page = "1", limit = "10" } = req.query;
    const filter: Record<string, unknown> = { isActive: true };

    if (search) filter.$text = { $search: String(search) };
    if (type) filter.type = type;
    if (disabilityFriendly === "true") filter.disabilityFriendly = true;

    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: parseInt(String(page)), pages: Math.ceil(total / parseInt(String(limit))) });
  } catch {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// POST /api/jobs — create (recruiter only)
router.post(
  "/",
  authenticate,
  authorize("recruiter", "admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const job = await Job.create({ ...req.body, recruiter: req.user!.id });
      res.status(201).json(job);
    } catch {
      res.status(500).json({ error: "Failed to create job" });
    }
  }
);

// GET /api/jobs/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    res.json(job);
  } catch {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

export default router;
