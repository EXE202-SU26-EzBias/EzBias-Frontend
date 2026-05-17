import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { CreateDisputePayload, DisputeDetail, DisputeItem, DisputeResponse } from '../types/dispute';

export const disputeKeys = {
  all: ['disputes'] as const,
  list: () => [...disputeKeys.all, 'list'] as const,
  detail: (id: number) => [...disputeKeys.all, 'detail', id] as const,
};

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDisputePayload) =>
      http.post<DisputeResponse>('/api/disputes', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}

export function useDisputes() {
  return useQuery({
    queryKey: disputeKeys.list(),
    queryFn: () => http.get<DisputeResponse[]>('/api/disputes').then((r) => r.data),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useDisputeDetail(disputeId: number) {
  return useQuery({
    queryKey: disputeKeys.detail(disputeId),
    queryFn: () => http.get<DisputeDetail>(`/api/disputes/${disputeId}`).then((r) => r.data),
    enabled: Number.isFinite(disputeId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useApproveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeId: number) =>
      http.put<DisputeResponse>(`/api/disputes/${disputeId}/approve`).then((r) => r.data),
    onSuccess: (_, disputeId) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId as number) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeId: number) =>
      http.put<DisputeResponse>(`/api/disputes/${disputeId}/refund-payment`).then((r) => r.data),
    onSuccess: (_, disputeId) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId as number) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}

export function useDisputeItems(disputeId: number) {
  return useQuery({
    queryKey: [...disputeKeys.detail(disputeId), 'items'] as const,
    queryFn: () => http.get<DisputeItem[]>(`/api/disputes/${disputeId}/items`).then((r) => r.data),
    enabled: Number.isFinite(disputeId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useRejectDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeId: number) =>
      http.put<DisputeResponse>(`/api/disputes/${disputeId}/reject`).then((r) => r.data),
    onSuccess: (_, disputeId) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId as number) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}
