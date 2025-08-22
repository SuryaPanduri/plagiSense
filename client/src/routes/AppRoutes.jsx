import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ThemeProviderWrapper from "../context/ThemeContext";
import InternetCheck from "../pages/InternetCheck";


import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Compare from "../pages/Compare";
import Report from "../pages/Report";
import Upload from "../pages/Upload";
import Navbar from "../components/Navbar";


import { Box, Container } from "@mui/material";

// Layout for authenticated pages (with Navbar + page content)
const Layout = ({ children }) => (
  <Box
    sx={{
      minHeight: "100vh",
      background: (theme) =>
        theme.palette.mode === "light"
          ? "linear-gradient(135deg, #f9fafb 0%, #e8f5e9 100%)"
          : "linear-gradient(135deg, #0f1216 0%, #1e293b 100%)",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Navbar />
    <Container maxWidth="lg" sx={{ mt: 4, flex: 1 }}>
      {children}
    </Container>
  </Box>
);

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <ThemeProviderWrapper>
      <Router>
        <Routes>
          {/* Landing page */}
          <Route
            path="/"
            element={!user ? <Home /> : <Navigate to="/dashboard" />}
          />

          {/* Public routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />

          {/* Protected routes (Navbar only shown here) */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <Layout>
                  <Dashboard />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

            // ...
            <Route
              path="/internet-check"
              element={
                user ? (
                  <Layout>
                    <InternetCheck />
                  </Layout>
                ) : (<Navigate to="/" />)
              }
            />
          <Route
            path="/upload"
            element={
              user ? (
                <Layout>
                  <Upload />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/compare"
            element={
              user ? (
                <Layout>
                  <Compare />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/report"
            element={
              user ? (
                <Layout>
                  <Report />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Default fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProviderWrapper>
  );
};

export default AppRoutes;
