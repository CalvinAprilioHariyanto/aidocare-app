import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as authLogin, normalizeUser, register as authRegister } from '../services/authService';

const USER_STORAGE_KEY = 'aido_user';
const TOKEN_STORAGE_KEY = 'aido_token';

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const storage = localStorage.getItem(TOKEN_STORAGE_KEY) ? localStorage : sessionStorage;
    const token = storage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = storage.getItem(USER_STORAGE_KEY);
    return {
      token,
      user: token && storedUser ? JSON.parse(storedUser) : null,
      rememberUser: storage === localStorage,
    };
  } catch {
    return { token: null, user: null, rememberUser: false };
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Authentication state can still be cleared in memory.
  }
}

export function AuthProvider({ children }) {
  const [storedSession] = useState(readStoredSession);
  const [token, setToken] = useState(storedSession.token);
  const [user, setUser] = useState(storedSession.user);
  const [isLoading, setIsLoading] = useState(Boolean(storedSession.token));

  useEffect(() => {
    if (!storedSession.token) {
      clearStoredSession();
      return;
    }

    let active = true;
    getCurrentUser(storedSession.token)
      .then((currentUser) => {
        if (active) setUser(normalizeUser({ ...storedSession.user, ...currentUser }));
      })
      .catch(() => {
        if (active) {
          clearStoredSession();
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [storedSession]);

  function saveSession(session, rememberUser) {
    const nextUser = normalizeUser(session.user);
    const activeStorage = rememberUser ? localStorage : sessionStorage;
    const inactiveStorage = rememberUser ? sessionStorage : localStorage;
    try {
      activeStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      activeStorage.setItem(TOKEN_STORAGE_KEY, session.token);
      inactiveStorage.removeItem(USER_STORAGE_KEY);
      inactiveStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Keep the current session usable for this tab if storage is unavailable.
    }
    setToken(session.token);
    setUser(nextUser);
  }

  async function login(email, password, remember = false) {
    try {
      const session = await authLogin(email, password);
      saveSession(session, remember);
      return { success: true, user: session.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async function register(userData) {
    try {
      await authRegister(userData);
    } catch (error) {
      return { success: false, message: error.message };
    }

    const loginResult = await login(userData.email, userData.password, true);
    if (!loginResult.success) {
      return {
        ...loginResult,
        registrationComplete: true,
        message: 'Your account was created. Please log in to continue.',
      };
    }

    return loginResult;
  }

  function logout() {
    clearStoredSession();
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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
