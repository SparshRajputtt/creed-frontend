//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { toast } from 'sonner';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productData,
      images,
    }: {
      productData: any;
      images?: File[];
    }) => {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== undefined && productData[key] !== null) {
          if (
            typeof productData[key] === 'object' &&
            !Array.isArray(productData[key])
          ) {
            formData.append(key, JSON.stringify(productData[key]));
          } else if (Array.isArray(productData[key])) {
            formData.append(key, productData[key].join(','));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });
      if (images) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      const response = await apiClient.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      toast.success('Product created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      productData,
      images,
    }: {
      id: string;
      productData: any;
      images?: File[];
    }) => {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (productData[key] !== undefined && productData[key] !== null) {
          if (
            typeof productData[key] === 'object' &&
            !Array.isArray(productData[key])
          ) {
            formData.append(key, JSON.stringify(productData[key]));
          } else if (Array.isArray(productData[key])) {
            formData.append(key, productData[key].join(','));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });
      if (images) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }
      const response = await apiClient.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(id),
      });
      toast.success('Product updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/products/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
