//@ts-nocheck
import { QueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"
import { authStorage } from "./utils/storage"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 401
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 401) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || "Something went wrong"
        toast.error(message)
      },
    },
  },
})

// Global error handler for 401 responses
queryClient.setMutationDefaults(["auth"], {
  onError: (error: any) => {
    if (error?.status === 401) {
      authStorage.clearTokens()
      queryClient.clear()
      window.location.href = "/login"
    }
  },
})
