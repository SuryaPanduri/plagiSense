import { Box } from "@mui/material";
import Navbar from "../components/Navbar";   // adjust path if needed
import Sidebar from "../components/Sidebar"; // if you have one

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f9fafb 0%, #e8f5e9 100%)"
            : "linear-gradient(135deg, #0f1216 0%, #1e293b 100%)",
      }}
    >
      {/* Sidebar (optional) */}
      {Sidebar && <Sidebar />}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar */}
        <Navbar />

        {/* Main content */}
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}