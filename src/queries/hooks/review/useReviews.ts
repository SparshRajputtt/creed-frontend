//@ts-nocheck
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "../../utils/api"
import { queryKeys } from "../../utils/queryKeys"
import type { Review, ReviewsQuery } from "../../types/review"

export const useReviews = (params?: ReviewsQuery) => {
  return useQuery({
    queryKey: queryKeys.reviews.all(params),
    queryFn: (): Promise<{
      success: boolean
      count: number
      pagination: any
      data: Review[]
    }> => apiClient.get("/reviews", params),
    keepPreviousData: true,
  })
}

export const useReview = (id: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.detail(id),
    queryFn: (): Promise<{ success: boolean; data: Review }> => apiClient.get(`/reviews/${id}`),
    select: (data) => data.data,
    enabled: !!id,
  })
}
