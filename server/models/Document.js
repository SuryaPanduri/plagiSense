import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: String,
  filePath: String,
  fileType: String, // text / image
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", documentSchema);