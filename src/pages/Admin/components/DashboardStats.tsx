//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminDashboard } from '@/queries/hooks/admin/useAdminDashboard';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

const formatCurrency = (value: number) => `₹${value?.toLocaleString()}`;
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();
const getMonthName = (month: number) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months[month - 1];
};

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  prefix = '',
}: any) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className="mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {prefix}
          {typeof value === 'number' ? value?.toLocaleString() : value}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span
          className={`text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

const RevenueChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    month: getMonthName(item._id.month),
    revenue: item.revenue,
    orders: item.orders,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Orders</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <YAxis yAxisId="orders" orientation="right" stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any, name: string) => [
                name === 'revenue' ? formatCurrency(value) : value,
                name === 'revenue' ? 'Revenue' : 'Orders',
              ]}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Bar
              yAxisId="orders"
              dataKey="orders"
              fill="#10b981"
              opacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const OrderStatusChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    status: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    count: item.count,
    percentage: (
      (item.count / data.reduce((sum, d) => sum + d.count, 0)) *
      100
    ).toFixed(1),
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Order Status Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any, name: string, props: any) => [
                `${value} orders (${props.payload.percentage}%)`,
                props.payload.status,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {chartData.map((item, index) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-sm text-gray-600">{item.status}</span>
            <span className="text-sm font-medium text-gray-900 ml-auto">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopProducts = ({ products }: { products: any[] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Top Selling Products
      </h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product?._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{product?.name}</h4>
                <p className="text-sm text-gray-500">
                  {formatCurrency(product?.price)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {product?.soldCount}
              </p>
              <p className="text-sm text-gray-500">sold</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LowStockAlert = ({ products }: { products: any[] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product?._id}
            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
          >
            <span className="font-medium text-gray-900">{product?.name}</span>
            <div className="text-right">
              <span className="text-orange-600 font-semibold">
                {product?.stock}
              </span>
              <span className="text-gray-500 text-sm">
                {' '}
                / {product?.lowStockThreshold}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentOrders = ({ orders }: { orders: any[] }) => {
  if (!orders || orders.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Recent Orders
      </h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-900">
                {order.user.firstName} {order.user.lastName}
              </h4>
              <p className="text-sm text-gray-500">{order.user.email}</p>
              <p className="text-xs text-gray-400">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(order.pricing.total)}
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-96 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to load dashboard data
            </h2>
            <p className="text-gray-600">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Revenue',
      value: data.overview.totalRevenue,
      change: data.growth.revenue,
      icon: DollarSign,
      color: 'text-green-600',
      prefix: '₹',
    },
    {
      title: 'Total Orders',
      value: data.overview.totalOrders,
      change: data.growth.orders,
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Total Users',
      value: data.overview.totalUsers,
      change: data.growth.users || 12.5,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Total Products',
      value: data.overview.totalProducts,
      change: data.growth.products || 8.2,
      icon: Package,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RevenueChart data={data.revenueByMonth} />
          </div>
          <OrderStatusChart data={data.orderStatusStats} />
          <TopProducts products={data.topProducts} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentOrders orders={data.recentOrders} />
          <LowStockAlert products={data.lowStockProducts} />
        </div>
      </div>
    </div>
  );
};
