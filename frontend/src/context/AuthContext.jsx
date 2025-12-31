import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Error parsing stored user", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password, role) => {
        try {
            const response = await API.post('/auth/login', { email, password, role });
            const { token: userToken, user: userData } = response.data;

            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(userToken);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const registerStudent = async (formData) => {
        try {
            const response = await API.post('/auth/register-student', formData);
            const { token: userToken, user: userData } = response.data;

            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(userToken);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const registerSchool = async (formData) => {
        try {
            const response = await API.post('/auth/register-school', formData);
            const { token: userToken, user: userData } = response.data;

            localStorage.setItem('token', userToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(userToken);
            setUser(userData);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const updateUserPoints = (newPoints) => {
        updateUser({ points: newPoints });
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            loading,
            login,
            logout,
            registerStudent,
            registerSchool,
            updateUser,
            updateUserPoints
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
