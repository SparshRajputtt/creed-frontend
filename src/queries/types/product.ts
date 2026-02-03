//@ts-nocheck
export interface Product {
  _id: string
  name: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  category: {
    _id: string
    name: string
    slug: string
  }
  subcategory?: {
    _id: string
    name: string
    slug: string
  }
  brand?: string
  sku: string
  slug: string
  images: Array<{
    public_id: string
    url: string
    alt?: string
  }>
  variants?: Array<{
    size?: string
    color?: string
    stock: number
    price?: number
    sku?: string
  }>
  stock: number
  lowStockThreshold: number
  weight?: {
    value: number
    unit: string
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  tags: string[]
  features: string[]
  specifications: Record<string, string>
  seoTitle?: string
  seoDescription?: string
  status: "active" | "inactive" | "draft" | "archived"
  isFeatured: boolean
  isDigital: boolean
  shippingRequired: boolean
  taxable: boolean
  ratings: {
    average: number
    count: number
  }
  soldCount: number
  viewCount: number
  discountPercentage: number
  stockStatus: "in_stock" | "low_stock" | "out_of_stock"
  createdAt: string
  updatedAt: string
}

export interface ProductsQuery {
  page?: number
  limit?: number
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: string
  search?: string
  status?: string
  featured?: boolean
}

export interface ProductsResponse {
  success: boolean
  count: number
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  data: Product[]
}

export interface CreateProductRequest {
  name: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  costPrice?: number
  category: string
  subcategory?: string
  brand?: string
  stock: number
  lowStockThreshold?: number
  weight?: string
  dimensions?: string
  tags?: string
  features?: string
  specifications?: string
  seoTitle?: string
  seoDescription?: string
  variants?: string
  isDigital?: boolean
  shippingRequired?: boolean
  taxable?: boolean
  taxClass?: string
  images?: FileList
}
