//@ts-nocheck
import type { Order } from "./order" // Assuming Order is defined in another file

export interface DashboardStats {
  overview: {
    totalUsers: number
    totalProducts: number
    totalOrders: number
    totalRevenue: number
  }
  currentMonth: {
    orders: number
    revenue: number
  }
  lastMonth: {
    orders: number
    revenue: number
  }
  growth: {
    orders: number
    revenue: number
  }
  recentOrders: Order[]
  topProducts: Array<{
    _id: string
    name: string
    soldCount: number
    price: number
    images: Array<{
      url: string
      alt?: string
    }>
  }>
  lowStockProducts: Array<{
    _id: string
    name: string
    stock: number
    lowStockThreshold: number
  }>
  orderStatusStats: Array<{
    _id: string
    count: number
  }>
  revenueByMonth: Array<{
    _id: {
      year: number
      month: number
    }
    revenue: number
    orders: number
  }>
}

export interface SalesAnalytics {
  salesByDay: Array<{
    _id: string
    revenue: number
    orders: number
  }>
  topSellingProducts: Array<{
    _id: string
    productName: string
    totalSold: number
    revenue: number
  }>
  salesByCategory: Array<{
    _id: string
    categoryName: string
    revenue: number
    orders: number
  }>
}

export interface InventoryAnalytics {
  lowStockProducts: Array<{
    _id: string
    name: string
    stock: number
    lowStockThreshold: number
    category: string
  }>
  outOfStockProducts: Array<{
    _id: string
    name: string
    category: string
  }>
  stockValueByCategory: Array<{
    _id: string
    categoryName: string
    totalProducts: number
    totalStock: number
    totalValue: number
  }>
  topProductsByValue: Array<{
    _id: string
    name: string
    stock: number
    price: number
  }>
  summary: {
    lowStockCount: number
    outOfStockCount: number
  }
}
