// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CORS: lock this down to your frontend later (Vercel URL)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// --- ensure uploads dir exists (use Render Disk if you need persistence)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// --- connect to Mongo
import mongoose from "mongoose";
const mongoUri = process.env.MONGO_URL;
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

// --- routes
import checkRoutes from "./routes/checkRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // if you have it

app.get("/api/health", (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use("/api/check", checkRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/auth", authRoutes);

// --- start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});