//@ts-nocheck
'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface OrderItemsProps {
  items: Array<{
    product: {
      _id: string;
      name: string;
      slug: string;
      images: Array<{
        url: string;
        alt?: string;
      }>;
    };
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    sku: string;
    subtotal: number;
  }>;
  orderStatus: string;
}

export const OrderItems: React.FC<OrderItemsProps> = ({
  items,
  orderStatus,
}) => {
  console.log('OrderItems rendered with items:', items);
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={`${item.product?._id}-${item.size}-${item.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        '/placeholder.svg?height=120&width=120'
                      }
                      alt={item.product?.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <Link
                          to={`/products/${item.product?.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors"
                        >
                          {item.product?.name}
                        </Link>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>SKU: {item.sku}</span>
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

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-sm text-gray-600">
                            Price: ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{item.subtotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                            asChild
                          >
                            <Link to={`/products/${item.product?.slug}`}>
                              View Product
                            </Link>
                          </Button>

                          {orderStatus === 'delivered' && (
                            <Button
                              size="sm"
                              className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                              asChild
                            >
                              <Link
                                to={`/products/${item.product?.slug}?review=true`}
                              >
                                <Star className="w-4 h-4 mr-2" />
                                Write Review
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
