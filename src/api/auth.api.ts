import { apiFetch } from './api-client';
import type { User } from '../types/user.types';

interface AuthResponse {
  token: string;
  user: User;
}

async function register(credentials: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
}

async function login(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
}

export const authApi = {
  register,
  login,
};