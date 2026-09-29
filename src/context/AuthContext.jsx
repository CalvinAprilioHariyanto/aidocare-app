import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, register as authRegister } from '../services/authService';

const STORAGE_KEY = 'aido_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [rememberUser, setRememberUser] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!user;

  // Store authenticated users persistently only when Remember me is selected.
  useEffect(() => {
    if (user) {
      const activeStorage = rememberUser ? localStorage : sessionStorage;
      const inactiveStorage = rememberUser ? sessionStorage : localStorage;
      activeStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      inactiveStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user, rememberUser]);

  function login(email, password, remember = false) {
    const result = authLogin(email, password);
    if (result.success) {
      setRememberUser(remember);
      setUser(result.user);
    }
    return result;
  }

  function register(userData) {
    const result = authRegister(userData);
    if (result.success) {
      setRememberUser(true);
      setUser(result.user);
    }
    return result;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
