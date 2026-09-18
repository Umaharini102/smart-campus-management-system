import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('campus_token') || null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('campus_user', JSON.stringify(res.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('campus_token', res.token);
        localStorage.setItem('campus_user', JSON.stringify(res.user));
        showToast(`Welcome back, ${res.user.name}!`, 'success');
        return res.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('campus_token', res.token);
        localStorage.setItem('campus_user', JSON.stringify(res.user));
        showToast('Registration successful! Welcome to NexusCampus.', 'success');
        return res.user;
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user');
    showToast('Logged out successfully', 'info');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('campus_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        login,
        register,
        logout,
        updateUser,
        toastMessage,
        showToast,
        dismissToast: () => setToastMessage(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
