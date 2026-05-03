"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Job_1 = __importDefault(require("../models/Job"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/jobs — list with filters
router.get("/", async (req, res) => {
    try {
        const { search, type, disabilityFriendly, page = "1", limit = "10" } = req.query;
        const filter = { isActive: true };
        if (search)
            filter.$text = { $search: String(search) };
        if (type)
            filter.type = type;
        if (disabilityFriendly === "true")
            filter.disabilityFriendly = true;
        const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));
        const [jobs, total] = await Promise.all([
            Job_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(String(limit))),
            Job_1.default.countDocuments(filter),
        ]);
        res.json({ jobs, total, page: parseInt(String(page)), pages: Math.ceil(total / parseInt(String(limit))) });
    }
    catch {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});
// POST /api/jobs — create (recruiter only)
router.post("/", auth_1.authenticate, (0, auth_1.authorize)("recruiter", "admin"), async (req, res) => {
    try {
        const job = await Job_1.default.create({ ...req.body, recruiter: req.user.id });
        res.status(201).json(job);
    }
    catch {
        res.status(500).json({ error: "Failed to create job" });
    }
});
// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
    try {
        const job = await Job_1.default.findById(req.params.id);
        if (!job) {
            res.status(404).json({ error: "Job not found" });
            return;
        }
        res.json(job);
    }
    catch {
        res.status(500).json({ error: "Failed to fetch job" });
    }
});
exports.default = router;
