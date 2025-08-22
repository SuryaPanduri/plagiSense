import { lcs } from "./lcs.js";

/** Reuse your LCS so the % feels consistent with your current DB comparisons. */
export function lcsPercent(a, b) {
  if (!a || !b) return 0;
  return lcs(a, b); // your lcs returns % already
}