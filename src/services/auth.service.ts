import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import { useAuthStore } from '../stores/auth.store';
import type { AuthResponse, AuthUser, UserRole, ForgotPasswordPayload, ResetPasswordPayload, EmailVerificationRequestPayload, EmailVerificationVerifyPayload, MessageResponse } from '../types/auth';
import { cartKeys } from './cart.service';

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
          role: data.role as UserRole | undefined,
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
export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => http.post('/api/auth/logout').catch(() => {}),
    onSettled: () => {
      clear();
      queryClient.removeQueries({ queryKey: cartKeys.detail() });
    },
  });
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
          role: data.role as UserRole | undefined,
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

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      http.post<MessageResponse>('/api/auth/forgot-password', payload).then((r) => r.data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      http.post<MessageResponse>('/api/auth/reset-password', payload).then((r) => r.data),
  });
}

export function useRequestEmailVerification() {
  return useMutation({
    mutationFn: (payload: EmailVerificationRequestPayload) =>
      http.post<MessageResponse>('/api/auth/email-verification/request', payload).then((r) => r.data),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (payload: EmailVerificationVerifyPayload) =>
      http.post<MessageResponse>('/api/auth/email-verification/verify', payload).then((r) => r.data),
  });
}
