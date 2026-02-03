//@ts-nocheck
export interface Category {
  _id: string
  name: string
  description?: string
  slug: string
  parent?: {
    _id: string
    name: string
    slug: string
  }
  children: Array<{
    _id: string
    name: string
    slug: string
    image?: {
      url: string
      alt?: string
    }
  }>
  image?: {
    public_id: string
    url: string
    alt?: string
  }
  icon?: string
  level: number
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  metaKeywords: string[]
  productCount: number
  attributes: Array<{
    name: string
    type: "text" | "number" | "select" | "multiselect" | "boolean"
    options?: string[]
    required: boolean
  }>
  createdAt: string
  updatedAt: string
}

export interface CategoriesQuery {
  level?: number
  parent?: string
  featured?: boolean
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parent?: string
  icon?: string
  sortOrder?: number
  isFeatured?: boolean
  seoTitle?: string
  seoDescription?: string
  metaKeywords?: string
  attributes?: string
  image?: File
}
