import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Button, TextField, Box, Typography, Container, Alert, Paper } from "@mui/material";
import AuthLayout from "../layouts/AuthLayout";
import BrandLogo from "../components/BrandLogo";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/auth/register", { username, email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout>
      <Container component="main" maxWidth="xs" disableGutters>
            <Paper
        elevation={10}
        sx={{
          p: 4,
          borderRadius: 2,
          backdropFilter: "blur(12px)",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.9)"
              : "rgba(30,30,30,0.85)",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow:
              "0 12px 28px rgba(0,0,0,0.18), 0 18px 48px rgba(0,0,0,0.25)",
          },
        }}
>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <BrandLogo size={32} />
            <Typography variant="body2" sx={{ mt: 0.5 }} color="text.secondary">
              Create account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Username" fullWidth required margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Email" type="email" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "inherit", textDecoration: "underline" }}>
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </AuthLayout>
  );
}
