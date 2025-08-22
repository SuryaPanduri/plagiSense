import { Router } from "express";
import { checkInternet } from "../controllers/internetCheckController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ correct path


const router = Router();

// POST /api/check/internet  { docId: "<mongo id>" }
router.post("/internet", authMiddleware, checkInternet);
export default router;