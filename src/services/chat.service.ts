import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { ChatMessage, Conversation, MessagePage } from '../types/chat';
import { useAuthStore } from '../stores/auth.store';

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: number) => [...chatKeys.all, 'messages', conversationId] as const,
};

export function useConversations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => http.get<Conversation[]>('/api/conversations').then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
}

export function useMessages(conversationId: number) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam }) =>
      http
        .get<MessagePage>(`/api/conversations/${conversationId}/messages`, {
          params: { before: pageParam ?? undefined, pageSize: 50 },
        })
        .then((r) => r.data),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: conversationId > 0,
    staleTime: 0,
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { counterpartId: number; productId?: number; orderId?: number }) =>
      http.post<Conversation>('/api/conversations', {
        counterpartId: payload.counterpartId,
        productId: payload.productId ?? null,
        orderId: payload.orderId ?? null,
      }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatKeys.conversations() }),
  });
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      http.post<ChatMessage>(`/api/conversations/${conversationId}/messages`, { content }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

export function useMarkRead(conversationId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => http.put(`/api/conversations/${conversationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
    },
  });
}
