import { Router, Request, Response } from "express";

const router = Router();

router.get("/posts", (_req: Request, res: Response) => {
  res.json({ message: "Community posts endpoint — connect MongoDB", posts: [] });
});

export default router;
