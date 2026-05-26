import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Fandom, FandomProduct, FandomProductDetail } from '../types/fandom';

export const fandomKeys = {
  all: ['fandoms'] as const,
  list: () => [...fandomKeys.all, 'list'] as const,
  products: (id?: number) => [...fandomKeys.all, 'products', id ?? 'all'] as const,
  productDetail: (id: number) => [...fandomKeys.all, 'product', id] as const,
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

export function useCatalogProductDetail(id: number) {
  return useQuery({
    queryKey: fandomKeys.productDetail(id),
    queryFn: () =>
      http.get<FandomProductDetail>(`/api/catalog/products/${id}`).then((r) => r.data),
    enabled: id > 0,
  });
}
