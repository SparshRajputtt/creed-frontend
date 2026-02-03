//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/queries/utils/api';
import { queryKeys } from '@/queries/utils/queryKeys';
import { toast } from 'react-hot-toast';

// Get product reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async () => {
      const response = await api.get(`/products/${productId}/reviews`);
      return response.data;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, ...reviewData }: any) => {
      const response = await api.post(
        `/products/${productId}/reviews`,
        reviewData
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
      toast.success('Review submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

// Update review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reviewId, productId, ...reviewData }: any) => {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
      toast.success('Review updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    },
  });
};

// Delete review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      productId,
    }: {
      reviewId: string;
      productId: string;
    }) => {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.productId),
      });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};
