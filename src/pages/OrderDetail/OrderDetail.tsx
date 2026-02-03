//@ts-nocheck

import type React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Phone,
  Mail,
  Download,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  useUserOrder,
  useCancelOrder,
  useRequestReturn,
} from '@/queries/hooks/user/useUserOrders';
import { OrderTimeline, OrderItems } from './components';

export const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useUserOrder(orderId!);
  const cancelOrderMutation = useCancelOrder();
  const requestReturnMutation = useRequestReturn();

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId!);
    }
  };

  const handleRequestReturn = () => {
    const reason = window.prompt('Please provide a reason for the return:');
    if (reason) {
      requestReturnMutation.mutate({ orderId: orderId!, reason });
    }
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download
    window.open(`/api/orders/${orderId}/invoice`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--lightest)] via-white to-[var(--lightest)] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--medium)] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--lightest)] via-white to-[var(--lightest)] py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The order you're looking for doesn't exist or you don't have
                access to it.
              </p>
              <Button
                asChild
                className="bg-[var(--medium)] hover:bg-[var(--dark)]"
              >
                <Link to="/orders">Back to Orders</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canCancel =
    ['pending', 'confirmed'].includes(order.status) &&
    order.payment.status !== 'confirmed';
  const canReturn = order.status === 'delivered' && !order.returnRequested;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--lightest)] via-white to-[var(--lightest)] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link to="/orders">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* <Button
                variant="outline"
                onClick={handleDownloadInvoice}
                className="bg-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button> */}

              {canCancel && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  disabled={cancelOrderMutation.isPending}
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              )}

              {canReturn && (
                <Button
                  variant="outline"
                  onClick={handleRequestReturn}
                  disabled={requestReturnMutation.isPending}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Request Return
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <OrderItems items={order.items} orderStatus={order.status} />
            </motion.div>

            {/* Order Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <OrderTimeline
                    statusHistory={order.statusHistory}
                    currentStatus={order.status}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{order.pricing.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ₹{order.pricing.shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ₹{order.pricing.tax.toFixed(2)}
                    </span>
                  </div>
                  {order.pricing.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -₹{order.pricing.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{order.pricing.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {order.shippingAddress.firstName}{' '}
                      {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p className="text-gray-600">
                        {order.shippingAddress.company}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {order.shippingAddress.address1}
                    </p>
                    {order.shippingAddress.address2 && (
                      <p className="text-gray-600">
                        {order.shippingAddress.address2}
                      </p>
                    )}
                    <p className="text-gray-600">
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-600">
                      {order.shippingAddress.country}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="text-gray-600 flex items-center gap-1 mt-2">
                        <Phone className="w-3 h-3" />
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium capitalize">
                        {order.payment.method.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Status</span>
                      <Badge
                        className={
                          order.payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {order.payment.status.charAt(0).toUpperCase() +
                          order.payment.status.slice(1)}
                      </Badge>
                    </div>
                    {order.payment.transactionId && (
                      <div className="text-sm">
                        <span className="text-gray-600">Transaction ID:</span>
                        <p className="font-mono text-xs mt-1 p-2 bg-gray-50 rounded">
                          {order.payment.transactionId}
                        </p>
                      </div>
                    )}
                    {order.payment.paidAt && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Paid On</span>
                        <span className="font-medium">
                          {new Date(order.payment.paidAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shipping Information */}
            {order.shipping?.trackingNumber && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.shipping.carrier && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Carrier</span>
                          <span className="font-medium">
                            {order.shipping.carrier}
                          </span>
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-gray-600">Tracking Number:</span>
                        <p className="font-mono text-xs mt-1 p-2 bg-gray-50 rounded">
                          {order.shipping.trackingNumber}
                        </p>
                      </div>
                      {order.shipping.estimatedDelivery && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Estimated Delivery
                          </span>
                          <span className="font-medium">
                            {new Date(
                              order.shipping.estimatedDelivery
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {order.shipping.shippedAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipped On</span>
                          <span className="font-medium">
                            {new Date(
                              order.shipping.shippedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {order.shipping.deliveredAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivered On</span>
                          <span className="font-medium">
                            {new Date(
                              order.shipping.deliveredAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Have questions about your order? Our support team is here
                      to help.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="justify-start bg-white"
                        asChild
                      >
                        <a href="mailto:helpdesk@thpl.co.in">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Support
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start bg-white"
                        asChild
                      >
                        <a href="tel:+91 9897967727">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Support
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
