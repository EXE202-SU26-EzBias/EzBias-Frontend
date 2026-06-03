import * as signalR from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatKeys } from '../../services/chat.service';
import { useAuthStore } from '../../stores/auth.store';
import type { ChatMessage } from '../../types/chat';
import type { MessagePage } from '../../types/chat';

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
      // Optimistically add the message to the cache immediately
      queryClient.setQueryData<{ pages: MessagePage[]; pageParams: (number | null)[] }>(
        chatKeys.messages(message.conversationId),
        (old) => {
          if (!old) return old;
          
          // Add message to the first page (most recent messages)
          const updatedPages = [...old.pages];
          if (updatedPages.length > 0) {
            const firstPage = { ...updatedPages[0] };
            // Check if message already exists to avoid duplicates
            const exists = firstPage.messages.some(m => m.id === message.id);
            if (!exists) {
              firstPage.messages = [...firstPage.messages, message];
              updatedPages[0] = firstPage;
            }
          }
          
          return {
            ...old,
            pages: updatedPages,
          };
        }
      );

      // Also invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    });

    connection.on('ConversationRead', ({ conversationId }: { conversationId: number }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
    });

    connection.start().catch((err) => console.warn('[ChatHub] connection failed:', err));

    return () => { connection.stop(); };
  }, [isAuthenticated, accessToken, queryClient]);
}
