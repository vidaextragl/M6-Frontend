import { createContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "../api/auth.api";
import type {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/user.types";

const TOKEN_STORAGE_KEY = "vida-extra:token";
const USER_STORAGE_KEY = "vida-extra:user";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser) as User);
    }

    setIsLoading(false);
  }, []);

  function persistSession(nextUser: User, nextToken: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setToken(nextToken);
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
    setUser(null);
    setToken(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
