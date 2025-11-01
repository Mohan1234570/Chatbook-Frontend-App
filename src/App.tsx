import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline, Box, createTheme } from '@mui/material';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AuthInitializer from './components/AuthInitializer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import MyPosts from './pages/MyPosts';
import LandingPage from './pages/LandingPage';
import PublicRoute from 'components/PublicRoute';

function App() {
  // 🌙 Dark Mode Toggle
  const [darkMode, setDarkMode] = useState(false);

  // 🎨 Dynamically create MUI theme
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
            paper: darkMode ? '#1e1e1e' : '#fff',
          },
        },
      }),
    [darkMode]
  );

  const toggleTheme = () => setDarkMode(!darkMode);

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
            }}
          >
            <AuthInitializer />
            {/* ✅ Pass theme toggle to Navbar */}
            <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />

            <Box sx={{ flex: 1 }}>
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

                {/* Home */}
                <Route path="/home" element={<Home />} />

                {/* Private Routes */}
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
                <Route
                  path="/myposts"
                  element={
                    <PrivateRoute>
                      <MyPosts />
                    </PrivateRoute>
                  }
                />

                {/* Fallback → 404 or redirect */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}


export default App;
