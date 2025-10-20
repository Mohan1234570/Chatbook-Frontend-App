// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   useTheme,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Snackbar,
// } from '@mui/material';
// import {
//   Person,
//   Email,
//   Lock,
//   Phone,
//   Visibility,
//   VisibilityOff,
// } from '@mui/icons-material';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../store/slices/authSlice';
// import { authAPI } from '../services/api';

// const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [validationErrors, setValidationErrors] = useState<{
//     [key: string]: string;
//   }>({});

//   const validateForm = () => {
//     const errors: { [key: string]: string } = {};

//     if (formData.name.length < 3) {
//       errors.name = 'Name must be at least 3 characters long';
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Please enter a valid email address';
//     }

//     if (formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters long';
//     }

//     if (!/^\d{10}$/.test(formData.phone)) {
//       errors.phone = 'Phone number must be 10 digits';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear validation error when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await authAPI.register({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         phone: formData.phone,
//       });

//       console.log('Full registration response:', response);

//       // Check if response has the expected structure
//       if (response.data && response.data.status === 200) {
//         // After successful registration, attempt to login to get the token
//         try {
//           const loginResponse = await authAPI.login({
//             email: formData.email,
//             password: formData.password,
//           });

//           if (loginResponse.data) {
//             const { token, user } = loginResponse.data;
            
//             // Store token in localStorage
//             localStorage.setItem('token', token);

//             // Update Redux state with user data
//             dispatch(
//               loginSuccess({
//                 token: token,
//                 user: {
//                   id: user.id,
//                   username: user.name,
//                   email: user.email,
//                   role: 'user',
//                 },
//               })
//             );

//             // Show success message
//             setShowSuccess(true);
            
//             // Use navigate instead of window.location for smoother transition
//             navigate('/', { replace: true });
//           } else {
//             throw new Error('Login after registration failed');
//           }
//         } catch (loginErr: any) {
//           console.error('Login after registration failed:', loginErr);
//           throw new Error('Registration successful but login failed. Please try logging in manually.');
//         }
//       } else {
//         console.error('Registration failed:', response.data);
//         throw new Error(response.data?.message || 'Registration failed. Please try again.');
//       }
//     } catch (err: any) {
//       console.error('Registration error details:', {
//         error: err,
//         response: err.response,
//         data: err.response?.data,
//         message: err.message
//       });
      
//       setError(
//         err.response?.data?.message || err.message || 'Registration failed. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: 4,
//           background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
//           borderRadius: 2,
//         }}
//       >
//         <Typography
//           variant="h4"
//           component="h1"
//           gutterBottom
//           align="center"
//           sx={{
//             fontWeight: 'bold',
//             color: theme.palette.primary.main,
//             mb: 4,
//           }}
//         >
//           Create Account
//         </Typography>

//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               mb: 3,
//               borderRadius: 1,
//             }}
//           >
//             {error}
//           </Alert>
//         )}

//         <Snackbar
//           open={showSuccess}
//           autoHideDuration={2000}
//           onClose={() => setShowSuccess(false)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         >
//           <Alert severity="success" sx={{ width: '100%' }}>
//             Registration successful! Redirecting to home page...
//           </Alert>
//         </Snackbar>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Full Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             margin="normal"
//             required
//             variant="outlined"
//             error={!!validationErrors.name}
//             helperText={validationErrors.name}
//             disabled={loading}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Person color="primary" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               mb: 2,
//               '& .MuiOutlinedInput-root': {
//                 '&:hover fieldset': {
//                   borderColor: theme.palette.primary.main,
//                 },
//               },
//             }}
//           />

//           <TextField
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             margin="normal"
//             required
//             variant="outlined"
//             error={!!validationErrors.email}
//             helperText={validationErrors.email}
//             disabled={loading}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Email color="primary" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               mb: 2,
//               '& .MuiOutlinedInput-root': {
//                 '&:hover fieldset': {
//                   borderColor: theme.palette.primary.main,
//                 },
//               },
//             }}
//           />

