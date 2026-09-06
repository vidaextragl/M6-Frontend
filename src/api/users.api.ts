import { apiFetch } from './api-client';
import type { User } from '../types/user.types';

export const usersApi = {
  async updateProfile(updates: { name?: string; avatarUrl?: string }): Promise<{ user: User }> {
    return apiFetch<{ user: User }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};