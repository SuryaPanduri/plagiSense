import {
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const ReportCard = ({ report }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      borderRadius: 3,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <DescriptionIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
    <Typography variant="h6" gutterBottom>
      {report.filename}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Similarity: {report.similarity}%
    </Typography>
    {report.downloadLink && (
      <Box sx={{ mt: 2 }}>
        <Button
          href={report.downloadLink}
          target="_blank"
          variant="contained"
          size="small"
        >
          Download
        </Button>
      </Box>
    )}
  </Paper>
);

export default ReportCard;