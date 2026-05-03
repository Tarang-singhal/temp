"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const courses_1 = __importDefault(require("./routes/courses"));
const community_1 = __importDefault(require("./routes/community"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT ?? 5000;
// ── Security middleware ──────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, morgan_1.default)("dev"));
const limiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api", limiter);
// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", auth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/jobs", jobs_1.default);
app.use("/api/courses", courses_1.default);
app.use("/api/community", community_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Accessora API", timestamp: new Date().toISOString() });
});
// ── Global error handler ────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});
// ── DB + Server ─────────────────────────────────────────
mongoose_1.default
    .connect(process.env.MONGODB_URI ?? "mongodb://localhost:27017/accessora")
    .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Accessora API running on port ${PORT}`));
})
    .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
});
exports.default = app;
