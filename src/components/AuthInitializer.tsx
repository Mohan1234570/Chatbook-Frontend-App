import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { rehydrate, logout } from '../store/slices/authSlice'; // adjust path if needed

interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
  name?: string;
  role?: 'user' | 'admin';
}

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (!isExpired) {
          const user = JSON.parse(userStr);
          dispatch(rehydrate({ token, user }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return null; // no UI
};

export default AuthInitializer;
