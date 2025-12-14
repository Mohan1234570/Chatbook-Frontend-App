import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  useTheme,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { authAPI, testBackendConnection } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      const isConnected = await testBackendConnection();
      setBackendStatus(isConnected ? 'online' : 'offline');
    };
    checkBackend();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (backendStatus !== 'online') {
      setError('Cannot connect to the server. Please try again later.');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    console.log('Starting login attempt...');

    try {
      console.log('Login data being sent:', { email: formData.email });
      const response = await authAPI.login(formData);
      console.log('Login response:', response);
      console.log("RAW login response:", JSON.stringify(response.data, null, 2));

      if (response.data) {
  const token = response.data.token.token;   // actual JWT
  const user = response.data.token.user;        // actual user

  console.log('Extracted token and user:', { token, user });

  if (!token) {
    throw new Error('No token received from server');
  }

  // ✅ Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('user_id', String(user.id));
  console.log('Token and user stored in localStorage');

  /// Safely split full name from backend if it only returns 'name'
const fullName = (user as any).name || '';
const [firstname, ...rest] = fullName.split(' ');
const lastname = rest.join(' ');

  dispatch(
  loginSuccess({
    token: token,
    user,
  })
  );

  console.log('Redux state updated');

  // ✅ Redirect to home page
  navigate('/home', { replace: true });
}
else {
        throw new Error('No data received from server');
      }
    } catch (err: any) {
      console.error('Login error details:', {
        error: err,
        response: err.response,
        data: err.response?.data,
        message: err.message,
        stack: err.stack
      });
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          Welcome Back
        </Typography>

        {backendStatus === 'checking' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Checking server connection...
          </Alert>
        )}

        {backendStatus === 'offline' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Cannot connect to the server. Please make sure the backend is running.
          </Alert>
        )}

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />

          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'space-between',
          }}>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              Create Account
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login; 