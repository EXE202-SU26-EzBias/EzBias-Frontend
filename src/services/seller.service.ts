import { useQuery } from '@tanstack/react-query';
import { SELLER_DATA } from '../pages/SellerDashboard/sellerMockData';
import type { SellerData } from '../types/seller';

export const sellerKeys = {
  dashboard: ['seller', 'dashboard'] as const,
};

export function useSellerDashboard() {
  return useQuery<SellerData>({
    queryKey: sellerKeys.dashboard,
    queryFn: () => Promise.resolve(SELLER_DATA),
    staleTime: 5 * 60 * 1000,
  });
}
