//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // or your preferred toast library
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type {
  Coupon,
  ValidateCouponRequest,
  ValidateCouponResponse,
  ApplyCouponRequest,
  ApplyCouponResponse,
} from '../../types/coupon';

export const useCoupons = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.coupons.all(params),
    queryFn: (): Promise<{
      success: boolean;
      count: number;
      pagination: any;
      data: Coupon[];
    }> => apiClient.get('/coupons', params),
    keepPreviousData: true,
  });
};

export const useActiveCoupons = () => {
  return useQuery({
    queryKey: queryKeys.coupons.active,
    queryFn: (): Promise<{ success: boolean; count: number; data: Coupon[] }> =>
      apiClient.get('/coupons/active'),
    select: (data) => data.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Coupon }> =>
      apiClient.get(`/coupons/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCouponStats = (id: string) => {
  return useQuery({
    queryKey: queryKeys.coupons.stats(id),
    queryFn: (): Promise<{ success: boolean; data: any }> =>
      apiClient.get(`/coupons/${id}/stats`),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: (
      data: ValidateCouponRequest
    ): Promise<ValidateCouponResponse> =>
      apiClient.post('/coupons/validate', data),
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to validate coupon';
      toast.error(errorMessage);
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyCouponRequest): Promise<ApplyCouponResponse> =>
      apiClient.post('/coupons/apply', data),
    onSuccess: (data) => {
      toast.success(
        `Coupon applied successfully! You saved ₹${data.data.discountAmount.toFixed(
          2
        )}`
      );
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to apply coupon';
      toast.error(errorMessage);
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string): Promise<any> =>
      apiClient.delete(`/orders/${orderId}/coupon`),
    onSuccess: () => {
      toast.success('Coupon removed successfully');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.items });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to remove coupon';
      toast.error(errorMessage);
    },
  });
};

// Hook for managing coupon state in cart
export const useCouponState = () => {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponState | null>(
    null
  );
  const [couponError, setCouponError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCouponMutation = useValidateCoupon();

  const validateAndApplyCoupon = async (
    code: string,
    orderAmount: number,
    cartItems: CartItemForCoupon[]
  ) => {
    if (!code.trim()) {
      setCouponError('Please enter a coupon code');
      return false;
    }

    setIsValidating(true);
    setCouponError('');

    try {
      const response = await validateCouponMutation.mutateAsync({
        code: code.toUpperCase(),
        orderAmount,
        cartItems,
      });

      if (response.success && response.data.isValid) {
        const couponData = response.data.coupon;
        const discountAmount = response.data.discountAmount;

        setAppliedCoupon({
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          discountAmount: discountAmount,
          description: couponData.description,
          validUntil: couponData.validUntil,
        });

        setCouponError('');
        return true;
      } else {
        setCouponError(response.message || 'Invalid coupon code');
        return false;
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to validate coupon. Please try again.';
      setCouponError(errorMessage);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const clearError = () => {
    setCouponError('');
  };

  return {
    appliedCoupon,
    couponError,
    isValidating,
    validateAndApplyCoupon,
    removeCoupon,
    clearError,
    hasAppliedCoupon: !!appliedCoupon,
    discountAmount: appliedCoupon?.discountAmount || 0,
  };
};
