//@ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type { OrdersQuery } from '../../types/order';

export const useOrders = (params?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.orders.all(params),
    queryFn: async () => {
      const response = await apiClient.get('/orders', params);
      return response;
    },
    keepPreviousData: true,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
