//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient, createFormData } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type { CreateReviewRequest, Review } from '../../types/review';

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: CreateReviewRequest & { id: string }): Promise<{
      success: boolean;
      message: string;
      data: Review;
    }> => {
      const formData = createFormData(data);
      return apiClient.put(`/reviews/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.reviews(response.data.product?._id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.reviewStats(response.data.product?._id),
      });
      toast.success(response.message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/reviews/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      toast.success(response.message);
    },
  });
};

export const useVoteOnReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      vote,
    }: {
      id: string;
      vote: 'helpful' | 'not_helpful';
    }): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.post(`/reviews/${id}/vote`, { vote }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() });
      toast.success(response.message);
    },
  });
};

export const useRespondToReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: string;
      message: string;
    }): Promise<{ success: boolean; message: string; data: Review }> =>
      apiClient.post(`/reviews/${id}/respond`, { message }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() });
      toast.success(response.message);
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isApproved,
    }: {
      id: string;
      isApproved: boolean;
    }): Promise<{ success: boolean; message: string; data: Review }> =>
      apiClient.put(`/reviews/${id}/approve`, { isApproved }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      toast.success(response.message);
    },
  });
};
