import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  IconButton,
  useTheme,
  Divider,
  styled,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  GitHub,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

// Styled components
const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}));

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.background.paper,
        py: 6,
        mt: 'auto',
        background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {/* About Section */}
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Chatbook App
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Share your thoughts, connect with others, and explore a world of ideas.
              Join our community of writers and readers today.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <StyledIconButton color="primary" aria-label="Facebook">
                <Facebook />
              </StyledIconButton>
              <StyledIconButton color="primary" aria-label="Twitter">
                <Twitter />
              </StyledIconButton>
              <StyledIconButton color="primary" aria-label="Instagram">
                <Instagram />
              </StyledIconButton>
              <StyledIconButton color="primary" aria-label="LinkedIn">
                <LinkedIn />
              </StyledIconButton>
              <StyledIconButton color="primary" aria-label="GitHub">
                <GitHub />
              </StyledIconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <StyledLink to="/">Home</StyledLink>
              <StyledLink to="/create-post">Create Post</StyledLink>
              <StyledLink to="/profile">Profile</StyledLink>
              <StyledLink to="/login">Login</StyledLink>
              <StyledLink to="/register">Register</StyledLink>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email color="primary" />
                <Typography variant="body2" color="text.secondary">
                  support@blogapp.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                <Typography variant="body2" color="text.secondary">
                  123 Blog Street, Digital City, 12345
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Blog App. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <StyledLink to="/privacy">Privacy Policy</StyledLink>
            <StyledLink to="/terms">Terms of Service</StyledLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 