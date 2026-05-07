import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Fandom, FandomProduct } from '../types/fandom';

export const fandomKeys = {
  all: ['fandoms'] as const,
  list: () => [...fandomKeys.all, 'list'] as const,
  products: (id?: number) => [...fandomKeys.all, 'products', id ?? 'all'] as const,
};

export function useFandoms() {
  return useQuery({
    queryKey: fandomKeys.list(),
    queryFn: () => http.get<Fandom[]>('/api/catalog/fandoms').then((r) => r.data),
  });
}

export function useFandomProducts(fandomId?: number) {
  return useQuery({
    queryKey: fandomKeys.products(fandomId),
    queryFn: () =>
      http
        .get<FandomProduct[]>('/api/catalog/products', {
          params: fandomId ? { fandomId } : undefined,
        })
        .then((r) => r.data),
  });
}
