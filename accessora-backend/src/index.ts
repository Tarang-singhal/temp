import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import jobRoutes from "./routes/jobs";
import courseRoutes from "./routes/courses";
import communityRoutes from "./routes/community";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// ── Security middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/community", communityRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Accessora API", timestamp: new Date().toISOString() });
});

// ── Global error handler ────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ── DB + Server ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI ?? "mongodb://localhost:27017/accessora")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Accessora API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

export default app;
