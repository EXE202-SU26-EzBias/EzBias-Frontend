import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/auth.store';
import { refreshAccessToken } from './refresh';

// Extend InternalAxiosRequestConfig to track retry state
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.set('Authorization', `Bearer ${token}`);
          return http(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      useAuthStore.getState().setAccessToken(newToken);
      processQueue(null, newToken);

      originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
      return http(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      useAuthStore.getState().clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export type ApiError = AxiosError<{
  message?: string;
  errors?: Record<string, string[]>;
}>;
