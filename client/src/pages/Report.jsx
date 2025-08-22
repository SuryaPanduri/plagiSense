import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Container,
  Paper,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await API.get("/reports");
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <DescriptionIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography component="h1" variant="h5">
            Reports
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && reports.length === 0 && !error && (
          <Typography variant="body2" color="text.secondary" align="center">
            No reports found.
          </Typography>
        )}

        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} md={6} key={report.id || report._id}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
              >
                <Typography variant="h6" gutterBottom>
                  {report.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Similarity: {report.similarity}%
                </Typography>
                {report.downloadLink && (
                  <Button
                    href={report.downloadLink}
                    target="_blank"
                    variant="contained"
                    size="small"
                  >
                    Download
                  </Button>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Report;