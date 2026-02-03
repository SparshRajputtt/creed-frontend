//@ts-nocheck

import type React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Eye,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  useCancelOrder,
  useRequestReturn,
} from '@/queries/hooks/user/useUserOrders';

interface OrderCardProps {
  order: any;
  index: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'processing':
      return <Package className="w-5 h-5 text-blue-500" />;
    case 'shipped':
      return <Truck className="w-5 h-5 text-purple-500" />;
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Package className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, index }) => {
  const cancelOrderMutation = useCancelOrder();
  const requestReturnMutation = useRequestReturn();

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(order._id);
    }
  };

  const handleRequestReturn = () => {
    const reason = window.prompt('Please provide a reason for the return:');
    if (reason) {
      requestReturnMutation.mutate({ orderId: order._id, reason });
    }
  };

  const canCancel =
    ['pending', 'confirmed'].includes(order.status) &&
    order.payment.status !== 'confirmed';
  const canReturn = order.status === 'delivered' && !order.returnRequested;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border border-gray-200 hover:border-[var(--medium)] transition-all duration-200 hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Order Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getStatusIcon(order.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item: any, idx: number) => (
                    <img
                      key={idx}
                      src={
                        item.product?.images?.[0]?.url ||
                        '/placeholder.svg?height=40&width=40'
                      }
                      alt={item.product?.name}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                  <p className="font-semibold text-gray-900">
                    ₹{order.pricing.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Tracking Info */}
              {order.shipping?.trackingNumber && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tracking Number
                      </p>
                      <p className="text-sm font-mono text-[var(--medium)]">
                        {order.shipping.trackingNumber}
                      </p>
                    </div>
                    <Truck className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Order Progress */}
              {order.status !== 'cancelled' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>Order Progress</span>
                    <span>
                      {order.status === 'delivered'
                        ? '100%'
                        : order.status === 'shipped'
                        ? '75%'
                        : order.status === 'processing'
                        ? '50%'
                        : '25%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[var(--medium)] to-[var(--dark)] h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          order.status === 'delivered'
                            ? '100%'
                            : order.status === 'shipped'
                            ? '75%'
                            : order.status === 'processing'
                            ? '50%'
                            : '25%',
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Placed</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 lg:w-48">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                asChild
              >
                <Link to={`/orders/${order._id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>

              {canCancel && (
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  disabled={cancelOrderMutation.isPending}
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
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
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Request Return
                </Button>
              )}

              {order.status === 'delivered' && (
                <Button
                  className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                  asChild
                >
                  <Link
                    to={`/products/${order.items[0]?.product?.slug}?review=true`}
                  >
                    Write Review
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
