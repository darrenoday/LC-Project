import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage when the app initializes
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Function to handle login
    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:8080/auth/login', credentials, { withCredentials: true });
            const userRole = response.data; // Adjust based on your response structure
            const loggedInUser = { username: credentials.username, role: userRole === 'admin' ? 'admin' : 'user' };
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser)); // Store user in local storage
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(error.response?.data || 'Login failed. Please try again.');
        }
    };

    // Function to handle registration
    const register = async (userData) => {
        try {
            await axios.post('http://localhost:8080/auth/register', userData, { withCredentials: true });
            const registeredUser = { username: userData.username, role: 'user' };
            setUser(registeredUser);
            localStorage.setItem('user', JSON.stringify(registeredUser)); // Store user in local storage
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
            localStorage.removeItem('user'); // Remove user from local storage
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error('Logout failed. Please try again.');
        }
    };
    // Provide user state and auth functions to children
    return (
        <AuthContext.Provider value={{ user,loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
