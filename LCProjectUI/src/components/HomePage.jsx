import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to Our Application</h1>
      <p>
        <Link to="/register" className="btn btn-primary mx-2">Register</Link>
        <Link to="/login" className="btn btn-secondary mx-2">Login</Link>
      </p>
    </div>
  );
};

export default HomePage;
