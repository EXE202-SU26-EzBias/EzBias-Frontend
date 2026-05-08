import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { ProductStatus } from '../constants/product';
import type { SellerProduct } from '../types/seller';

export const productKeys = {
  all: ['products'] as const,
  list: () => [...productKeys.all, 'list'] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
};

export interface ProductPayload {
  fandomId: string;
  artist: string;
  name: string;
  type: string;
  condition: number;
  price: number;
  stock: number;
  description: string;
  primaryImageUrl: string;
}

export interface UpdateProductPayload {
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
  primaryImageUrl: string;
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: () => http.get<SellerProduct[]>('/api/products').then((r) => r.data),
  });
}

export function useProductDetail(id?: number) {
  return useQuery({
    queryKey: id ? productKeys.detail(id) : productKeys.detail(0),
    queryFn: () => http.get<SellerProduct>(`/api/products/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => http.post<SellerProduct>('/api/products', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      http.put<SellerProduct>(`/api/products/${id}`, payload).then((r) => r.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => http.delete(`/api/products/${id}`).then((r) => r.data),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}
