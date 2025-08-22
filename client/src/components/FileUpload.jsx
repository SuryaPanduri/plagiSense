import { useState } from "react";
import API from "../api/api";

import {
  Box,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess?.(data);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Choose File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>

          {file && (
            <Typography variant="body2" color="text.secondary">
              Selected: <strong>{file.name}</strong>
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default FileUpload;