import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext'; // Adjust the import path to where your AuthContext is located

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Access user from the auth context

  // If user is authenticated, render the children; otherwise, redirect to login page
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
