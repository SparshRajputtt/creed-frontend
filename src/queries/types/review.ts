//@ts-nocheck
export interface Review {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
    avatar?: {
      url: string
    }
  }
  product: {
    _id: string
    name: string
    images: Array<{
      url: string
      alt?: string
    }>
  }
  rating: number
  title?: string
  comment: string
  images: Array<{
    public_id: string
    url: string
    alt?: string
  }>
  isVerifiedPurchase: boolean
  isApproved: boolean
  helpfulVotes: number
  response?: {
    message: string
    respondedBy: {
      _id: string
      firstName: string
      lastName: string
    }
    respondedAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface CreateReviewRequest {
  rating: number
  title?: string
  comment: string
  images?: FileList
}

export interface ReviewsQuery {
  page?: number
  limit?: number
  rating?: number
  sort?: string
  isApproved?: boolean
  product?: string
}
