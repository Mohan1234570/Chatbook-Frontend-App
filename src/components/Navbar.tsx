import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";
import { RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  date?: string;
  read?: boolean;
};

const NotificationMenu: React.FC<{ notifications?: NotificationItem[] }> = ({
  notifications = [],
}) => {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const theme = useTheme();

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        size="large"
        aria-label={`show ${unreadCount} new notifications`}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
            color: theme.palette.text.primary,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent dividers>
          {notifications.length === 0 ? (
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((n) => (
                <React.Fragment key={n.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" noWrap>
                          {n.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          {n.body && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {n.body}
                            </Typography>
                          )}
                          {n.date && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(n.date).toLocaleString()}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

const Navbar: React.FC<{ toggleTheme?: () => void; darkMode?: boolean }> = ({
  toggleTheme,
  darkMode,
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const notifications =
    useSelector(
      (state: RootState) => (state.blog as any)?.notifications ?? []
    ) || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
  dispatch(logout()); // clears auth slice
  localStorage.removeItem("jwtToken"); // remove token
  sessionStorage.clear(); // clear any session cache if used
  navigate("/", { replace: true }); // redirect to landing page
  window.location.reload(); // ensure full refresh (optional but ensures clean state)
};


  return (
    <>
      {/* ✅ Fixed AppBar with consistent height */}
      <AppBar
        position="fixed"
        color="primary"
        sx={{
          transition: "background-color 0.3s ease, color 0.3s ease",
          boxShadow: 2,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/home"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
            }}
          >
            Chatbook App
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationMenu
              notifications={
                notifications.length > 0
                  ? notifications
                  : [
                      {
                        id: "1",
                        title: "Welcome to Chatbook!",
                        body: "Start your first conversation today.",
                        date: new Date().toISOString(),
                        read: false,
                      },
                    ]
              }
            />

            {/* 🌙 Theme Toggle */}
            {toggleTheme && (
              <Tooltip
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                <IconButton
                  color="inherit"
                  onClick={toggleTheme}
                  sx={{ transition: "transform 0.3s ease" }}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            )}

            {/* 👤 Auth Buttons */}
            {isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/create-post"
                  sx={{ fontWeight: 500 }}
                >
                  Create Post
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  sx={{ fontWeight: 500 }}
                >
                  Profile
                </Button>
                <Tooltip title="Logout">
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  sx={{ fontWeight: 500 }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/register"
                  sx={{ fontWeight: 500 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Add toolbar spacer so content isn't hidden under AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
