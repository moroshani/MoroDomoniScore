import { apiFetch } from './api';
import type { User } from '../types';

export const getMyProfile = async () => {
  const response = await apiFetch<{ user: User }>('/api/users/me');
  return response.user;
};

export const updateMyProfile = async (payload: { name: string; username: string; email: string }) => {
  const response = await apiFetch<{ user: User }>('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  return response.user;
};

export const changeMyPassword = async (payload: { currentPassword: string; newPassword: string }) => {
  await apiFetch<{ ok: boolean }>('/api/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
};
