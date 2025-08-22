// server/server.js
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ------------------- CORS (manual, bullet-proof) ------------------- */
const ALLOW = (process.env.CLIENT_ORIGIN || "*")
  .split(",")
  .map(s => s.trim().replace(/\/+$/, "")) // strip trailing slash
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = (req.headers.origin || "").replace(/\/+$/, "");

  // allowlist: "*" means allow all; otherwise match exact origin
  if (ALLOW.includes("*") || (origin && ALLOW.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Let preflight exit early
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ------------------- Body & logs ------------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ------------------- Upload dir ------------------- */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

/* ------------------- Mongo ------------------- */
const mongoUri = process.env.MONGO_URL; // use MONGO_URI consistently
if (!mongoUri) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}
mongoose.connect(mongoUri)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(e => {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  });

/* ------------------- Routes ------------------- */
import checkRoutes from "./routes/checkRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import compareRoutes from "./routes/compare.js";
import internetCheckRoutes from "./routes/internetCheckRoutes.js";

app.get("/api/health", (req, res) => res.json({ ok: true, uptime: process.uptime() }));

app.use("/api/check", checkRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/compare", compareRoutes);
app.use("/api/check", internetCheckRoutes); // -> /api/check/internet

/* ------------------- Start ------------------- */
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));