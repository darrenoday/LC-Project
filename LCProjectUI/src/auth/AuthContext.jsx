import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to handle login
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', credentials, { withCredentials: true });
            const userRole = response.data; // Adjust based on your response structure
            if (userRole === 'admin') {
                setUser({ ...credentials, role: 'admin' });
            } else {
                setUser({ ...credentials, role: 'user' }); // Assign a default role if needed
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data || 'Login failed. Please try again.');
        }
    };

    // Function to handle registration
    const register = async (userData) => {
        try {
            await axios.post('http://localhost:8080/auth/register', userData, { withCredentials: true });
            setUser(userData); // Set user after successful registration
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error(error.response?.data || 'Registration failed. Please try again.');
        }
    };

    // Function to handle logout
    const logout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true });
            setUser(null);
            // Optionally, redirect the user to a different page after logout
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed. Please try again.');
        }
    };

    // Provide user state and auth functions to children
    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
