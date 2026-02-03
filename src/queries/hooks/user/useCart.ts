//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { addToCartAtom, clearCartAtom } from '../../store/cart';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '../../types/user';

export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.user.cart,
    queryFn: (): Promise<{ success: boolean; data: Cart }> =>
      apiClient.get('/user/cart'),
    select: (data) => data.data,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const [, addToCartLocal] = useAtom(addToCartAtom);

  return useMutation({
    mutationFn: (
      data: AddToCartRequest
    ): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.post('/user/cart', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success(response.message);
    },
    // Optimistic update
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.user.cart });

      const previousCart = queryClient.getQueryData(queryKeys.user.cart);

      // Optimistically update local state
      // Note: You'd need to fetch product details for complete optimistic update

      return { previousCart };
    },
    onError: (err, newItem, context) => {
      queryClient.setQueryData(queryKeys.user.cart, context?.previousCart);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      ...data
    }: UpdateCartItemRequest & { itemId: string }): Promise<{
      success: boolean;
      message: string;
      data: any;
    }> => apiClient.put(`/user/cart/${itemId}`, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success(response.message);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      itemId: string
    ): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/user/cart/${itemId}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success(response.message);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const [, clearCartLocal] = useAtom(clearCartAtom);

  return useMutation({
    mutationFn: (): Promise<{ success: boolean; message: string }> =>
      apiClient.delete('/user/cart'),
    onSuccess: (response) => {
      clearCartLocal();
      queryClient.invalidateQueries({ queryKey: queryKeys.user.cart });
      toast.success(response.message);
    },
  });
};
