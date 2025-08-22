// server/utils/webSearchBrave.js
import axios from "axios";

function cleanQuery(q, maxLen = 120) {
  if (!q) return "";
  // Remove quotes, keep letters/numbers/basic punctuation
  let s = q
    .replace(/["“”‘’]/g, "")                     // strip quotes
    .replace(/[^a-zA-Z0-9\s\.\,\-\_]/g, " ")     // ✅ safe regex: only ASCII letters/numbers/punct
    .replace(/\s+/g, " ")
    .trim();
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

async function braveSearchOnce(q, key, endpoint) {
  const params = { q, count: 10, safesearch: "off" };
  const { data } = await axios.get(endpoint, {
    params,
    headers: { "X-Subscription-Token": key, Accept: "application/json" },
    timeout: 12000,
    validateStatus: (s) => s < 500 // let 4xx through so we can inspect
  });

  // Handle Brave errors (e.g., 422) gracefully
  if (data?.error) {
    // Uncomment for one-time debugging:
    // console.error("[brave] error:", JSON.stringify(data, null, 2));
    return [];
  }

  const results = data?.web?.results || [];
  return results.map(r => r?.url).filter(Boolean);
}

/**
 * Try quoted queries first (precise), then fall back to unquoted/sanitized if 422/no results.
 */
export async function braveSearchQuoted(queries, maxUrls = 10) {
  const endpoint = process.env.BRAVE_ENDPOINT || "https://api.search.brave.com/res/v1/web/search";
  const key = process.env.BRAVE_API_KEY;
  if (!key) throw new Error("BRAVE_API_KEY missing");

  const urls = new Set();

  for (const raw of queries) {
    if (urls.size >= maxUrls) break;

    // 1) try sanitized but still quoted-ish by adding more context later if needed
    const q1 = cleanQuery(raw);
    if (q1.length < 4) continue;

    // A) Try as-is (no quotes) – Brave is happier with unquoted text
    let got = await braveSearchOnce(q1, key, endpoint);

    // B) If empty, try a shorter core (first 12 words)
    if (got.length === 0) {
      const q2 = q1.split(" ").slice(0, 12).join(" ");
      if (q2.length >= 4) got = await braveSearchOnce(q2, key, endpoint);
    }

    // C) If still empty, try a keyword-y version (drop stopwords)
    if (got.length === 0) {
      const stop = new Set(["the","a","an","and","or","but","if","then","with","for","on","in","to","of","by","at","from","as","is","are","was","were","be","been"]);
      const q3 = q1.split(" ").filter(w => !stop.has(w.toLowerCase())).slice(0, 10).join(" ");
      if (q3.length >= 4) got = await braveSearchOnce(q3, key, endpoint);
    }

    for (const u of got) {
      urls.add(u);
      if (urls.size >= maxUrls) break;
    }
  }

  return Array.from(urls);
}