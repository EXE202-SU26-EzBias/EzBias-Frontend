import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auctionKeys } from '../../services/auction.service';
import { useAuthStore } from '../../stores/auth.store';

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/hubs/auction`;

/**
 * Connects to the AuctionHub SignalR endpoint and subscribes to realtime
 * bid events for the given auction. When a "BidPlaced" event arrives,
 * the auction detail and bid history queries are invalidated so React Query
 * refetches the latest data automatically.
 */
export function useAuctionHub(auctionId: number) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!auctionId || !Number.isFinite(auctionId) || auctionId <= 0) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // Pass JWT if available so the hub can identify the user (optional for public hub)
        accessTokenFactory: () => accessToken ?? '',
        // Do NOT lock to WebSockets — let SignalR negotiate the best transport.
        // Render (and many reverse proxies) may not support WebSocket upgrades,
        // so falling back to Server-Sent Events or Long Polling is required.
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on('BidPlaced', () => {
      // Invalidate both queries — React Query will refetch in the background
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.bidHistory(auctionId) });
    });

    connection
      .start()
      .then(() => connection.invoke('JoinAuction', auctionId))
      .catch((err) => console.warn('[AuctionHub] connection failed:', err));

    return () => {
      connection
        .invoke('LeaveAuction', auctionId)
        .catch(() => {})
        .finally(() => connection.stop());
    };
  }, [auctionId, accessToken, queryClient]);
}
