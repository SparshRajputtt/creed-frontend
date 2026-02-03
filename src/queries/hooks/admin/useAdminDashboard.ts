//@ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/stats');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