//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type={showPassword ? 'text' : 'password'}
//             value={formData.password}
//             onChange={handleChange}
//             margin="normal"
//             required
//             variant="outlined"
//             error={!!validationErrors.password}
//             helperText={validationErrors.password}
//             disabled={loading}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Lock color="primary" />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     type="button"
//                     onClick={function() { setShowPassword(!showPassword); }}
//                     edge="end"
//                     disabled={loading}
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               mb: 2,
//               '& .MuiOutlinedInput-root': {
//                 '&:hover fieldset': {
//                   borderColor: theme.palette.primary.main,
//                 },
//               },
//             }}
//           />

//           <TextField
//             fullWidth
//             label="Phone Number"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             margin="normal"
//             required
//             variant="outlined"
//             error={!!validationErrors.phone}
//             helperText={validationErrors.phone}
//             disabled={loading}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Phone color="primary" />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               mb: 3,
//               '& .MuiOutlinedInput-root': {
//                 '&:hover fieldset': {
//                   borderColor: theme.palette.primary.main,
//                 },
//               },
//             }}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             color="primary"
//             size="large"
//             disabled={loading}
//             sx={{
//               py: 1.5,
//               borderRadius: 2,
//               textTransform: 'none',
//               fontWeight: 'bold',
//               boxShadow: 2,
//               '&:hover': {
//                 boxShadow: 4,
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Register'
//             )}
//           </Button>

//           <Box sx={{ mt: 2, textAlign: 'center' }}>
//             <Typography variant="body2" color="text.secondary">
//               Already have an account?{' '}
//               <Button
//                 color="primary"
//                 onClick={() => navigate('/login')}
//                 sx={{ textTransform: 'none' }}
//                 disabled={loading}
//               >
//                 Login
//               </Button>
//             </Typography>
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default Register; 



import React, { useState } from 'react';
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
  Snackbar,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Phone,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // ✅ Validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (formData.firstname.trim().length < 2) {
      errors.firstname = 'First name must be at least 2 characters';
    }
    if (formData.lastname.trim().length < 2) {
      errors.lastname = 'Last name must be at least 2 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    setLoading(true);

    try {
      // ✅ send firstname, lastname separately
      const response = await authAPI.register({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      console.log('Registration response:', response);

      if (response.data && response.data.status === 200) {
        try {
          const loginResponse = await authAPI.login({
            email: formData.email,
            password: formData.password,
          });

          if (loginResponse.data) {
            const { token, user } = loginResponse.data;
            const fullName = user.name || '';
            const [firstname, ...rest] = fullName.split(' ');
            const lastname = rest.join(' ');
            localStorage.setItem('token', token);

            dispatch(
              loginSuccess({
                token: token,
                user: {
                  id: user.id,
                  firstname,
                  lastname,
                  email: user.email,
                  role: user.role === 'admin' ? 'admin' : 'user',
                  profileImageUrl: (user as any).profileImageUrl ?? '',
                  bio: (user as any).bio ?? '',
                },
              })
            );


            setShowSuccess(true);
            navigate('/', { replace: true });
          } else {
            throw new Error('Login after registration failed');
          }
        } catch (loginErr: any) {
          console.error('Login after registration failed:', loginErr);
          throw new Error('Registration successful but login failed. Please try logging in manually.');
        }
      } else {
        throw new Error(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
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
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 4 }}
        >
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={showSuccess}
          autoHideDuration={2000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Registration successful! Redirecting...
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          {/* ✅ First Name */}
          <TextField
            fullWidth
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            error={!!validationErrors.firstname}
            helperText={validationErrors.firstname}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* ✅ Last Name */}
          <TextField
            fullWidth
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            error={!!validationErrors.lastname}
            helperText={validationErrors.lastname}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
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
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
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
            error={!!validationErrors.password}
            helperText={validationErrors.password}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Phone */}
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            error={!!validationErrors.phone}
            helperText={validationErrors.phone}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: 2,
              '&:hover': { boxShadow: 4 },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Button color="primary" onClick={() => navigate('/login')} sx={{ textTransform: 'none' }} disabled={loading}>
                Login
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
