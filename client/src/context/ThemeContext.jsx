import { createContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

export const ThemeContext = createContext({ mode: "light", toggleTheme: () => {} });

export default function ThemeProviderWrapper({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#22C55E" }, // fresh green like your design
          background: {
            default: mode === "light" ? "#ffffff" : "#0f1216",
            paper: mode === "light" ? "#f6f7f9" : "#14181d",
          },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: { boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                "& fieldset": { borderColor: mode === "light" ? "#e5e7eb" : "#2a313a" },
                "&:hover fieldset": { borderColor: mode === "light" ? "#cfd5df" : "#3a424e" },
              },
              input: { padding: "14px 12px" },
            },
          },
          MuiButton: {
            styleOverrides: { root: { textTransform: "none", fontWeight: 600, height: 44 } },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
