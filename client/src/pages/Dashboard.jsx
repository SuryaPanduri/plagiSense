import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Alert,
  Link,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PublicIcon from "@mui/icons-material/Public";
import CloseIcon from "@mui/icons-material/Close";
import API from "../api/api";

const Dashboard = () => {
  const [mode, setMode] = useState(null); // "text" | "image" | "web" | null

  // text compare
  const [doc1, setDoc1] = useState(null);
  const [doc2, setDoc2] = useState(null);

  // image compare
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  // web check
  const [webFile, setWebFile] = useState(null);
  const [webReport, setWebReport] = useState(null);
  const [webErr, setWebErr] = useState("");

  // shared UI state
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/dashboard" && location.state?.reset) {
      setMode(null);
      setResult(null);
      setWebReport(null);
      setWebErr("");
      setDoc1(null); setDoc2(null);
      setImg1(null); setImg2(null);
      setWebFile(null);
    }
  }, [location.pathname]);

  // Handle Text Comparison (your existing /compare flow)
  const handleTextCompare = async () => {
    if (!doc1 || !doc2) {
      setResult("Please upload both text documents.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file1", doc1);
      formData.append("file2", doc2);
      formData.append("type", "text");

      const { data } = await API.post("/compare", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(`Similarity: ${data.similarity.toFixed(2)}%`);
    } catch (err) {
      console.error(err);
      setResult(err.response?.data?.message || "Text comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Comparison (your existing /compare flow)
  const handleImageCompare = async () => {
    if (!img1 || !img2) {
      setResult("Please upload two images.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file1", img1);
      formData.append("file2", img2);
      formData.append("type", "image");

      const { data } = await API.post("/compare", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(`Similarity: ${data.similarity.toFixed(2)}%`);
    } catch (err) {
      console.error(err);
      setResult(err.response?.data?.message || "Image comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Internet Check (upload -> /files/upload, then /check/internet)
  const handleWebCheck = async (e) => {
    e?.preventDefault?.();
    setWebErr("");
    setWebReport(null);
    if (!webFile) {
      setWebErr("Please select a file (.txt, .pdf, .docx).");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", webFile);
      const up = await API.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const docId = up.data?.doc?._id;
      if (!docId) throw new Error("Upload succeeded but docId missing.");

      const { data } = await API.post("/check/internet", { docId });
      setWebReport(data.report);
    } catch (err) {
      console.error(err);
      setWebErr(err.response?.data?.msg || err.response?.data?.error || err.message || "Web check failed.");
    } finally {
      setLoading(false);
    }
  };

  // Common depth style for cards
  const depthStyle = {
    borderRadius: 3,
    backdropFilter: "blur(10px)",
    backgroundColor: (theme) =>
      theme.palette.mode === "light"
        ? "rgba(255,255,255,0.9)"
        : "rgba(25,25,25,0.85)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.18)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.16), 0 18px 45px rgba(0,0,0,0.22)",
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
  <Container maxWidth="lg" sx={{ pb: 2 }}>
        {/* Welcome Header */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
          Welcome to PlagiSense 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Choose a mode below to detect plagiarism in text, images, or across the internet.
        </Typography>

        {mode && (
  <Box sx={{ mb: 3 }}>
    <Button variant="text" onClick={() => setMode(null)}>
      ← Change mode
    </Button>
  </Box>
)}
        {/* Mode Selector */}
{!mode && (
  <Grid
    container
    spacing={{ xs: 2, sm: 3 }}
    sx={{
      alignItems: "stretch",
      flexWrap: { xs: "wrap", md: "nowrap" },   // one row on laptop+
    }}
  >
    {[
      {
        key: "text",
        icon: <InsertDriveFileIcon sx={{ fontSize: 48, color: "primary.main" }} />,
        title: "Text Plagiarism",
        desc: "Upload two text documents to compare for plagiarism.",
        buttonText: "Start Text Detection",
        onClick: () => { setMode("text"); setResult(null); },
        buttonProps: { variant: "contained" }
      },
      {
        key: "image",
        icon: <ImageIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
        title: "Image Plagiarism",
        desc: "Upload two images to compare for plagiarism.",
        buttonText: "Start Image Detection",
        onClick: () => { setMode("image"); setResult(null); },
        buttonProps: { variant: "contained", color: "secondary" }
      },
      {
        key: "web",
        icon: <PublicIcon sx={{ fontSize: 48, color: "success.main" }} />,
        title: "Internet Check",
        desc: "Upload one file to scan against sources on the open web.",
        buttonText: "Start Internet Check",
        onClick: () => { setMode("web"); setWebReport(null); setWebErr(""); },
        buttonProps: { variant: "contained", color: "success" }
      }
    ].map(card => (
      <Grid item xs={12} sm={4} md={4} key={card.key} sx={{ display: "flex" }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            width: "100%",
            height: "100%",                 // equal height
            display: "flex",
            flexDirection: "column",        // stack content
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: (t) =>
              t.palette.mode === "light" ? "rgba(255,255,255,0.9)" : "rgba(25,25,25,0.85)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.18)",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.16), 0 18px 45px rgba(0,0,0,0.22)",
            },
            minHeight: 280,                  // consistent visual height
          }}
        >
          <Box sx={{ mb: 1 }}>{card.icon}</Box>
          <Typography variant="h6" gutterBottom>{card.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {card.desc}
          </Typography>

          {/* spacer pushes button to bottom so all cards match */}
          <Box sx={{ flexGrow: 1 }} />

          <Button fullWidth onClick={card.onClick} {...card.buttonProps}>
            {card.buttonText}
          </Button>
        </Paper>
      </Grid>
    ))}
  </Grid>
)}
        {/* Text Comparison UI */}
        {mode === "text" && (
          <Paper sx={{ p: 4, mt: 4, ...depthStyle }}>
            <Typography variant="h6" gutterBottom>Text Plagiarism Detection</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Document 1
                  <input hidden type="file" accept=".txt,.doc,.docx,.pdf" onChange={(e) => setDoc1(e.target.files[0])} />
                </Button>
                {doc1 && (
                  <Paper sx={{ mt: 1, p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" noWrap>{doc1.name}</Typography>
                    <IconButton size="small" onClick={() => setDoc1(null)}><CloseIcon fontSize="small" /></IconButton>
                  </Paper>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Document 2
                  <input hidden type="file" accept=".txt,.doc,.docx,.pdf" onChange={(e) => setDoc2(e.target.files[0])} />
                </Button>
                {doc2 && (
                  <Paper sx={{ mt: 1, p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" noWrap>{doc2.name}</Typography>
                    <IconButton size="small" onClick={() => setDoc2(null)}><CloseIcon fontSize="small" /></IconButton>
                  </Paper>
                )}
              </Box>
            </Box>

            <Button variant="contained" onClick={handleTextCompare} disabled={loading} sx={{ mb: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Compare Documents"}
            </Button>

            {result && (
              <Paper sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: "#e3f2fd", boxShadow: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {typeof result === "object" ? JSON.stringify(result, null, 2) : result}
                </Typography>
              </Paper>
            )}
          </Paper>
        )}

        {/* Image Comparison UI */}
        {mode === "image" && (
          <Paper sx={{ p: 4, mt: 4, ...depthStyle }}>
            <Typography variant="h6" gutterBottom>Image Plagiarism Detection</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Image 1
                  <input hidden type="file" accept="image/*" onChange={(e) => setImg1(e.target.files[0])} />
                </Button>
                {img1 && (
                  <Paper sx={{ mt: 1, p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={URL.createObjectURL(img1)} alt="Preview 1" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                      <Typography variant="body2" noWrap>{img1.name}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setImg1(null)}><CloseIcon fontSize="small" /></IconButton>
                  </Paper>
                )}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Image 2
                  <input hidden type="file" accept="image/*" onChange={(e) => setImg2(e.target.files[0])} />
                </Button>
                {img2 && (
                  <Paper sx={{ mt: 1, p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img src={URL.createObjectURL(img2)} alt="Preview 2" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                      <Typography variant="body2" noWrap>{img2.name}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setImg2(null)}><CloseIcon fontSize="small" /></IconButton>
                  </Paper>
                )}
              </Box>
            </Box>

            <Button variant="contained" color="secondary" onClick={handleImageCompare} disabled={loading} sx={{ mb: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Compare Images"}
            </Button>

            {result && (
              <Paper sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: "#e8f5e9", boxShadow: 2 }}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {typeof result === "object" ? JSON.stringify(result, null, 2) : result}
                </Typography>
              </Paper>
            )}
          </Paper>
        )}

        {/* Internet Check UI */}
        {mode === "web" && (
          <Paper sx={{ p: 4, mt: 4, ...depthStyle }}>
            <Typography variant="h6" gutterBottom>Internet Check</Typography>

            {webErr && <Alert severity="error" sx={{ mb: 2 }}>{webErr}</Alert>}

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Button variant="outlined" component="label" fullWidth>
                  Choose File (.txt, .pdf, .docx)
                  <input hidden type="file" accept=".txt,.pdf,.docx" onChange={(e) => setWebFile(e.target.files[0])} />
                </Button>
                {webFile && (
                  <Paper sx={{ mt: 1, p: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="body2" noWrap>{webFile.name}</Typography>
                    <IconButton size="small" onClick={() => setWebFile(null)}><CloseIcon fontSize="small" /></IconButton>
                  </Paper>
                )}
              </Box>
            </Box>

            <Button variant="contained" color="success" onClick={handleWebCheck} disabled={loading} sx={{ mb: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Check with Internet"}
            </Button>

            {webReport && (
              <Paper sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: "#f1f8e9", boxShadow: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Overall Similarity: {webReport.overall}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Checked {webReport.checkedUrls?.length || 0} sources • ~{webReport.wordCount} words
                </Typography>

                <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
                  {webReport.matches?.map((m, i) => (
                    <Paper key={i} sx={{ p: 2 }}>
                      <Typography variant="subtitle2">
                        {m.score?.toFixed(2)}% — {m.source || new URL(m.url).hostname.replace(/^www\./,'')}
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
              </Paper>
            )}
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;