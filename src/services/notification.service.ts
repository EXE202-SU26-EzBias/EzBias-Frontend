import * as signalR from '@microsoft/signalr';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { http } from '../lib/axios';
import { useAuthStore } from '../stores/auth.store';
import { useUiStore } from '../stores/ui.store';
import type { NotificationItem } from '../types/notification';

const HUB_URL = `${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')}/hubs/notifications`;

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => http.get<NotificationItem[]>('/api/notifications').then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => http.put(`/api/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list() }),
  });
}

export function useMarkReadAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => http.put('/api/notifications/read-all'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list() }),
  });
}

const TOAST_TYPES = new Set(['Outbid', 'AuctionEndingSoon']);

/** Connects to NotificationHub, invalidates the notification list, and shows
 *  a toast popup for time-sensitive auction events (Outbid, AuctionEndingSoon). */
export function useNotificationHub() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const showToast = useUiStore((s) => s.showToast);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => accessToken ?? '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveNotification', (notification: { type: string; title: string; body: string }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });

      if (TOAST_TYPES.has(notification.type)) {
        showToast(`${notification.title} — ${notification.body}`, 'error', 4000);
      }
    });

    connection.start().catch((err) => console.warn('[NotificationHub] connection failed:', err));

    return () => { connection.stop(); };
  }, [isAuthenticated, accessToken, queryClient, showToast]);
}
