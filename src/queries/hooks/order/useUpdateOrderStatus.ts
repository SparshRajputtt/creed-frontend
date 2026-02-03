//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { toast } from 'sonner';

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string;
      status: string;
      note?: string;
    }) => {
      const response = await apiClient.put(`/admin/orders/${id}/status`, {
        status,
        note,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update order status'
      );
    },
  });
};

export const useUpdateOrderTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      trackingNumber,
      carrier,
      estimatedDelivery,
    }: {
      id: string;
      trackingNumber: string;
      carrier?: string;
      estimatedDelivery?: string;
    }) => {
      const response = await apiClient.put(`/admin/orders/${id}/tracking`, {
        trackingNumber,
        carrier,
        estimatedDelivery,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      toast.success('Tracking information updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update tracking information'
      );
    },
  });
};
