//@ts-nocheck
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type { Category, CategoriesQuery } from '../../types/category';

export const useCategories = (params?: CategoriesQuery) => {
  return useQuery({
    queryKey: queryKeys.categories.all(params),
    queryFn: (): Promise<{
      success: boolean;
      count: number;
      data: Category[];
    }> => apiClient.get('/categories', params),
    select: (data) => data.data,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCategoryTree = () => {
  return useQuery({
    queryKey: queryKeys.categories.tree,
    queryFn: (): Promise<{ success: boolean; data: Category[] }> =>
      apiClient.get('/categories/tree'),
    select: (data) => data.data,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Category }> =>
      apiClient.get(`/categories/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: (): Promise<{ success: boolean; data: Category }> =>
      apiClient.get(`/categories/slug/${slug}`),
    select: (data) => data.data,
    enabled: !!slug,
  });
};

export const useCategoryProducts = (id: string, params?: any) => {
  return useQuery({
    queryKey: queryKeys.categories.products(id, params),
    queryFn: (): Promise<{
      success: boolean;
      count: number;
      pagination: any;
      category: any;
      data: any[];
    }> => apiClient.get(`/categories/${id}/products`, params),
    enabled: !!id,
    keepPreviousData: true,
  });
};
