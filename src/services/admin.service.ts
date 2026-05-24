import { useQuery } from '@tanstack/react-query';
import { http } from '../lib/axios';
import type { AdminDashboardOverviewResponse } from '../types/admin';

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  overview: () => [...adminDashboardKeys.all, 'overview'] as const,
};

export function useAdminDashboardOverview() {
  return useQuery({
    queryKey: adminDashboardKeys.overview(),
    queryFn: () => http.get<AdminDashboardOverviewResponse>('/api/admin/dashboard/overview').then((r) => r.data),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}