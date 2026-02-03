//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { toast } from 'sonner';
import type { Order, OrdersQuery } from '../../types/order';

export const useUserOrders = (params?: OrdersQuery) => {
  return useQuery({
    queryKey: queryKeys.user.orders(params),
    queryFn: async (): Promise<{
      success: boolean;
      count: number;
      pagination: any;
      data: Order[];
    }> => {
      const response = await apiClient.get('/user/orders', params);
      return response;
    },
    keepPreviousData: true,
  });
};

export const useUserOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user.order(id),
    queryFn: async (): Promise<Order> => {
      const response = await apiClient.get(`/user/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await apiClient.put(`/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};

export const useRequestReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason: string;
    }) => {
      const response = await apiClient.post(`/user/orders/${orderId}/return`, {
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.orders() });
      toast.success('Return request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to request return');
    },
  });
};
