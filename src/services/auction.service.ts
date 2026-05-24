import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { Auction, AuctionDetail, BidHistoryEntry } from '../types/auction';

export const auctionKeys = {
  all: ['auctions'] as const,
  list: () => [...auctionKeys.all, 'list'] as const,
  detail: (id: number) => [...auctionKeys.all, 'detail', id] as const,
  bidHistory: (id: number) => [...auctionKeys.all, 'bidHistory', id] as const,
};

export function useAuctions() {
  return useQuery({
    queryKey: auctionKeys.list(),
    queryFn: () => http.get<Auction[] | { data: Auction[] }>('/api/auctions').then((r) => Array.isArray(r.data) ? r.data : (r.data as { data: Auction[] }).data ?? []),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

export function useAuctionDetail(id: number) {
  return useQuery({
    queryKey: auctionKeys.detail(id),
    queryFn: () => http.get<AuctionDetail>(`/api/auctions/${id}`).then((r) => r.data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}

export function usePlaceBid(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => http.post(`/api/auctions/${id}/bids`, { amount }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.bidHistory(id) });
    },
  });
}

export function useBidHistory(id: number) {
  return useQuery({
    queryKey: auctionKeys.bidHistory(id),
    queryFn: () => http.get<BidHistoryEntry[]>(`/api/auctions/${id}/bids/history`).then((r) => r.data),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 5_000,
    refetchInterval: 10_000,
  });
}
