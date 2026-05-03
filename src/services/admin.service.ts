import { useQuery } from '@tanstack/react-query';
import { ADMIN_DATA } from '../pages/AdminDashboard/adminMockData';
import type { AdminData } from '../types/admin';

export const adminKeys = {
  dashboard: ['admin', 'dashboard'] as const,
};

export const useAdminDashboard = () =>
  useQuery<AdminData>({
    queryKey: adminKeys.dashboard,
    queryFn: () => Promise.resolve(ADMIN_DATA),
    staleTime: 5 * 60 * 1000,
  });
