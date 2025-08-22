// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ---------- CORS (single, robust config) ---------- */
const ALLOW = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map(s => s.trim().replace(/\/+$/, "")) // strip trailing slash
  .filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // allow tools like curl/Postman
    const o = origin.replace(/\/+$/, "");
    if (ALLOW.includes("*") || ALLOW.includes(o)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight for all routes

/* ---------- Body & logs ---------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------- Upload dir ---------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ---------- Mongo ---------- */
const mongoUri = process.env.MONGO_URL; // <— use MONGO_URI consistently
if (!mongoUri) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}
mongoose.connect(mongoUri).then(() => {
  console.log("✅ MongoDB Connected");
}).catch((e) => {
  console.error("❌ MongoDB connection error:", e.message);
  process.exit(1);
});

/* ---------- Routes ---------- */
import checkRoutes from "./routes/checkRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import compareRoutes from "./routes/compare.js";
import internetCheckRoutes from "./routes/internetCheckRoutes.js";

app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api/check", checkRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/check", internetCheckRoutes); // exposes /api/check/internet

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});