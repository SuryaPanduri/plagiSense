import { useState } from "react";
import API from "../api/api";

import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const Compare = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a file first.");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload
      const { data: uploadRes } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Compare
      const { data: compareRes } = await API.post("/compare", {
        fileId: uploadRes.id,
      });
      setResults(compareRes);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Comparison failed");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <UploadFileIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Upload & Compare
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
            <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {file && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selected: <strong>{file.name}</strong>
              </Typography>
            )}

            <Button type="submit" fullWidth variant="contained">
              Compare
            </Button>
          </Box>

          {results && (
            <Box sx={{ mt: 4, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Comparison Results
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, bgcolor: "#f9f9f9" }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(results, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Compare;