/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import { toast } from 'sonner';

// =======================
// COMMON FORM DATA BUILDER
// =======================
const buildFormData = (categoryData: any, image?: File) => {
  const formData = new FormData();

  Object.entries(categoryData).forEach(([key, value]: any) => {
    // ❌ skip null, undefined, empty string
    if (value === null || value === undefined || value === '') return;

    // ✅ FIX 1: arrays must be JSON (NOT join)
    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    }
    // ✅ objects → stringify
    else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    }
    // ✅ normal values
    else {
      formData.append(key, value);
    }
  });

  // ✅ FIX 2: only append parent if valid
  if (categoryData.parent) {
    formData.set('parent', categoryData.parent);
  } else {
    formData.delete('parent');
  }

  // ✅ image
  if (image) {
    formData.append('image', image);
  }

  return formData;
};

// =======================
// CREATE CATEGORY
// =======================
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryData, image }: any) => {
      const formData = buildFormData(categoryData, image);

      const response = await apiClient.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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

// =======================
// UPDATE CATEGORY
// =======================
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, categoryData, image }: any) => {
      const formData = buildFormData(categoryData, image);

      const response = await apiClient.put(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
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
      toast.error(
        error.response?.data?.message || 'Failed to delete category'
      );
    },
  });
};