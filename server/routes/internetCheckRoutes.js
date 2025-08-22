import { Router } from "express";
import { checkInternet } from "../controllers/internetCheckController.js";

const router = Router();

// POST /api/check/internet  { docId: "<mongo id>" }
router.post("/internet", authMiddleware, checkInternet);
export default router;