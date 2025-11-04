

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";


const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [mode, setMode] = useState<"light" | "dark">("light");
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const token = localStorage.getItem("token"); // 👈 get JWT token

        const response = await fetch("http://localhost:8080/api/posts/quote", {
          headers: {
            "Authorization": `Bearer ${token}`, // 👈 attach JWT token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        // API response like: [{ q: "Quote text", a: "Author" }]
        const quoteData = data[0];
        setQuote(quoteData.q);
        setAuthor(quoteData.a);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchQuote();
  }, []);


  // 🌙 Theme styles
  const bgGradient =
    mode === "light"
      ? "linear-gradient(135deg, #e0f7fa 0%, #f1f8e9 100%)"
      : "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)";

  const textColor = mode === "light" ? "#000" : "#fff";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: bgGradient,
        display: "flex",
        flexDirection: "column",
        color: textColor,
      }}
    >
    

      {/* 🌟 Hero Section */}
      <Container maxWidth="lg" sx={{ flex: 1, py: 10, textAlign: "center" }}>
        <MotionTypography
          variant="h2"
          fontWeight={700}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Where Conversations Begin 💬
        </MotionTypography>

        <MotionTypography
          variant="h6"
          color="text.secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          sx={{ mb: 4 }}
        >
          Join a world where ideas, stories, and emotions connect people every day.
        </MotionTypography>

        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ borderRadius: 4, px: 4, py: 1.5, mr: 2 }}
            onClick={() => navigate("/register")}
          >
            Join Chatbook Free
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{ borderRadius: 4, px: 4, py: 1.5 }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </MotionBox>
      </Container>

      {/* 🔥 Trending Section */}
      <Box
        sx={{
          backgroundColor: mode === "light" ? "#fff" : "#2c2c2c",
          py: 8,
          transition: "background-color 0.3s ease",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            sx={{ mb: 4 }}
          >
            See What’s Trending 🔥
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: (
                  <ChatBubbleOutlineIcon
                    sx={{ fontSize: 40, color: "#1976d2" }}
                  />
                ),
                title: "AI-Powered Conversations",
                description: "Chat intelligently with contextual suggestions.",
              },
              {
                icon: (
                  <SecurityIcon sx={{ fontSize: 40, color: "#388e3c" }} />
                ),
                title: "Secure Messaging",
                description: "Your messages are encrypted end-to-end.",
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
                title: "Fast Performance",
                description: "Experience lightning-fast message delivery.",
              },
            ].map((feature, index) => (
              <Grid container spacing={3}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    sx={{
                      textAlign: "center",
                      py: 4,
                      px: 2,
                      borderRadius: 3,
                      boxShadow: 3,
                      backgroundColor:
                        mode === "light" ? "#fafafa" : "#3a3a3a",
                    }}
                  >
                    <CardContent>
                      {feature.icon}
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ opacity: 0.8 }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ✨ Quote of the Day Section */}
      <Box
        sx={{
          background:
            mode === "light"
              ? "linear-gradient(90deg, #1976d2, #64b5f6)"
              : "linear-gradient(90deg, #0d47a1, #1a237e)",
          color: "white",
          py: 6,
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <FormatQuoteIcon sx={{ fontSize: 40, opacity: 0.8 }} />
          <Typography variant="h6" sx={{ fontStyle: "italic", mb: 1 }}>
            {quote || "Loading today’s inspiration..."}
          </Typography>
          {author && (
            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
              — {author}
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
