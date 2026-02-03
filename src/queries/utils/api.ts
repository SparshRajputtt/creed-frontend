//@ts-nocheck
import axios, { type AxiosResponse } from "axios"
import { authStorage } from "./storage"
import { queryClient } from "../queryClient"
import { config } from "@/config"

const API_BASE_URL = config.api || "http://localhost:3000/api"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = authStorage.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          })

          const { token } = response.data
          authStorage.setAccessToken(token)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        authStorage.clearTokens()
        queryClient.clear()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API helper functions
export const apiClient = {
  get: (url: string, params?: any): Promise<any> => api.get(url, { params }).then((res) => res.data),

  post: (url: string, data?: any, config?: any): Promise<any> => api.post(url, data, config).then((res) => res.data),

  put: (url: string, data?: any, config?: any): Promise<any> => api.put(url, data, config).then((res) => res.data),

  patch: (url: string, data?: any, config?: any): Promise<any> => api.patch(url, data, config).then((res) => res.data),

  delete: (url: string, config?: any): Promise<any> => api.delete(url, config).then((res) => res.data),
}

// Form data helper for file uploads
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData()

  Object.keys(data).forEach((key) => {
    const value = data[key]

    if (value instanceof FileList) {
      Array.from(value).forEach((file) => {
        formData.append(key, file)
      })
    } else if (value instanceof File) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item)
      })
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString())
    }
  })

  return formData
}
