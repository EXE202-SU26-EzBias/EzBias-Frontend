import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type {
  AdminDashboardOverviewResponse,
  AdminDepositListItem,
  AdminDepositDetailResponse,
  AdminPayoutListItem,
  ApprovePayoutPayload,
  RejectPayoutPayload,
} from '../types/admin';

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  overview: () => [...adminDashboardKeys.all, 'overview'] as const,
};

export const adminPayoutKeys = {
  all: ['admin', 'payouts'] as const,
  list: () => [...adminPayoutKeys.all, 'list'] as const,
};

export const adminDepositKeys = {
  all: ['admin', 'deposits'] as const,
  list: () => [...adminDepositKeys.all, 'list'] as const,
  detail: (id: number) => [...adminDepositKeys.all, 'detail', id] as const,
};

export function useAdminDashboardOverview() {
  return useQuery({
    queryKey: adminDashboardKeys.overview(),
    queryFn: () => http.get<AdminDashboardOverviewResponse>('/api/admin/dashboard/overview').then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useAdminPayouts() {
  return useQuery({
    queryKey: adminPayoutKeys.list(),
    queryFn: () => http.get<AdminPayoutListItem[]>('/api/admin/payouts').then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useApprovePayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutId, payload }: { payoutId: number; payload: ApprovePayoutPayload }) =>
      http.put(`/api/admin/payouts/${payoutId}/approve`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPayoutKeys.all });
    },
  });
}

export function useRejectPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ payoutId, payload }: { payoutId: number; payload: RejectPayoutPayload }) =>
      http.put(`/api/admin/payouts/${payoutId}/reject`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPayoutKeys.all });
    },
  });
}

export function useAdminPendingRefunds() {
  return useQuery({
    queryKey: adminDepositKeys.list(),
    queryFn: () => http.get<AdminDepositListItem[]>('/api/admin/deposits/pending-refunds').then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useAdminDepositDetail(depositId: number) {
  return useQuery({
    queryKey: adminDepositKeys.detail(depositId),
    queryFn: () => http.get<AdminDepositDetailResponse>(`/api/admin/deposits/${depositId}`).then((r) => r.data),
    enabled: depositId > 0,
  });
}

export function useProcessManualRefund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ depositId, reason }: { depositId: number; reason: string }) =>
      http.post(`/api/admin/deposits/${depositId}/refund`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDepositKeys.all });
    },
  });
}

export const adminTransactionKeys = {
  all: ['admin', 'transactions'] as const,
  list: () => [...adminTransactionKeys.all, 'list'] as const,
};

export function useAdminTransactions() {
  return useQuery({
    queryKey: adminTransactionKeys.list(),
    queryFn: () =>
      http.get<import('../types/admin').AdminTransactionItem[]>('/api/admin/dashboard/transactions').then((r) => r.data),
    staleTime: 30_000,
  });
}

export const adminReviewKeys = {
  all: ['admin', 'reviews'] as const,
  list: () => [...adminReviewKeys.all, 'list'] as const,
};

export function useAdminReviews() {
  return useQuery({
    queryKey: adminReviewKeys.list(),
    queryFn: () =>
      http.get<import('../types/admin').AdminReviewListItem[]>('/api/admin/reviews').then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useAdminDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => http.delete(`/api/admin/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewKeys.all });
    },
  });
}
