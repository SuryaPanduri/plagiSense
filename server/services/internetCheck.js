// server/services/internetCheck.js

import Document from "../models/Document.js";
import { extractTextFromFile } from "../utils/textExtract.js";
import { braveSearchQuoted } from "../utils/webSearchBrave.js";
import { fetchMainText } from "../utils/fetchAndExtract.js";
import { canonicalize, domainLabel } from "../utils/url.js";

import {
  normalizeText,       // lowercases, strips punctuation, collapses spaces
  lcsSimilarity,       // 0..1
  ngramSimilarity,     // 0..1
  sampleNgramHits      // small overlapping phrase samples
} from "../utils/textCompare.js";

// -------- helpers for web search sampling --------
function splitIntoSentences(text, maxLen = 300) {
  const parts = text.split(/(?<=[\.\?\!])\s+/);
  const out = [];
  for (const p of parts) {
    if (p.length <= maxLen) out.push(p);
    else for (let i = 0; i < p.length; i += maxLen) out.push(p.slice(i, i + maxLen));
  }
  return out.filter(Boolean);
}

function topDistinctSentences(sentences, limit = 20) {
  const seen = new Set();
  const out = [];
  for (const s of sentences) {
    const key = s.slice(0, 100);
    if (!seen.has(key) && s.trim().length >= 40) {
      seen.add(key);
      out.push(s.trim());
      if (out.length >= limit) break;
    }
  }
  return out;
}

// -------------------- main --------------------
export async function checkAgainstInternet({ docId }) {
  console.log("[web-check] starting, docId=", docId);

  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");

  // 1) Extract + normalize uploaded doc
  const raw = await extractTextFromFile(doc.filePath, doc.fileType);
  const docNorm = normalizeText(raw);
  const wordCount = docNorm ? docNorm.split(/\s+/).length : 0;

  if (!docNorm || docNorm.length < 60) {
    return { overall: 0, matches: [], wordCount, checkedUrls: [] };
  }

  // 2) Build queries
  const sentences = splitIntoSentences(docNorm, 300);
  const queries = topDistinctSentences(
    sentences,
    Number(process.env.INTERNET_CHECK_TOP_SENTENCES) || 20
  );

  // 3) Brave search (defensive)
  let candidateUrls = [];
  try {
    candidateUrls = await braveSearchQuoted(
      queries,
      Number(process.env.INTERNET_CHECK_MAX_URLS) || 10
    );
  } catch (e) {
    console.warn("[web-check] Brave search failed:", e?.message || e);
    candidateUrls = [];
  }

  // 4) Fetch + extract readable text
  const pages = [];
  for (const url of candidateUrls) {
    try {
      const pageText = await fetchMainText(url);
      if (pageText && pageText.length > 200) {
        pages.push({ url, text: normalizeText(pageText) });
      }
    } catch {
      // ignore individual fetch/parse issues
    }
  }

  // 4b) Dedupe by canonical URL
  const seen = new Set();
  const uniquePages = [];
  for (const p of pages) {
    const key = canonicalize(p.url);
    if (!seen.has(key)) {
      seen.add(key);
      uniquePages.push({ ...p, url: key });
    }
  }

  // 5) Score each page with soft‑LCS + n‑gram
  const matches = [];
  for (const page of uniquePages) {
    const lcsScore = lcsSimilarity(docNorm, page.text);         // 0..1
    const ngramScore = ngramSimilarity(docNorm, page.text, 2);  // 0..1, n=2 for web
    const finalScore = Math.max(lcsScore * 0.8, ngramScore);    // slight tilt to n‑gram

    const hits = sampleNgramHits(docNorm, page.text, 2, 5);     // evidence phrases

    matches.push({
      url: page.url,
      source: domainLabel(page.url),
      score: Math.round(finalScore * 10000) / 100,     // as %
      lcsScore: Math.round(lcsScore * 10000) / 100,    // as %
      ngramScore: Math.round(ngramScore * 10000) / 100,// as %
      snippet: page.text.slice(0, 180),
      hits
    });
  }

  // 6) Sort + weighted overall (top‑5 with diminishing weights)
  matches.sort((a, b) => b.score - a.score);

  const topK = matches.slice(0, 5);
  const weights = [1.0, 0.8, 0.6, 0.4, 0.3].slice(0, topK.length);
  const denom = weights.reduce((a, b) => a + b, 0);
  const overallPct = topK.length
    ? Math.min(
        100,
        topK.reduce((acc, m, i) => acc + m.score * weights[i], 0) / denom
      )
    : 0;

  return {
    overall: Math.round(overallPct * 100) / 100,
    matches,
    wordCount,
    checkedUrls: candidateUrls
  };
}