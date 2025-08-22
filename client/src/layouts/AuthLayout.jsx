import { Box, IconButton, Tooltip } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export default function AuthLayout({ children }) {
  const { mode, toggleTheme } = useContext(ThemeContext);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        p: 2,
        position: "relative",
        // soft bokeh / blobs like the mock
        background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, #f9fafb 0%, #e8f5e9 100%)"
              : "linear-gradient(135deg, #0f1216 0%, #1e293b 100%)",
      }}
    >
      <Tooltip title={mode === "light" ? "Switch to dark" : "Switch to light"}>
        <IconButton
          onClick={toggleTheme}
          sx={{ position: "absolute", top: 12, right: 12 }}
          size="large"
          aria-label="toggle theme"
        >
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>

      <Box sx={{ width: "100%", maxWidth: 420 }}>{children}</Box>
    </Box>
  );
}
