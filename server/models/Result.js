import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  doc1: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  doc2: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  similarity: Number,
  type: String, // text / image
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Result", resultSchema);