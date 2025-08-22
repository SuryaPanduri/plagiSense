import express from "express";
import multer from "multer";
import fs from "fs";
import { lcs } from "../utils/lcs.js";
import { fmmSimilarity } from "../utils/fmm.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.fields([{ name: "file1" }, { name: "file2" }]), async (req, res) => {
  try {
    const { type } = req.body;
    const file1 = req.files?.file1?.[0];
    const file2 = req.files?.file2?.[0];
    console.log("📂 Received files:", {
      file1: file1 ? { path: file1.path, originalname: file1.originalname, size: file1.size } : null,
      file2: file2 ? { path: file2.path, originalname: file2.originalname, size: file2.size } : null,
      type,
    });

    if (!file1 || !file2) {
      return res.status(400).json({ message: "Both files are required" });
    }

    const file1Path = file1.path;
    const file2Path = file2.path;

    let similarity = 0;

    if (type === "text") {
      const text1 = fs.readFileSync(file1Path, "utf-8");
      const text2 = fs.readFileSync(file2Path, "utf-8");
      similarity = lcs(text1, text2);
    } else if (type === "image") {
      similarity = await fmmSimilarity(file1Path, file2Path);
    } else {
      return res.status(400).json({ message: "Invalid comparison type" });
    }

    // cleanup
    fs.unlinkSync(file1Path);
    fs.unlinkSync(file2Path);

    res.json({ similarity });
  } catch (err) {
    console.error("❌ Compare route error:", err);
    res.status(500).json({ message: "Comparison failed" });
  }
});

export default router;