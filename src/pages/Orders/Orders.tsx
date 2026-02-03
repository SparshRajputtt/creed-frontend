//@ts-nocheck

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Eye,
  Download,
  MoreHorizontal,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserOrders } from '@/queries/hooks/user/useUserOrders';

const statusConfig = {
  pending: {
    label: 'Order Placed',
    icon: ShoppingBag,
    color: 'bg-blue-500',
  },
  confirmed: {
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'bg-green-500',
  },
  processing: {
    label: 'Processing',
    icon: Package,
    color: 'bg-yellow-500',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'bg-purple-500',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'bg-green-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: Package,
    color: 'bg-red-500',
  },
};

const OrderTimeline = ({ steps, currentStatus }: any) => {
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step: any, index: number) => {
          const config = statusConfig[step.status as keyof typeof statusConfig];
          const Icon = config.icon;
          const isCompleted = step.completed;
          const isActive = currentStatus === step.status;

          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    isCompleted
                      ? `${config.color} text-white shadow-lg`
                      : isActive
                      ? `${config.color} text-white animate-pulse shadow-lg`
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                <div className="text-center">
                  <p
                    className={`text-xs font-medium mb-1 ${
                      isCompleted || isActive
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {config.label}
                  </p>
                  {step.date && (
                    <p className="text-xs text-gray-500">
                      {new Date(step.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 relative">
                  <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: isCompleted ? '100%' : '0%' }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className={`h-full ${config.color}`}
                    />
                  </div>

                  {currentStatus === step.status && (
                    <motion.div
                      animate={{ x: [0, 20, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 2,
                      }}
                      className="absolute top-1/2 left-0 transform -translate-y-1/2"
                    >
                      <Truck className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order, index }: any) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const trackingSteps = [
    { status: 'pending', date: order.createdAt, completed: true },
    {
      status: 'confirmed',
      date: order.statusHistory?.find((s: any) => s.status === 'confirmed')
        ?.timestamp,
      completed: ['confirmed', 'processing', 'shipped', 'delivered'].includes(
        order.status
      ),
    },
    {
      status: 'processing',
      date: order.statusHistory?.find((s: any) => s.status === 'processing')
        ?.timestamp,
      completed: ['processing', 'shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'shipped',
      date: order.statusHistory?.find((s: any) => s.status === 'shipped')
        ?.timestamp,
      completed: ['shipped', 'delivered'].includes(order.status),
    },
    {
      status: 'delivered',
      date: order.statusHistory?.find((s: any) => s.status === 'delivered')
        ?.timestamp,
      completed: order.status === 'delivered',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Order Header */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
              #{order.orderNumber.slice(-3)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <motion.div
                animate={{ rotate: expanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-gray-100"
                >
                  <img
                    src={
                      item.product?.images?.[0]?.url ||
                      '/placeholder.svg?height=40&width=40'
                    }
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {order.items.length > 3 && (
                <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg text-gray-900">
              ₹{order.pricing.total}
            </p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50/50">
              {/* Tracking Timeline */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Order Tracking
                </h4>
                <OrderTimeline
                  steps={trackingSteps}
                  currentStatus={order.status}
                />
              </div>

              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    Items Ordered
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg"
                      >
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            '/placeholder.svg?height=48&width=48'
                          }
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    Delivery Address
                  </h4>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-gray-700">
                      {order.shippingAddress.firstName}{' '}
                      {order.shippingAddress.lastName}
                    </p>
                    <p className="text-gray-700">
                      {order.shippingAddress.address1}
                    </p>
                    {order.shippingAddress.address2 && (
                      <p className="text-gray-700">
                        {order.shippingAddress.address2}
                      </p>
                    )}
                    <p className="text-gray-700">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to={`/orders/${order._id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Link>
                </Button>
                {/* <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="w-4 h-4 mr-2" />
                      More Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Track Package</DropdownMenuItem>
                    <DropdownMenuItem>Contact Support</DropdownMenuItem>
                    {order.status === 'delivered' && (
                      <DropdownMenuItem>Request Return</DropdownMenuItem>
                    )}

                    {['pending', 'confirmed'].includes(order.status) &&
                      order.payment.status !== 'confirmed' && (
                        <DropdownMenuItem className="text-red-600">
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useUserOrders({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.count || 0;

  const orderStats = {
    total: totalOrders,
    pending: orders.filter((order) => order.status === 'pending').length,
    processing: orders.filter((order) => order.status === 'processing').length,
    delivered: orders.filter((order) => order.status === 'delivered').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">Track and manage your purchases</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Package className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{orderStats.total}</span>
            </div>
            <p className="text-blue-100 text-sm">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">
                {orderStats.processing}
              </span>
            </div>
            <p className="text-yellow-100 text-sm">Processing</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <Truck className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">
                {orders.filter((o) => o.status === 'shipped').length}
              </span>
            </div>
            <p className="text-purple-100 text-sm">In Transit</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle2 className="w-8 h-8 opacity-80" />
              <span className="text-2xl font-bold">{orderStats.delivered}</span>
            </div>
            <p className="text-green-100 text-sm">Delivered</p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search by order number, product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start shopping to see your orders here'}
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            orders.map((order, index) => (
              <OrderCard key={order._id} order={order} index={index} />
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {ordersData?.pagination && ordersData.pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Page {currentPage} of {ordersData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= ordersData.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
