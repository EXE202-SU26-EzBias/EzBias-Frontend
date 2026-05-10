import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { BuyerOrder, CreateOrderPayload, CreateOrderResponse } from '../types/checkout';

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: number) => [...orderKeys.all, 'detail', id] as const,
};

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      http.post<CreateOrderResponse>('/api/orders', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: () => http.get<BuyerOrder[]>('/api/orders').then((r) => r.data),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useOrderDetail(orderId: number) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => http.get<BuyerOrder>(`/api/orders/${orderId}`).then((r) => r.data),
    enabled: Number.isFinite(orderId),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: number) => http.put<BuyerOrder>(`/api/orders/${orderId}/confirm`).then((r) => r.data),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.list() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
    onError: (error) => console.error('[useConfirmOrder]', error),
  });
}
