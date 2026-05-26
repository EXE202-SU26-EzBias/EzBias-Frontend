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
  image: File;
}

export interface UpdateProductPayload {
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
  image?: File;
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
    mutationFn: (payload: ProductPayload) => {
      const form = new FormData();
      form.append('fandomId', payload.fandomId);
      form.append('artist', payload.artist);
      form.append('name', payload.name);
      form.append('type', payload.type);
      form.append('condition', String(payload.condition));
      form.append('price', String(payload.price));
      form.append('stock', String(payload.stock));
      form.append('description', payload.description);
      form.append('image', payload.image);
      return http.post<SellerProduct>('/api/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) => {
      const form = new FormData();
      form.append('price', String(payload.price));
      form.append('stock', String(payload.stock));
      form.append('description', payload.description);
      form.append('status', String(payload.status));
      if (payload.image) form.append('image', payload.image);
      return http.put<SellerProduct>(`/api/products/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data);
    },
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
