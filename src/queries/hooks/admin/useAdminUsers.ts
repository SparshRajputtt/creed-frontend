//@ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../utils/api';
import { queryKeys } from '../../utils/queryKeys';
import type { User } from '../../types/auth';

export const useAdminUsers = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: (): Promise<{
      success: boolean;
      count: number;
      pagination: any;
      data: User[];
    }> => apiClient.get('/admin/users', params),
    keepPreviousData: true,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      id: string;
      role: string;
    }): Promise<{ success: boolean; message: string; data: User }> =>
      apiClient.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success(response.message);
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      id: string;
      status: newStatus;
    }): Promise<{ success: boolean; message: string; data: any }> =>
      apiClient.put(`/admin/users/${userId}/status`, { status }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success(response.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<{ success: boolean; message: string }> =>
      apiClient.delete(`/admin/users/${id}`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
      toast.success(response.message);
    },
  });
};
