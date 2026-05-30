import { useMutation, useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { CallSession } from '../types/videoCall';

export const videoCallKeys = {
  all: ['video-calls'] as const,
  conversation: (conversationId: number) => [...videoCallKeys.all, 'conversation', conversationId] as const,
};

export function useConversationCalls(conversationId: number) {
  return useQuery({
    queryKey: videoCallKeys.conversation(conversationId),
    queryFn: () => http.get<CallSession[]>(`/api/conversations/${conversationId}/calls`).then((r) => r.data),
    enabled: conversationId > 0,
  });
}

export function useStartCall() {
  return useMutation({
    mutationFn: (conversationId: number) =>
      http.post<CallSession>(`/api/conversations/${conversationId}/calls`).then((r) => r.data),
  });
}

export function useAcceptCall() {
  return useMutation({
    mutationFn: (callId: number) => http.post<CallSession>(`/api/calls/${callId}/accept`).then((r) => r.data),
  });
}

export function useRejectCall() {
  return useMutation({
    mutationFn: (callId: number) => http.post<CallSession>(`/api/calls/${callId}/reject`).then((r) => r.data),
  });
}

export function useEndCall() {
  return useMutation({
    mutationFn: (callId: number) => http.post<CallSession>(`/api/calls/${callId}/end`).then((r) => r.data),
  });
}
