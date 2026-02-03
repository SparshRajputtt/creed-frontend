//@ts-nocheck
import { apiClient } from '@/queries/utils/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RazorpayOrderData {
  amount: number;
  currency?: string;
  orderId: string;
}

interface RazorpayVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

interface CODOrderData {
  orderId: string;
}

// Create Razorpay order
export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: async (data: RazorpayOrderData) => {
      const response = await apiClient.post('/payment/create-order', data);
      return response.data;
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create payment order';
      toast.error(message);
    },
  });
};

// Verify Razorpay payment
export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: async (data: RazorpayVerificationData) => {
      const response = await apiClient.post('/payment/verify', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment verified successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Payment verification failed';
      toast.error(message);
    },
  });
};

// Process COD order
export const useProcessCODOrder = () => {
  return useMutation({
    mutationFn: async (data: CODOrderData) => {
      const response = await apiClient.post('/payment/cod', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('COD order processed successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to process COD order';
      toast.error(message);
    },
  });
};

// Handle payment failure
export const useHandlePaymentFailure = () => {
  return useMutation({
    mutationFn: async (data: { orderId: string; error: any }) => {
      const response = await apiClient.post('/payment/failure', data);
      return response.data;
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to record payment failure';
      toast.error(message);
    },
  });
};
