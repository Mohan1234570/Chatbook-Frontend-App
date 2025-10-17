import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
  name?: string;
  role?: 'user' | 'admin';
}

// Load token from localStorage
const token = localStorage.getItem('token');
let initialUser: User | null = null;
let isAuthenticated = false;

if (token) {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (!isExpired) {
      initialUser = {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.name || '',
        role: decoded.role || 'user',
      };
      isAuthenticated = true;
    } else {
      localStorage.removeItem('token');
    }
  } catch (err) {
    localStorage.removeItem('token');
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: isAuthenticated ? token : null,
  isAuthenticated,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // ✅ Save user
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // ✅ Clear user
    },
    rehydrate: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  rehydrate,
} = authSlice.actions;

export default authSlice.reducer;
