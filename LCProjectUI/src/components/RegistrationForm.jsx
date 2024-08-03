import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/RegistrationForm.css';

const RegistrationForm = () => {
  const [form, setForm] = useState({ username: '', password: '', verifyPassword: '' });
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, verifyPassword } = form;

    if (password !== verifyPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      await register(form);  // Call register function from useAuth
      setMessage('User registered successfully');
      navigate('/login');  // Redirect to login page after successful registration
    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.');  // Handle registration errors
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
        <div className="mb-4">
        <button className="btn btn-secondary me-2" onClick={() => navigate('/login')}>Login</button>
        <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Back</button>
        <button className="btn btn-secondary me-2" onClick={() => navigate('/about')}>About</button>
        <button className="btn btn-secondary" onClick={() => navigate('/contact')}>Contact</button>
      </div>
          <h2 className="card-title">Registration Form</h2>
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
            <div className="mb-3">
              <label className="form-label">Verify Password:</label>
              <input
                type="password"
                className="form-control"
                name="verifyPassword"
                value={form.verifyPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
          {message && <p className="mt-3 text-danger">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
