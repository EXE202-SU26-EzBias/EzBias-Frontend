import { useMutation } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { AuthUser } from '../types/auth';

interface LoginPayload { email: string; password: string; }
interface LoginResponse { user: AuthUser; accessToken: string; }

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      http.post<LoginResponse>('/auth/login', payload).then((r) => r.data),
  });
}
