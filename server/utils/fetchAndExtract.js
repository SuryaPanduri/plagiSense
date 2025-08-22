import axios from "axios";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import sanitizeHtml from "sanitize-html";
import he from "he";

export async function fetchMainText(url) {
  try {
    const { data: html } = await axios.get(url, { timeout: 12000 });
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    const raw = (article?.textContent || dom.window.document.body?.textContent || "").toString();
    const cleaned = he.decode(sanitizeHtml(raw, { allowedTags: [], allowedAttributes: {} }));
    return cleaned.replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}