import { Box } from "@mui/material";

export default function AuthBackground({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #064e3b 100%)",
      }}
    >
      {children}
    </Box>
  );
}
