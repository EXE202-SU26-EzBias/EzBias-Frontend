import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import { DISPUTE_STATUS } from '../constants/dispute';
import type { ApproveDisputePayload, CreateDisputePayload, DisputeResponse, RejectDisputePayload } from '../types/dispute';

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

export function useApproveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, payload }: { disputeId: number; payload: ApproveDisputePayload }) =>
      http.put<DisputeResponse>(`/api/disputes/${disputeId}/approve`, payload).then((r) => r.data),
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId) });
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
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}

export function useOpenDisputeCount() {
  return useQuery({
    queryKey: disputeKeys.list(),
    queryFn: () => http.get<DisputeResponse[]>('/api/disputes').then((r) => r.data),
    select: (data) => data.filter((d) => d.status === DISPUTE_STATUS.OPEN).length,
    staleTime: 30_000,
  });
}

export function useRejectDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ disputeId, payload }: { disputeId: number; payload: RejectDisputePayload }) =>
      http.put<DisputeResponse>(`/api/disputes/${disputeId}/reject`, payload).then((r) => r.data),
    onSuccess: (_, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.detail(disputeId) });
      queryClient.invalidateQueries({ queryKey: disputeKeys.list() });
    },
  });
}
