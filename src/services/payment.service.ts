import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { CreatePaymentPayload, PaymentDetail, PaymentResponse } from '../types/payment';

export const paymentKeys = {
  all: ['payments'] as const,
  list: () => [...paymentKeys.all, 'list'] as const,
  detail: (id: number) => [...paymentKeys.all, 'detail', id] as const,
};

const TERMINAL_STATUSES = new Set(['Paid', 'Failed']);

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      http.post<PaymentResponse>('/api/payments', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
    },
  });
}

export function usePaymentDetail(paymentId: number, options?: { polling?: boolean }) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => http.get<PaymentDetail>(`/api/payments/${paymentId}`).then((r) => r.data),
    enabled: Number.isFinite(paymentId) && paymentId > 0,
    staleTime: 0,
    refetchOnWindowFocus: true,
    ...(options?.polling
      ? {
          refetchInterval: (q: { state: { data?: PaymentDetail } }) => {
            const status = q.state.data?.status;
            return status && TERMINAL_STATUSES.has(status) ? false : 5000;
          },
        }
      : {}),
  });
}

export function useManualConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) =>
      http.post<PaymentResponse>(`/api/payments/${paymentId}/manual-confirm`).then((r) => r.data),
    onSuccess: (_, paymentId) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
    },
    onError: (err) => console.error('[useManualConfirmPayment]', err),
  });
}
