import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, Box, createTheme } from '@mui/material';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AuthInitializer from './components/AuthInitializer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import MyPosts from './pages/MyPosts';
import LandingPage from './pages/LandingPage';
import UserProfile from 'pages/UserProfile';

function App() {
  // 🌙 Load dark mode preference from localStorage (persistent)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? storedMode === 'true' : false;
  });

  // 🎨 Create theme dynamically
  const appliedTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
      }),
    [darkMode]
  );

  // 💾 Persist theme mode in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // 🌓 Toggle dark/light theme
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Provider store={store}>
      <ThemeProvider theme={appliedTheme}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary',
              transition: 'background-color 0.3s ease, color 0.3s ease',
            }}
          >
            <AuthInitializer />
            {/* ✅ Navbar with theme toggle */}
            <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />

            {/* ✅ Main content */}
            <Box sx={{ flex: 1, mt: 2 }}>
              <Routes>
                {/* Default route → Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Public routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Authenticated routes */}
                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create-post"
                  element={
                    <PrivateRoute>
                      <CreatePost />
                    </PrivateRoute>
                  }
                />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="/users/:userId" element={<UserProfile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route
                  path="/myposts"
                  element={
                    <PrivateRoute>
                      <MyPosts />
                    </PrivateRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>

            {/* ✅ Footer remains consistent */}
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
