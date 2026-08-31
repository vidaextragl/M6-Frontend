import { useState, type ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { AuthContext } from './auth-context-definition';
import type { LoginCredentials, RegisterCredentials, User } from '../types/user.types';

const TOKEN_STORAGE_KEY = 'vida-extra:token';
const USER_STORAGE_KEY = 'vida-extra:user';

interface Session {
  user: User | null;
  token: string | null;
}

function getInitialSession(): Session {
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (storedToken && storedUser) {
    try {
      return { user: JSON.parse(storedUser) as User, token: storedToken };
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return { user: null, token: null };
    }
  }

  return { user: null, token: null };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session>(getInitialSession);
  const { user, token } = session;

  function persistSession(nextUser: User, nextToken: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setSession({ user: nextUser, token: nextToken });
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await authApi.login(credentials);
    persistSession(response.user, response.token);
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    const response = await authApi.register(credentials);
    persistSession(response.user, response.token);
  }

  function logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setSession({ user: null, token: null });
  }

  const value = {
    user,
    token,
    isLoading: false,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 