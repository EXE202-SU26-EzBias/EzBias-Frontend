import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { SellerDashboardResponse } from '../types/seller-dashboard';

export const sellerDashboardKeys = {
  all: ['seller', 'dashboard'] as const,
  overview: () => [...sellerDashboardKeys.all, 'overview'] as const,
};

export function useSellerDashboard() {
  return useQuery({
    queryKey: sellerDashboardKeys.overview(),
    queryFn: () => http.get<SellerDashboardResponse>('/api/seller/dashboard').then((r) => r.data),
    staleTime: 60_000,
  });
}
