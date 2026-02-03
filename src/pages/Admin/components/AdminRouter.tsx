//@ts-nocheck
'use client';

import type React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from './RevenueChart';
import { RecentOrders } from './RecentOrders';
import { TopProducts } from './TopProducts';
import { ProductsManagement } from './ProductsManagement';
import { CategoriesManagement } from './CategoriesManagement';
import { OrdersManagement } from './OrdersManagement';
import { UsersManagement } from './UsersManagement';
import { CouponManagement } from './CouponManagement';
import { AnalyticsManagement } from './AnalyticsManagement';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back! Here's what's happening with your store.
        </div>
      </div> */}

      {/* Stats Cards */}
      <DashboardStats />

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart />
        {/* <RecentOrders /> */}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <TopProducts />
        {/* Additional dashboard components can go here */}
      </div>
    </div>
  );
};

export const AdminRouter: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/categories" element={<CategoriesManagement />} />
            <Route path="/orders" element={<OrdersManagement />} />
            <Route path="/coupons" element={<CouponManagement />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/analytics" element={<AnalyticsManagement />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
