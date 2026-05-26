import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { auctionKeys } from '../../services/auction.service';
import { useAuthStore } from '../../stores/auth.store';

const HUB_URL = `${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')}/hubs/auction`;

export function useAuctionHub(auctionId: number) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!auctionId || !Number.isFinite(auctionId) || auctionId <= 0) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => accessToken ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current = connection;

    connection.on('BidPlaced', () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(auctionId) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.bidHistory(auctionId) });
    });

    connection
      .start()
      .then(() => {
        console.log('[AuctionHub] connected, joining auction', auctionId);
        return connection.invoke('JoinAuction', auctionId);
      })
      .catch((err) => console.error('[AuctionHub] connection failed:', err));

    return () => {
      connection
        .invoke('LeaveAuction', auctionId)
        .catch(() => {})
        .finally(() => connection.stop());
    };
  }, [auctionId, accessToken, queryClient]);
}
