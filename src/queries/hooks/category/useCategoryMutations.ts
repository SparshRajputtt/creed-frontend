//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { toast } from 'sonner';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryData,
      image,
    }: {
      categoryData: any;
      image?: File;
    }) => {
      const formData = new FormData();
      Object.keys(categoryData).forEach((key) => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          if (Array.isArray(categoryData[key])) {
            formData.append(key, categoryData[key].join(','));
          } else if (typeof categoryData[key] === 'object') {
            formData.append(key, JSON.stringify(categoryData[key]));
          } else {
            formData.append(key, categoryData[key]);
          }
        }
      });
      if (image) {
        formData.append('image', image);
      }
      const response = await apiClient.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      categoryData,
      image,
    }: {
      id: string;
      categoryData: any;
      image?: File;
    }) => {
      const formData = new FormData();
      Object.keys(categoryData).forEach((key) => {
        if (categoryData[key] !== undefined && categoryData[key] !== null) {
          if (Array.isArray(categoryData[key])) {
            formData.append(key, categoryData[key].join(','));
          } else if (typeof categoryData[key] === 'object') {
            formData.append(key, JSON.stringify(categoryData[key]));
          } else {
            formData.append(key, categoryData[key]);
          }
        }
      });
      if (image) {
        formData.append('image', image);
      }
      const response = await apiClient.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(id),
      });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};

export const useUpdateCategoryProductCount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(`/categories/${id}/update-count`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
      toast.success('Category product count updated');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to update category product count'
      );
    },
  });
};
