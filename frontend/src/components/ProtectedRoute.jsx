import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();

  // Agar Token ya User nahi hai, to Login page par bhej do
  if (!token) {
    // "state={{ from: location }}" ka matlab hai ki login ke baad wapas yahi aana hai
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Agar sab sahi hai, to jo page manga tha wo dikhao
  return children;
};

export default ProtectedRoute;