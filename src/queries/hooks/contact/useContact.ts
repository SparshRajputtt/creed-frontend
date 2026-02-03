//@ts-nocheck
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../utils/api';
import { toast } from 'sonner';

// Type definitions for contact form
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    subject: string;
    submittedAt: string;
  };
}

// Submit contact form mutation
export const useSubmitContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: ContactFormData): Promise<ContactResponse> => {
      const response = await apiClient.post('/contact', formData);
      return response;
    },
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Message sent successfully! We'll get back to you within 24 hours."
      );
      // You can invalidate any related queries here if needed
      // queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to send message. Please try again.';
      toast.error(errorMessage);
    },
  });
};

// Optional: Get contact submissions (if you need admin functionality)
export const useContactSubmissions = (params?: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery({
    queryKey: ['contacts', 'submissions', params],
    queryFn: async () => {
      const response = await apiClient.get('/admin/contacts', params);
      return response;
    },
    keepPreviousData: true,
    // Only enable this query if user has admin permissions
    enabled: false, // Set to true when implementing admin functionality
  });
};

// Optional: Mark contact as read/resolved (admin functionality)
export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      status,
    }: {
      contactId: string;
      status: 'pending' | 'read' | 'resolved';
    }) => {
      const response = await apiClient.put(
        `/admin/contacts/${contactId}/status`,
        { status }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', 'submissions'] });
      toast.success('Contact status updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to update contact status'
      );
    },
  });
};
