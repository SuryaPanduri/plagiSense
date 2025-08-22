// server/utils/textCompare.js

export function normalizeText(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  
  export function lcsSimilarity(a, b) {
    if (!a || !b) return 0;
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    const l = dp[m][n];
    return Math.max(l / m, l / n); // 0..1
  }
  
  export function ngramSimilarity(textA, textB, n = 3) {
    const wordsA = textA.split(" ");
    const gramsA = new Set();
    for (let i = 0; i <= wordsA.length - n; i++) {
      gramsA.add(wordsA.slice(i, i + n).join(" "));
    }
    const wordsB = textB.split(" ");
    let overlap = 0, total = 0;
    for (let i = 0; i <= wordsB.length - n; i++) {
      total++;
      const gram = wordsB.slice(i, i + n).join(" ");
      if (gramsA.has(gram)) overlap++;
    }
    return total ? overlap / total : 0;
  }
  
  export function sampleNgramHits(a, b, n = 2, limit = 5) {
    const A = a.split(" "), B = b.split(" ");
    const grams = new Set();
    for (let i = 0; i <= A.length - n; i++) grams.add(A.slice(i, i + n).join(" "));
    const hits = [];
    for (let j = 0; j <= B.length - n && hits.length < limit; j++) {
      const g = B.slice(j, j + n).join(" ");
      if (grams.has(g)) hits.push(g);
    }
    return hits;
  }