import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

const DEMO_USER = {
  _id: 'demo-farmer-01',
  name: 'Ramesh Patel',
  email: 'ramesh.farmer@agrione.ai',
  phone: '+91 98765 43210',
  role: 'farmer',
  language: 'en',
  location: {
    state: 'Andhra Pradesh',
    district: 'Guntur',
    taluk: 'Tenali',
    village: 'Pedavadlapudi',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrione_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agrione_token');
      const storedUser = localStorage.getItem('agrione_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend silently
          const res = await authApi.getProfile();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('agrione_user', JSON.stringify(res.user));
          }
        } catch (e) {
          // If token verification fails or offline, keep cached demo/session
          console.warn('Backend offline or token expired, using offline cache');
        }
      } else {
        // Auto-login with demo user for instant seamless experience
        setUser(DEMO_USER);
        setToken('demo-jwt-token-agrione');
        localStorage.setItem('agrione_token', 'demo-jwt-token-agrione');
        localStorage.setItem('agrione_user', JSON.stringify(DEMO_USER));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('agrione_token', data.token);
        localStorage.setItem('agrione_user', JSON.stringify(data.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      if (data?.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('agrione_token', data.token);
        localStorage.setItem('agrione_user', JSON.stringify(data.user));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agrione_token');
    localStorage.removeItem('agrione_user');
  };

  const setDemoFarmer = () => {
    setUser(DEMO_USER);
    setToken('demo-jwt-token-agrione');
    localStorage.setItem('agrione_token', 'demo-jwt-token-agrione');
    localStorage.setItem('agrione_user', JSON.stringify(DEMO_USER));
  };

  const updateProfile = async (data) => {
    try {
      const res = await authApi.updateProfile(data);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('agrione_user', JSON.stringify(res.user));
        return { success: true };
      }
    } catch (err) {
      // Local update fallback
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('agrione_user', JSON.stringify(updated));
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setDemoFarmer,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
