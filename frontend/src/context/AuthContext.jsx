import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsLoading(false); return; }
    try {
      const { data } = await getMeApi();
      setUser(data.user);
      setProfile(data.profile);
    } catch {
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    // Fetch full profile
    try {
      const me = await getMeApi();
      setProfile(me.data.profile);
    } catch { /* ok */ }
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await registerApi(formData);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setUser(data.user);
    try {
      const me = await getMeApi();
      setProfile(me.data.profile);
    } catch { /* ok */ }
    return data.user;
  };

  const logout = async () => {
    try { await logoutApi(); } catch { /* ok */ }
    localStorage.clear();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const { data } = await getMeApi();
      setProfile(data.profile);
    } catch { /* ok */ }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
