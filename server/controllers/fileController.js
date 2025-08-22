import Document from "../models/Document.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const doc = new Document({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype.includes("image") ? "image" : "text",
    });

    await doc.save();
    res.json({ msg: "File uploaded successfully", doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await Document.find({ userId: req.user.id });
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};