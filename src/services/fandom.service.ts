import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Fandom, FandomProduct } from '../types/fandom';

export const fandomKeys = {
  all: ['fandoms'] as const,
  list: () => [...fandomKeys.all, 'list'] as const,
  products: (id: string) => [...fandomKeys.all, 'products', id] as const,
};

export function useFandoms() {
  return useQuery({
    queryKey: fandomKeys.list(),
    queryFn: () => http.get<Fandom[]>('/fandoms').then((r) => r.data),
  });
}

export function useFandomProducts(fandomId: string) {
  return useQuery({
    queryKey: fandomKeys.products(fandomId),
    queryFn: () =>
      http.get<FandomProduct[]>(`/fandoms/${fandomId}/products`).then((r) => r.data),
    enabled: Boolean(fandomId),
  });
}
