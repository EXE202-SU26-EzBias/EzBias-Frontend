import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { DepositStatus, InitiateDepositResponse } from '../types/deposit';

export const depositKeys = {
  all: ['deposits'] as const,
  status: (auctionId: number) => [...depositKeys.all, 'status', auctionId] as const,
};

export function useDepositStatus(auctionId: number, enabled = true) {
  return useQuery({
    queryKey: depositKeys.status(auctionId),
    queryFn: () => http.get<DepositStatus>(`/api/auctions/${auctionId}/deposit`).then((r) => r.data),
    enabled: enabled && Number.isFinite(auctionId) && auctionId > 0,
    staleTime: 5_000,
  });
}

export function useInitiateDeposit(auctionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => http.post<InitiateDepositResponse>(`/api/auctions/${auctionId}/deposit`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: depositKeys.status(auctionId) });
    },
  });
}
