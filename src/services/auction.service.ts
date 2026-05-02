import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Auction, AuctionDetail } from '../types/auction';

export const auctionKeys = {
  all: ['auctions'] as const,
  list: () => [...auctionKeys.all, 'list'] as const,
  detail: (id: string) => [...auctionKeys.all, 'detail', id] as const,
};

export function useAuctions() {
  return useQuery({
    queryKey: auctionKeys.list(),
    queryFn: () => http.get<Auction[]>('/auctions').then((r) => r.data),
  });
}

export function useAuctionDetail(id: string) {
  return useQuery({
    queryKey: auctionKeys.detail(id),
    queryFn: () => http.get<AuctionDetail>(`/auctions/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

export function usePlaceBid(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) =>
      http.post(`/auctions/${id}/bids`, { amount }).then((r) => r.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(id) }),
  });
}
