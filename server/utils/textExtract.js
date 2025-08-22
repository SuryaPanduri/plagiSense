import fs from "fs";
import path from "path";
// DO NOT: import pdfParse from "pdf-parse";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

export async function extractTextFromFile(filePath, mime = "") {
  const ext = (path.extname(filePath) || "").toLowerCase();
  if (mime.includes("pdf") || ext === ".pdf") {
    const buf = fs.readFileSync(filePath);
    const { text } = await pdfParse(buf);
    return text || "";
  }
  if (ext === ".docx") {
    const buf = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return value || "";
  }
  return fs.readFileSync(filePath, "utf-8");
}