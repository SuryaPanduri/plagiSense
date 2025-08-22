import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import InsightsIcon from "@mui/icons-material/Insights";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CompareIcon from "@mui/icons-material/Compare";
import DescriptionIcon from "@mui/icons-material/Description";

import BrandLogo from "../components/BrandLogo";

export default function Home() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState("register"); // ✅ default pill on Register

  const features = [
    {
      title: "Text Detection",
      description:
        "Compare documents in seconds using precise LCS analysis for high accuracy.",
      icon: <TextSnippetIcon color="primary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Image Analysis",
      description:
        "Spot image duplication with FMM, even when resized or subtly modified.",
      icon: <ImageIcon color="secondary" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Detailed Reports",
      description:
        "Receive clear similarity scores, highlighted matches, and downloadable summaries.",
      icon: <AssessmentIcon color="success" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Secure Access",
      description:
        "JWT powered authentication keeps your data and history private & safe.",
      icon: <SecurityIcon color="error" sx={{ fontSize: 40 }} />,
    },
    {
      title: "Fast Processing",
      description: "Enjoy quick uploads and lightning-fast analysis results.",
      icon: <SpeedIcon color="warning" sx={{ fontSize: 40 }} />,
    },
    {
      title: "AI-Enhanced Insight",
      description:
        "Get originality scores, writing pattern evaluation, and improvement tips.",
      icon: <InsightsIcon sx={{ fontSize: 40, color: "#0ea5e9" }} />,
    },
  ];

  const steps = [
    {
      title: "1. Upload Files",
      description:
        "Select the text documents or images you want to compare for originality.",
      icon: <UploadFileIcon sx={{ fontSize: 48, color: "primary.main" }} />,
    },
    {
      title: "2. Compare Instantly",
      description:
        "Let our LCS (text) and FMM (image) algorithms process your files swiftly.",
      icon: <CompareIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
    },
    {
      title: "3. Review Your Report",
      description:
        "See similarity percentages, highlights, and download complete results.",
      icon: <DescriptionIcon sx={{ fontSize: 48, color: "success.main" }} />,
    },
  ];

  const testimonials = [
    {
      quote:
        "PlagiSense helped me ensure originality in minutes — a total game-changer for my research.",
      author: "— Alice R., Graduate Student",
    },
    {
      quote:
        "Our team now catches unintended matches instantly. Efficient, precise, and reliable.",
      author: "— Dev Team Lead, EduTech Inc.",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f9fafb 0%, #e8f5e9 100%)"
            : "linear-gradient(135deg, #0f1216 0%, #1e293b 100%)",
      }}
    >
      {/* ✅ Sliding Pill Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <BrandLogo size={32} />
          <Box sx={{ flexGrow: 1 }} />

          {/* Container with sliding pill */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              gap: 2,
              bgcolor: "rgba(0,0,0,0.04)",
              p: 0.5,
              borderRadius: "999px",
              width: 220,
            }}
          >
            {/* Sliding pill */}
            <motion.div
              layout
              animate={{
                left: hovered === "login" ? 0 : "50%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "50%",
                height: "100%",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
                zIndex: 0,
              }}
            />

            {/* Login */}
            <Button
              onMouseEnter={() => setHovered("login")}
              onClick={() => navigate("/login")}
              sx={{
                flex: 1,
                borderRadius: "999px",
                fontWeight: "bold",
                color: hovered === "login" ? "#fff" : "text.primary",
                zIndex: 1,
                textTransform: "none",
              }}
            >
              Login
            </Button>

            {/* Register */}
            <Button
              onMouseEnter={() => setHovered("register")}
              onClick={() => navigate("/register")}
              sx={{
                flex: 1,
                borderRadius: "999px",
                fontWeight: "bold",
                color: hovered === "register" ? "#fff" : "text.primary",
                zIndex: 1,
                textTransform: "none",
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
        {/* Hero Section */}
        <Box sx={{ pt: 10, pb: 10 }}>
          <Container maxWidth="xl">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    background:
                      "linear-gradient(90deg, #22c55e, #14b8a6, #3b82f6, #16a34a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "300% auto",
                    animation: "gradientFlow 6s linear infinite",
                    "@keyframes gradientFlow": {
                      "0%": { backgroundPosition: "0% center" },
                      "100%": { backgroundPosition: "300% center" },
                    },
                  }}
                >
                  Detect Plagiarism. Fast. Accurate. Secure.
                </Typography>
  
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Upload text or images, compare instantly, and get clear reports—all in one place.
                </Typography>
  
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: "bold",
                    background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    boxShadow: "0 0 15px rgba(34,197,94,0.6)",
                    animation: "pulseGlow 3s ease-in-out infinite",
                    "@keyframes pulseGlow": {
                      "0%": {
                        boxShadow: "0 0 10px rgba(34,197,94,0.6)",
                        transform: "scale(1)",
                      },
                      "50%": {
                        boxShadow:
                          "0 0 25px rgba(34,197,94,0.8), 0 0 45px rgba(22,163,74,0.5)",
                        transform: "scale(1.05)",
                      },
                      "100%": {
                        boxShadow: "0 0 10px rgba(34,197,94,0.6)",
                        transform: "scale(1)",
                      },
                    },
                    "&:hover": {
                      transform: "scale(1.07)",
                      background: "linear-gradient(90deg, #16a34a, #22c55e)",
                      boxShadow:
                        "0 0 35px rgba(34,197,94,0.8), 0 0 60px rgba(22,163,74,0.6)",
                    },
                  }}
                >
                  Ready to Protect Your Content – Get Started
                  <ArrowForwardIcon />
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
  
      {/* Why Choose PlagiSense */}
{/* Why Choose PlagiSense */}
<Box
  sx={{
    pb: 3, // keep good bottom spacing
    background: (theme) =>
      theme.palette.mode === "light"
        ? "linear-gradient(135deg, #f9fafb 0%, #eefcf3 100%)"
        : "linear-gradient(135deg, #0f1216 0%, #1e293b 100%)",
  }}
