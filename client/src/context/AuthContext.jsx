import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ambunear_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ambunear_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync state with backend on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.auth.getMe();
        if (response.success && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('ambunear_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Initial session validation failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();

    // Listen for session expiry from api interceptor
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('auth-session-expired', handleExpired);
    return () => window.removeEventListener('auth-session-expired', handleExpired);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password });
    if (response.success && response.data) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('ambunear_token', receivedToken);
      localStorage.setItem('ambunear_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (formData) => {
    const response = await api.auth.register(formData);
    if (response.success && response.data) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('ambunear_token', receivedToken);
      localStorage.setItem('ambunear_user', JSON.stringify(receivedUser));
      return receivedUser;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.auth.logout().catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('ambunear_token');
      localStorage.removeItem('ambunear_user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.auth.getMe();
      if (response.success && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('ambunear_user', JSON.stringify(response.data.user));
      }
    } catch (e) {
      console.warn('Could not refresh profile');
    }
  };

  const isPatient = user?.role === 'PATIENT' || user?.role === 'USER';
  const isDriver = user?.role === 'DRIVER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isPatient,
        isDriver,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
