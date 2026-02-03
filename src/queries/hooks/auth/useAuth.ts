//@ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import {
  userAtom,
  isAuthenticatedAtom,
  isLoadingAuthAtom,
  loginAtom,
  logoutAtom,
  initializeAuthAtom,
} from "../../store/auth"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  SendOTPRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  AuthResponse,
} from "../../types/auth"

export const useAuth = () => {
  const [user] = useAtom(userAtom)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [isLoading] = useAtom(isLoadingAuthAtom)
  const [, login] = useAtom(loginAtom)
  const [, logout] = useAtom(logoutAtom)
  const [, initializeAuth] = useAtom(initializeAuthAtom)

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    initializeAuth,
  }
}

export const useLogin = () => {
  const [, login] = useAtom(loginAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest): Promise<LoginResponse> => apiClient.post("/auth/login", data),
    onSuccess: (response) => {
      login({
        user: response.user,
        token: response.token,
      })
      toast.success(response.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
    },
  })
}


export const useRegister = () => {
  const [, login] = useAtom(loginAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequest): Promise<LoginResponse> => apiClient.post("/auth/register", data),
    onSuccess: (response) => {
      login({
        user: response.user,
        token: response.token,
      })
      toast.success(response.message)
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user })
    },
  })
}

export const useSendOTP = () => {
  return useMutation({
    mutationFn: (data: SendOTPRequest): Promise<AuthResponse> => apiClient.post("/auth/send-otp", data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

export const useLogout = () => {
  const [, logout] = useAtom(logoutAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (): Promise<AuthResponse> => apiClient.post("/auth/logout"),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success("Logged out successfully")
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      logout()
      queryClient.clear()
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest): Promise<AuthResponse> => apiClient.post("/auth/forgot-password", data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, ...data }: ResetPasswordRequest & { token: string }): Promise<AuthResponse> =>
      apiClient.post(`/auth/reset-password/${token}`, data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest): Promise<AuthResponse> => apiClient.put("/auth/change-password", data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: { email: string }): Promise<AuthResponse> => apiClient.post("/auth/resend-verification", data),
    onSuccess: (response) => {
      toast.success(response.message)
    },
  })
}

export const useCurrentUser = () => {
  return useQuery<AuthResponse['user'], Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      return apiClient.get('/auth/me')

    //   return API(config.api, '/auth/me', 'GET', token);
    },
    enabled: !!localStorage.getItem('token'),
    retry: false,
  });
};