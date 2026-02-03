//@ts-nocheck

import type React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAdminDashboard } from '@/queries/hooks/admin/useAdminDashboard';

export const TopProducts: React.FC = () => {
  const { data: stats, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats?.topProducts) return null;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best selling products this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats?.topProducts?.map((product, index) => (
            <div key={product?._id} className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    (product?.images?.length > 0
                      ? product.images[0]?.url
                      : null) || '/placeholder.svg?height=48&width=48'
                  }
                  alt={product?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product?.name}
                </p>
                <p className="text-sm text-gray-500">₹{product?.price}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {product?.soldCount} sold
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
