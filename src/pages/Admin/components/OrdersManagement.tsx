//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Download,
  Filter,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Edit,
  Save,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react';
import { useOrders } from '@/queries/hooks/order/useOrders';
import {
  useUpdateOrderStatus,
  useUpdateOrderTracking,
} from '@/queries/hooks/order/useUpdateOrderStatus';
import { format } from 'date-fns';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
  },
  confirmed: {
    icon: CheckCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  processing: {
    icon: Package,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  shipped: {
    icon: Truck,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
  },
  delivered: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  cancelled: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
  },
};

const paymentStatusConfig = {
  completed: { color: 'bg-green-100 text-green-800' },
  pending: { color: 'bg-yellow-100 text-yellow-800' },
  failed: { color: 'bg-red-100 text-red-800' },
  refunded: { color: 'bg-gray-100 text-gray-800' },
};

export const OrdersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [trackingUpdateOpen, setTrackingUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [trackingData, setTrackingData] = useState({
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
  });

  const { data: ordersData, isLoading } = useOrders({
    page: currentPage,
    limit: 1000,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    paymentStatus:
      paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
  });

  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updateTrackingMutation = useUpdateOrderTracking();

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusUpdate = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setStatusUpdateOpen(true);
  };

  const handleTrackingUpdate = (order: any) => {
    setSelectedOrder(order);
    setTrackingData({
      trackingNumber: order.shipping?.trackingNumber || '',
      carrier: order.shipping?.carrier || '',
      estimatedDelivery: order.shipping?.estimatedDelivery
        ? format(new Date(order.shipping.estimatedDelivery), 'yyyy-MM-dd')
        : '',
    });
    setTrackingUpdateOpen(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatusMutation.mutateAsync({
        id: selectedOrder._id,
        status: newStatus,
        note: statusNote || undefined,
      });
      setStatusUpdateOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const submitTrackingUpdate = async () => {
    if (!selectedOrder || !trackingData.trackingNumber) return;

    try {
      await updateTrackingMutation.mutateAsync({
        id: selectedOrder._id,
        ...trackingData,
        estimatedDelivery: trackingData.estimatedDelivery || undefined,
      });
      setTrackingUpdateOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update tracking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-600">
              Manage customer orders and fulfillment
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const orders = ordersData?.data || [];

  // Revenue only from delivered orders
  const totalRevenue = orders.reduce(
    (sum, order) =>
      order.status === 'delivered' ? sum + order.pricing.total : sum,
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === 'pending'
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === 'processing'
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === 'delivered'
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
          <Button variant="outline" className="bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    +12.5% from last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-yellow-700">
                  {pendingOrders}
                </p>
                <div className="flex items-center mt-2">
                  <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600">
                    Awaiting confirmation
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Processing</p>
                <p className="text-3xl font-bold text-blue-700">
                  {processingOrders}
                </p>
                <div className="flex items-center mt-2">
                  <Package className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Being prepared</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Completed</p>
                <p className="text-3xl font-bold text-purple-700">
                  {completedOrders}
                </p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">
                    Successfully delivered
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Order Management</CardTitle>
                <CardDescription>
                  Track and manage all customer orders
                </CardDescription>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={paymentStatusFilter}
                  onValueChange={setPaymentStatusFilter}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Order</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Items</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Payment</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {orders.map((order, index) => {
                      const statusInfo =
                        statusConfig[order.status as keyof typeof statusConfig];
                      const StatusIcon = statusInfo?.icon || Clock;

                      return (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">
                                {order.orderNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{order._id.slice(-8)}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {order.user.firstName} {order.user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {order.items.length} items
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {order.items.reduce(
                                  (sum, item) => sum + item.quantity,
                                  0
                                )}{' '}
                                qty
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">
                                ₹{order.pricing.total.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500 capitalize">
                                {order.payment.method.replace('_', ' ')}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={
                                paymentStatusConfig[
                                  order.payment
                                    .status as keyof typeof paymentStatusConfig
                                ]?.color
                              }
                            >
                              {order.payment.status}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${statusInfo?.color} flex items-center gap-1 w-fit`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{order.status}</span>
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {format(
                                  new Date(order.createdAt),
                                  'MMM dd, yyyy'
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(order.createdAt), 'hh:mm a')}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(order)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleTrackingUpdate(order)}
                                >
                                  <Truck className="mr-2 h-4 w-4" />
                                  Update Tracking
                                </DropdownMenuItem>
                                <Separator className="my-1" />
                                {/* <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Invoice
                                </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {ordersData?.pagination && ordersData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t bg-gray-50/50">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(currentPage * 10, ordersData.pagination.totalItems)}{' '}
                  of {ordersData.pagination.totalItems} orders
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= ordersData.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Detail Modal */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-6 p-1">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Name: </span>
                        {selectedOrder.user.firstName}{' '}
                        {selectedOrder.user.lastName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{selectedOrder.user.email}</span>
                      </div>
                      {selectedOrder.shippingAddress.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{selectedOrder.shippingAddress.phone}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="capitalize">
                          {selectedOrder.payment.method.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge
                          className={
                            paymentStatusConfig[
                              selectedOrder.payment
                                .status as keyof typeof paymentStatusConfig
                            ]?.color
                          }
                        >
                          {selectedOrder.payment.status}
                        </Badge>
                      </div>
                      {selectedOrder.payment.transactionId && (
                        <div>
                          <span className="font-medium">Transaction ID:</span>
                          <p className="font-mono text-xs mt-1 p-2 bg-gray-50 rounded">
                            {selectedOrder.payment.transactionId}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          ₹{selectedOrder.pricing.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>
                          ₹{selectedOrder.pricing.tax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>
                          ₹{selectedOrder.pricing.shipping.toLocaleString()}
                        </span>
                      </div>
                      {selectedOrder.pricing.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>
                            -₹{selectedOrder.pricing.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total:</span>
                        <span>
                          ₹{selectedOrder.pricing.total.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Shipping Address */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1">
                      <div className="font-medium">
                        {selectedOrder.shippingAddress.firstName}{' '}
                        {selectedOrder.shippingAddress.lastName}
                      </div>
                      {selectedOrder.shippingAddress.company && (
                        <div className="text-gray-600">
                          {selectedOrder.shippingAddress.company}
                        </div>
                      )}
                      <div className="text-gray-600">
                        {selectedOrder.shippingAddress.address1}
                      </div>
                      {selectedOrder.shippingAddress.address2 && (
                        <div className="text-gray-600">
                          {selectedOrder.shippingAddress.address2}
                        </div>
                      )}
                      <div className="text-gray-600">
                        {selectedOrder.shippingAddress.city},{' '}
                        {selectedOrder.shippingAddress.state}{' '}
                        {selectedOrder.shippingAddress.postalCode}
                      </div>
                      <div className="text-gray-600">
                        {selectedOrder.shippingAddress.country}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Items ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50/50"
                        >
                          <img
                            src={
                              item.product?.images[0]?.url ||
                              '/placeholder.svg?height=60&width=60'
                            }
                            alt={item.name}
                            className="w-15 h-15 rounded-lg object-cover border"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {item.sku}
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              {item.size && (
                                <Badge variant="outline" className="text-xs">
                                  Size: {item.size}
                                </Badge>
                              )}
                              {item.color && (
                                <Badge variant="outline" className="text-xs">
                                  Color: {item.color}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">
                              ₹{item.price.toLocaleString()} × {item.quantity}
                            </div>
                            <div className="text-sm text-gray-500">
                              Subtotal: ₹{item.subtotal.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setStatusUpdateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitStatusUpdate}
                disabled={updateOrderStatusMutation.isPending}
              >
                {updateOrderStatusMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tracking Update Modal */}
      <Dialog open={trackingUpdateOpen} onOpenChange={setTrackingUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Tracking Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="Enter tracking number"
                value={trackingData.trackingNumber}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    trackingNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="carrier">Carrier</Label>
              <Select
                value={trackingData.carrier}
                onValueChange={(value) =>
                  setTrackingData((prev) => ({ ...prev, carrier: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fedex">FedEx</SelectItem>
                  <SelectItem value="ups">UPS</SelectItem>
                  <SelectItem value="dhl">DHL</SelectItem>
                  <SelectItem value="usps">USPS</SelectItem>
                  <SelectItem value="bluedart">Blue Dart</SelectItem>
                  <SelectItem value="dtdc">DTDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={trackingData.estimatedDelivery}
                onChange={(e) =>
                  setTrackingData((prev) => ({
                    ...prev,
                    estimatedDelivery: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setTrackingUpdateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitTrackingUpdate}
                disabled={updateTrackingMutation.isPending}
              >
                {updateTrackingMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Tracking
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
