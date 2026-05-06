import { useMutation } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { AuthResponse, AuthUser } from '../types/auth';

interface LoginPayload {
  emailOrUsername: string;
  password: string;
}
interface LoginApiResponse {
  accessToken: string;
  expiresInSeconds?: number;
  userId: number;
  username: string;
  email: string;
  role?: string;
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      http.post<LoginApiResponse>('/api/auth/login', payload).then((r) => {
        const data = r.data;
        const user: AuthUser = {
          userId: data.userId,
          email: data.email,
          username: data.username,
          role: data.role,
        };
        const mapped: AuthResponse = {
          user,
          accessToken: data.accessToken,
          expiresInSeconds: data.expiresInSeconds,
        };
        return mapped;
      }),
  });
}

interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}
interface RegisterApiResponse {
  accessToken: string;
  expiresInSeconds?: number;
  userId: number;
  username: string;
  email: string;
  role?: string;
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      http.post<RegisterApiResponse>('/api/auth/register', payload).then((r) => {
        const data = r.data;
        const user: AuthUser = {
          userId: data.userId,
          email: data.email,
          username: data.username,
          role: data.role,
        };
        const mapped: AuthResponse = {
          user,
          accessToken: data.accessToken,
          expiresInSeconds: data.expiresInSeconds,
        };
        return mapped;
      }),
  });
}
