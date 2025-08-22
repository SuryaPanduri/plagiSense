// server/utils/normalize.js
export function normalizeText(s) {
    return (s || "")
      .normalize("NFKC")              // fold weird unicode forms to a common shape
      .replace(/\r/g, " ")
      // keep letters/digits/whitespace and common punctuation; drop the rest
      .replace(/[^\w\s\.,;:\-_"'()/]/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim();
  }
  
  export function splitIntoSentences(text, maxLen = 300) {
    const parts = text.split(/(?<=[\.\?\!])\s+/);
    const chunks = [];
    for (const p of parts) {
      if (p.length <= maxLen) chunks.push(p);
      else for (let i = 0; i < p.length; i += maxLen) chunks.push(p.slice(i, i + maxLen));
    }
    return chunks.filter(Boolean);
  }
  
  export function topDistinctSentences(sentences, limit = 20) {
    const seen = new Set(), out = [];
    for (const s of sentences) {
      const key = s.slice(0, 100);
      if (!seen.has(key) && s.trim().length >= 40) {
        seen.add(key); out.push(s.trim());
        if (out.length >= limit) break;
      }
    }
    return out;
  }