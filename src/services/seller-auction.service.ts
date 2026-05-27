import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { SellerAuction, SellerAuctionStatus } from '../types/seller';

export const sellerAuctionKeys = {
  all: ['seller-auctions'] as const,
  list: (status?: SellerAuctionStatus) => [...sellerAuctionKeys.all, 'list', status ?? 'all'] as const,
};

export interface CreateSellerAuctionPayload {
  productId: number;
  floorPrice: number;
  reservePrice: number;
  endsAt: string;
  isUrgent: boolean;
  hasProofImage: boolean;
  extensionSeconds: number;
  triggerBeforeEnd: number;
}

export function useSellerAuctions(status?: SellerAuctionStatus) {
  return useQuery({
    queryKey: sellerAuctionKeys.list(status),
    queryFn: () =>
      http
        .get<SellerAuction[]>('/api/seller/auctions', {
          params: status ? { status } : undefined,
        })
        .then((r) => r.data),
  });
}

export function useCreateSellerAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSellerAuctionPayload) =>
      http.post<SellerAuction>('/api/seller/auctions', payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerAuctionKeys.all });
    },
  });
}

export function usePublishSellerAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: number) =>
      http.post<SellerAuction>(`/api/seller/auctions/${auctionId}/publish`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerAuctionKeys.all });
    },
  });
}

export function useCancelSellerAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (auctionId: number) =>
      http.post<SellerAuction>(`/api/seller/auctions/${auctionId}/cancel`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerAuctionKeys.all });
    },
  });
}

export interface RelistSellerAuctionPayload {
  floorPrice: number;
  reservePrice: number;
  endsAt: string;
  isUrgent: boolean;
  hasProofImage: boolean;
  extensionSeconds: number;
  triggerBeforeEnd: number;
}

export function useRelistSellerAuction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ auctionId, payload }: { auctionId: number; payload: RelistSellerAuctionPayload }) =>
      http.post<SellerAuction>(`/api/seller/auctions/${auctionId}/relist`, payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sellerAuctionKeys.all });
    },
  });
}
