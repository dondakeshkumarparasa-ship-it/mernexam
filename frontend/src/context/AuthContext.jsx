import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('exampulse_jwt_token'));
  const [adminToken, setAdminToken] = useState(sessionStorage.getItem('exampulse_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Parse payload safely
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.userId, role: payload.role });
      } catch (e) {
        logout();
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const registerLive = async (name, username, email, password) => {
    const res = await axios.post('/api/auth/register', { name, username, email, password });
    if (res.data.success) {
      localStorage.setItem('exampulse_jwt_token', res.data.token);
      setToken(res.data.token);
      return true;
    }
    return false;
  };

  const loginLive = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('exampulse_jwt_token', res.data.token);
      setToken(res.data.token);
      return true;
    }
    return false;
  };

  const loginAdmin = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    if (res.data.success && res.data.user.role === 'admin') {
      sessionStorage.setItem('exampulse_admin_token', res.data.token);
      sessionStorage.setItem('exampulse_admin_logged_in', 'true');
      setAdminToken(res.data.token);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('exampulse_jwt_token');
    setToken(null);
    setUser(null);
  };

  const logoutAdmin = () => {
    sessionStorage.removeItem('exampulse_admin_token');
    sessionStorage.removeItem('exampulse_admin_logged_in');
    setAdminToken(null);
  };

  const isAdminAuthenticated = () => {
    return sessionStorage.getItem('exampulse_admin_logged_in') === 'true';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      adminToken,
      loading,
      registerLive,
      loginLive,
      loginAdmin,
      logout,
      logoutAdmin,
      isAdminAuthenticated
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
