//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type { CreateCouponRequest, Coupon } from '../../types/coupon';

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateCouponRequest
    ): Promise<{ success: boolean; message: string; data: Coupon }> =>
      apiClient.post('/coupons', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.active });
      toast.success(response.message);
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: CreateCouponRequest & { id: string }): Promise<{
      success: boolean;
      message: string;
      data: Coupon;
    }> => apiClient.put(`/coupons/${id}`, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.active });
      queryClient.invalidateQueries({
        queryKey: queryKeys.coupons.detail(variables.id),
      });
      toast.success(response.message);
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/coupons/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.coupons.active });
      toast.success(response.message);
    },
  });
};
