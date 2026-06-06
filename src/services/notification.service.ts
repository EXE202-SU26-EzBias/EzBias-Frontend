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

const TOAST_TYPES = new Set(['Outbid', 'AuctionEndingSoon', 'DepositConfirmed', 'DepositRefundInitiated', 'PayoutPaid']);

/** Connects to NotificationHub, invalidates the notification list, and shows
 *  a toast popup for time-sensitive auction events (Outbid, AuctionEndingSoon)
 *  and deposit events (DepositConfirmed, DepositRefundInitiated). */
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

    connection.on('ReceiveNotification', (notification: { type: string; title: string; body: string; meta?: string }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });

      // Invalidate deposit and auction queries when deposit is confirmed so user can bid immediately
      if (notification.type === 'DepositConfirmed') {
        // Parse meta to get auctionId if available
        let auctionId: number | undefined;
        try {
          if (notification.meta) {
            const meta = JSON.parse(notification.meta);
            auctionId = meta.auctionId;
          }
        } catch {
          // ignore parse errors
        }

        // Invalidate deposit status queries (all or specific auction)
        if (auctionId) {
          queryClient.invalidateQueries({ queryKey: ['deposits', 'status', auctionId] });
        } else {
          queryClient.invalidateQueries({ queryKey: ['deposits'] });
        }

        // Invalidate auction queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ['auction'] });
        queryClient.invalidateQueries({ queryKey: ['auctions'] });
      }

      if (TOAST_TYPES.has(notification.type)) {
        const toastType =
          notification.type === 'DepositConfirmed' || notification.type === 'PayoutPaid'
            ? 'success'
            : 'error';
        showToast(`${notification.title} — ${notification.body}`, toastType, 4000);
      }
    });

    connection.start().catch((err) => console.warn('[NotificationHub] connection failed:', err));

    return () => { connection.stop(); };
  }, [isAuthenticated, accessToken, queryClient, showToast]);
}
