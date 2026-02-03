//@ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';

interface AnalyticsQuery {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
}

export const useAdminAnalytics = (params?: AnalyticsQuery) => {
  return useQuery({
    queryKey: queryKeys.admin.analytics(params),
    queryFn: async () => {
      const response = await apiClient.get('/admin/analytics', params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRevenueAnalytics = (params?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'revenue', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/analytics/revenue', params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryAnalytics = (params?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'categories', params],
    queryFn: async () => {
      const response = await apiClient.get(
        '/admin/analytics/categories',
        params
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
