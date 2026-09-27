import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister } from '../services/authService';

const STORAGE_KEY = 'aido_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  // Keep localStorage in sync whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  function login(email, password) {
    const result = authLogin(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }

  function register(userData) {
    const result = authRegister(userData);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
