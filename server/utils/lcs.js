export function lcs(str1, str2) {
    const m = str1.length, n = str2.length;
    const dp = Array(m+1).fill().map(()=>Array(n+1).fill(0));
  
    for (let i=1; i<=m; i++) {
      for (let j=1; j<=n; j++) {
        if (str1[i-1] === str2[j-1]) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }
    return (dp[m][n] / Math.max(m,n)) * 100; // % similarity
  }