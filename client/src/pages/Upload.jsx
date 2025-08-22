import { Container, Paper, Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUpload from "../components/FileUpload";

const Upload = () => {
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
          <CloudUploadIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Upload a File
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Select a file to check for plagiarism.
          </Typography>

          <FileUpload />
        </Box>
      </Paper>
    </Container>
  );
};

export default Upload;