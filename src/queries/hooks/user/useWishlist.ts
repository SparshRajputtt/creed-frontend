/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { api } from '@/queries/utils/api';
import { queryKeys } from '@/queries/utils/queryKeys';

// Get user wishlist
export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.user.wishlist(),
    queryFn: async () => {
      const response = await api.get('/users/wishlist');
      // Return the actual wishlist array, not the entire response object
      return response.data.data; // This gets the wishlist array
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Add to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post(`/users/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist() });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
  });
};

// Remove from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/users/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist() });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to remove from wishlist'
      );
    },
  });
};

// Toggle wishlist item
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      isInWishlist,
    }: {
      productId: string;
      isInWishlist: boolean;
    }) => {
      if (isInWishlist) {
        const response = await api.delete(`/users/wishlist/${productId}`);
        return { ...response.data, action: 'removed' };
      } else {
        const response = await api.post(`/users/wishlist/${productId}`);
        return { ...response.data, action: 'added' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist() });
      toast.success(
        data.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist'
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    },
  });
};
