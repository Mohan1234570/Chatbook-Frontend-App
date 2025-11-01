import React from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  children: React.ReactNode; // ✅ safer & works even if JSX namespace missing
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRoute;
