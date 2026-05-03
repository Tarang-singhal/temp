"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Stub — wire to MongoDB when courses are seeded
router.get("/", (_req, res) => {
    res.json({ message: "Courses endpoint — connect MongoDB and seed data", courses: [] });
});
exports.default = router;
