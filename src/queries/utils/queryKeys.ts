//@ts-nocheck
export const queryKeys = {
  // Auth
  auth: {
    user: () => ['auth', 'user'] as const,
    profile: () => ['auth', 'profile'] as const,
  },

  // Products
  products: {
    all: () => ['products'] as const,
    list: (params: any) => ['products', 'list', params] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    reviews: (productId: string) => ['products', 'reviews', productId] as const,
    related: (productId: string) => ['products', 'related', productId] as const,
    featured: (limit?: number) => ['products', 'featured', limit] as const,
    latest: (limit?: number) => ['products', 'latest', limit] as const,
    bestSelling: (limit?: number) =>
      ['products', 'best-selling', limit] as const,
    topRated: (limit?: number) => ['products', 'top-rated', limit] as const,
    bySlug: (slug: string) => ['products', 'by-slug', slug] as const,
    search: (query: string, params?: any) =>
      ['products', 'search', query, params] as const,
  },

  // Categories
  categories: {
    all: () => ['categories'] as const,
    bySlug: (slug: string) => ['categories', 'by-slug', slug] as const,
    byId: (id: string) => ['categories', 'by-id', id] as const,
    products: (categoryId: string, params: any) =>
      ['categories', 'products', categoryId, params] as const,
    featured: (limit?: number) => ['categories', 'featured', limit] as const,
    latest: (limit?: number) => ['categories', 'latest', limit] as const,
    bestSelling: (limit?: number) =>
      ['categories', 'best-selling', limit] as const,
    topRated: (limit?: number) => ['categories', 'top-rated', limit] as const,
    list: (params: any) => ['categories', 'list', params] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
  },

  // User
  user: {
    profile: () => ['user', 'profile'] as const,
    wishlist: () => ['user', 'wishlist'] as const,
    addresses: () => ['user', 'addresses'] as const,
    orders: (params?: any) => ['user', 'orders', params] as const,
    order: (orderId: string) => ['user', 'order', orderId] as const,
    cart: () => ['user', 'cart'] as const,
  },

  // Orders
  orders: {
    all: () => ['orders'] as const,
    list: (params: any) => ['orders', 'list', params] as const,
    detail: (orderId: string) => ['orders', 'detail', orderId] as const,
  },

  // Admin
  admin: {
    dashboard: () => ['admin', 'dashboard'] as const,
    analytics: (params: any) => ['admin', 'analytics', params] as const,
    users: (params: any) => ['admin', 'users', params] as const,
    products: (params: any) => ['admin', 'products', params] as const,
    orders: (params: any) => ['admin', 'orders', params] as const,
    categories: (params: any) => ['admin', 'categories', params] as const,
  },

  // Reviews
  reviews: {
    all: () => ['reviews'] as const,
    list: (params: any) => ['reviews', 'list', params] as const,
    product: (productId: string) => ['reviews', 'product', productId] as const,
  },

  // Coupons
  coupons: {
    all: () => ['coupons'] as const,
    list: (params: any) => ['coupons', 'list', params] as const,
    validate: (code: string) => ['coupons', 'validate', code] as const,
  },
} as const;