>
  <Container maxWidth="xl">
    <Typography
      variant="h4"
      sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
    >
      Why Choose PlagiSense?
    </Typography>

    <Grid container spacing={3} justifyContent="center">
      {features.map((f, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card
            sx={{
              width: "100%",
              maxWidth: 320,
              minHeight: 220,
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              background: (theme) =>
                theme.palette.mode === "light"
                  ? "linear-gradient(145deg, #ffffff, #f0fdf4)" // Light
                  : "linear-gradient(145deg, #1a1f1c, #064e3b)", // Dark
              boxShadow: "0 3px 8px rgba(34,197,94,0.15)", // ✅ softer, reduced depth
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 5px 14px rgba(34,197,94,0.25)", // ✅ subtle hover
              },
            }}
          >
            <Box sx={{ mb: 1 }}>{f.icon}</Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {f.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ flexGrow: 1 }}
            >
              {f.description}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


<Container maxWidth="xl" sx={{ mt: 3 }}>
  <Typography
    variant="h4"
    sx={{ fontWeight: "bold", textAlign: "center", mb: 6 }}
  >
    How It Works
  </Typography>

  <Grid container spacing={3} justifyContent="center">
    {steps.map((s, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Card
          sx={{
            width: "100%",          // ✅ fill only its grid column
            maxWidth: 320,          // ✅ cap width to keep uniform sizing
            height: "100%",
            minHeight: 200,
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          <Box sx={{ mb: 2 }}>{s.icon}</Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {s.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
          >
            {s.description}
          </Typography>
        </Card>
      </Grid>
    ))}
  </Grid>
</Container>

  
        {/* Testimonials */}
        <Container maxWidth="lg" sx={{ mt: 12 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((t, i) => (
              <Grid item xs={12} md={6} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ fontStyle: "italic", mb: 2 }}
                    >
                      “{t.quote}”
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", textAlign: "right" }}
                    >
                      {t.author}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
  
        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            mt: 3,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Detect Plagiarism. Fast. Accurate. Secure.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} PlagiSense • Resources • Privacy Policy
          </Typography>
        </Box>
      </Box>
    );
  }
  