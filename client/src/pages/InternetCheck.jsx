import { useState } from "react";
import API from "../api/api";
import { Container, Paper, Box, Typography, Button, Alert, Link } from "@mui/material";

export default function InternetCheck() {
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async (e) => {
    e.preventDefault();
    setErr(""); setReport(null);
    if (!file) return setErr("Please select a file.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const up = await API.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const docId = up.data.doc?._id;
      const { data } = await API.post("/check/internet", { docId });
      setReport(data.report);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 6, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>Check Against Internet</Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

        <Box component="form" onSubmit={handleRun} sx={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button variant="outlined" component="label">
            Choose File (.txt, .pdf, .docx)
            <input hidden type="file" accept=".txt,.pdf,.docx" onChange={(e)=>setFile(e.target.files[0])}/>
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Checking..." : "Check with Internet"}
          </Button>
        </Box>

        {report && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Overall Similarity: {report.overall}%</Typography>
            <Typography variant="body2" color="text.secondary">
              Checked {report.checkedUrls.length} sources • ~{report.wordCount} words
            </Typography>

            <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
              {report.matches.map((m, i) => (
                <Paper key={i} sx={{ p: 2 }}>
                  <Typography variant="subtitle2">
                    {m.score.toFixed(2)}% — {m.source || new URL(m.url).hostname.replace(/^www\./,'')}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                    n‑gram: {m.ngramScore?.toFixed(2)}% • LCS: {m.lcsScore?.toFixed(2)}%
                  </Typography>
                  {m.hits?.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                      Overlaps: {m.hits.join(" · ")}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ my: 1 }}>
                    {m.snippet}
                  </Typography>
                  <Link href={m.url} target="_blank" rel="noreferrer">Open source</Link>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}