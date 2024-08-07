import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or any loading indicator you prefer
  }

  return user && user.role === 'admin' ? children : <Navigate to="/events" />;
};

export default AdminRoute;
