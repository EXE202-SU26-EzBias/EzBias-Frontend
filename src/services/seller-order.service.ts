import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Order } from '../types/order';

export const sellerOrderKeys = {
  all: ['seller-orders'] as const,
  list: () => [...sellerOrderKeys.all, 'list'] as const,
  detail: (id: number) => [...sellerOrderKeys.all, 'detail', id] as const,
};

export interface ShipSellerOrderPayload {
  orderId: number;
  carrier: string;
}

export function useSellerOrders() {
  return useQuery({
    queryKey: sellerOrderKeys.list(),
    queryFn: () => http.get<Order[]>('/api/seller/orders').then((r) => r.data),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useShipSellerOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, carrier }: ShipSellerOrderPayload) =>
      http.put<Order>(`/api/seller/orders/${orderId}/ship`, { carrier }).then((r) => r.data),
    onSuccess: (updatedOrder) => {
      queryClient.setQueryData<Order[]>(sellerOrderKeys.list(), (old = []) =>
        old.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)),
      );
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.all });
    },
    onError: (error) => console.error('[useShipSellerOrder]', error),
  });
}
