import express from "express";
import { checkPlagiarism, getResults } from "../controllers/checkController.js";
import { checkInternet } from "../controllers/internetCheckController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router(); // <— ensure NOT express×Router()

router.post("/", authMiddleware, checkPlagiarism);
router.get("/", authMiddleware, getResults);

// NEW:
router.post("/internet", authMiddleware, checkInternet);

export default router;