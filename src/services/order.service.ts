import { useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { CreateOrderPayload, CreateOrderResponse } from '../types/checkout';

export const orderKeys = {
  all: ['orders'] as const,
  list: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
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
