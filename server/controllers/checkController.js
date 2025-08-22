import Document from "../models/Document.js";
import Result from "../models/Result.js";
import fs from "fs";
import { lcs } from "../utils/lcs.js";
import { fmmSimilarity } from "../utils/fmm.js";

export const checkPlagiarism = async (req, res) => {
  try {
    const { docId1, docId2 } = req.body;

    const doc1 = await Document.findById(docId1);
    const doc2 = await Document.findById(docId2);

    if (!doc1 || !doc2) return res.status(404).json({ msg: "Documents not found" });

    let similarity = 0;
    let type = "";

    if (doc1.fileType === "text" && doc2.fileType === "text") {
      const text1 = fs.readFileSync(doc1.filePath, "utf-8");
      const text2 = fs.readFileSync(doc2.filePath, "utf-8");
      similarity = lcs(text1, text2);
      type = "text";
    } else if (doc1.fileType === "image" && doc2.fileType === "image") {
      similarity = await fmmSimilarity(doc1.filePath, doc2.filePath);
      type = "image";
    } else {
      return res.status(400).json({ msg: "Cannot compare text with image" });
    }

    const result = new Result({ doc1: doc1._id, doc2: doc2._id, similarity, type });
    await result.save();

    res.json({ msg: "Plagiarism check completed", similarity, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const results = await Result.find().populate("doc1 doc2");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};