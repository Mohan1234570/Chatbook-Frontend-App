


import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { RootState } from '../store/store';

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  date?: string; // ISO string preferred
  read?: boolean;
};

/**
 * NotificationMenu
 *
 * Props:
 * - notifications: NotificationItem[] (optional) - list of notifications to display.
 *
 * Behavior:
 * - Shows a bell icon with unread badge.
 * - Opens a Dialog with a scrollable list of notifications on click.
 * - This is intentionally simple so you can wire it to Redux / API easily.
 */
const NotificationMenu: React.FC<{ notifications?: NotificationItem[] }> = ({ notifications = [] }) => {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent dividers>
          {notifications.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </Box>
          ) : (
            <List>
              {notifications.map(n => (
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
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'block' }}>
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

const Navbar: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  // adjust to the actual path in your blog slice; use a safe fallback
  const notifications = useSelector((state: RootState) => (state.blog as any)?.notifications ?? []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Chatbook App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationMenu notifications={notifications} />
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/create-post">
                Create Post
              </Button>
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

/*
  How to use / wire up:

  1) If you keep local dummy notifications for now, insert:
     <NotificationMenu notifications={[
       { id: '1', title: 'Welcome to Chatbook!', body: 'Thanks for joining', date: new Date().toISOString(), read: false }
     ]} />

  2) To wire to Redux (recommended), import `useSelector` and `RootState` and replace the prop with:
     const notifications = useSelector((state: RootState) => state.notifications?.items ?? []);
     <NotificationMenu notifications={notifications} />

  3) Place the component beside your other header IconButtons (e.g. next to profile / auth icons).
*/
{/* <MyComponent title={''} /> */}