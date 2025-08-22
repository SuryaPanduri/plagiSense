import Result from "../models/Result.js";
import { checkAgainstInternet } from "../services/internetCheck.js";

export const checkInternet = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!docId) return res.status(400).json({ msg: "docId required" });

    const report = await checkAgainstInternet({ docId });

    const saved = await Result.create({
      doc1: docId,
      similarity: report.overall,
      type: "web",
      createdAt: new Date()
    });

    res.json({ report, resultId: saved._id });
  } catch (e) {
    console.error("checkInternet error:", e);
    res.status(500).json({ error: e.message });
  }
};