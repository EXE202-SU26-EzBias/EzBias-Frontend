import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatKeys } from '../../services/chat.service';
import { useAuthStore } from '../../stores/auth.store';
import type { ChatMessage } from '../../types/chat';

const HUB_URL = `${(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')}/hubs/chat`;

export function useChatHub() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { accessTokenFactory: () => accessToken ?? '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveMessage', (message: ChatMessage) => {
      // Invalidate the specific conversation's messages and the conversation list
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(message.conversationId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    });

    connection.on('ConversationRead', ({ conversationId }: { conversationId: number }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
    });

    connection.start().catch((err) => console.warn('[ChatHub] connection failed:', err));

    return () => { connection.stop(); };
  }, [isAuthenticated, accessToken, queryClient]);
}
