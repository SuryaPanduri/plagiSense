import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <AppBar position="static" elevation={0} sx={{ mb: 4, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
      <Toolbar>
        <Box component={Link} to="/dashboard" sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1, color: "inherit", textDecoration: "none" }}
        onClick={() => navigate("/dashboard", { state: { reset: true } })}>
          <BrandLogo size={24} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button color="inherit" component={Link} to="/upload">Upload</Button>
          <Button color="inherit" component={Link} to="/compare">Compare</Button>
          <Button color="inherit" component={Link} to="/report">Reports</Button>
          <Button color="inherit" component={Link} to="/internet-check">
  Web Check
</Button>
          <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
            <IconButton color="inherit" onClick={toggleTheme} size="small" aria-label="toggle theme">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          {user ? (
            <Button color="secondary" variant="contained" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
