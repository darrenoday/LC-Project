import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);  // Call login function from useAuth
      const user = JSON.parse(localStorage.getItem('user'));
      
        navigate('/events'); 
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');  // Handle login errors
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
        <div className="mb-4">
            <button className="btn btn-secondary me-2" onClick={() => navigate('/register')}>Register</button>
            <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn-secondary me-2" onClick={() => navigate('/about')}>About</button>
            <button className="btn btn-secondary" onClick={() => navigate('/contact')}>Contact</button>
          </div>
          <h2 className="card-title">Login Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username:</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
          {message && <p className="mt-3 text-danger">{message}</p>}
         
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
