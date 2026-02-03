//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingCart,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Tag,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAtom } from 'jotai';
import { cartItemsAtom, cartSubtotalAtom } from '@/queries/store/cart';
import {
  appliedCouponAtom,
  setCouponAtom,
  removeCouponAtom,
} from '@/queries/store/coupon';
import { useValidateCoupon } from '@/queries/hooks/coupon';
import { toast } from 'sonner';

export const CartSummary: React.FC = () => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const [appliedCoupon] = useAtom(appliedCouponAtom);
  const [, setCoupon] = useAtom(setCouponAtom);
  const [, removeCoupon] = useAtom(removeCouponAtom);
  const [promoCode, setPromoCode] = useState('');
  const [couponError, setCouponError] = useState<string>('');

  const validateCouponMutation = useValidateCoupon();

  const calculateGST = () => {
    let totalGST = 0;

    cartItems.forEach((item) => {
      const gstRate = item.product?.gst || 18;
      const itemGST = (item.itemTotal * gstRate) / 100;
      totalGST += itemGST;
    });

    return Math.round(totalGST);
  };

  // const getGSTBreakdown = () => {
  //   const gstBreakdown = { 12: 0, 18: 0 };

  //   cartItems.forEach((item) => {
  //     const gstRate = item.product?.gst || 18;
  //     const itemGST = (item.itemTotal * gstRate) / 100;

  //     if (gstRate === 12) {
  //       gstBreakdown[12] += itemGST;
  //     } else {
  //       gstBreakdown[18] += itemGST;
  //     }
  //   });

  //   return {
  //     gst12: Math.round(gstBreakdown[12]),
  //     gst18: Math.round(gstBreakdown[18]),
  //     total: Math.round(gstBreakdown[12] + gstBreakdown[18]),
  //   };
  // };

  // const tax = calculateGST();
  // const gstBreakdown = getGSTBreakdown();

  const shippingCost = cartSubtotal >= 500 ? 0 : 59;
  // Calculate totals with coupon discount
  const subtotalAfterDiscount = appliedCoupon
    ? cartSubtotal - appliedCoupon.discountAmount
    : cartSubtotal;

  const total = subtotalAfterDiscount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;

    setCouponError('');

    try {
      const response = await validateCouponMutation.mutateAsync({
        code: promoCode.toUpperCase(),
        orderAmount: cartSubtotal,
        cartItems: cartItems.map((item) => ({
          productId: item.product?._id,
          quantity: item.quantity,
          price: item.product?.price,
        })),
      });

      if (response.success) {
        // Match your actual API response structure
        const couponData = response.data;
        const discountAmount = response.data.discountAmount;

        setCoupon({
          code: couponData.code,
          type: couponData.type,
          value: couponData.value,
          discountAmount: discountAmount,
          description: couponData.description,
        });

        setPromoCode('');
        setCouponError('');
        toast.success(
          `Coupon applied! You saved ₹${discountAmount.toFixed(2)}`
        );
      } else {
        setCouponError(response.message || 'Invalid coupon code');
      }
    } catch (error: any) {
      console.error('Coupon validation error:', error);
      setCouponError(
        error.response?.data?.message ||
          error.message ||
          'Failed to validate coupon. Please try again.'
      );
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
    toast.success('Coupon removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg sticky top-24">
          <CardHeader className="bg-gradient-to-r from-[var(--lightest)] to-white">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[var(--medium)]" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Promo Code Section */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={validateCouponMutation.isPending}
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={
                    !promoCode.trim() || validateCouponMutation.isPending
                  }
                  variant="outline"
                  className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent min-w-[80px]"
                >
                  {validateCouponMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>

              {/* Coupon Error */}
              {couponError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {couponError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Applied Coupon */}
              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-green-800">
                        {appliedCoupon.code} Applied
                      </span>
                      {appliedCoupon.description && (
                        <p className="text-xs text-green-600 mt-1">
                          {appliedCoupon.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-700 h-6 px-2"
                  >
                    Remove
                  </Button>
                </motion.div>
              )}
            </div>

            <Separator />

            {/* Order Totals */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal ({cartItems.length} items)
                </span>
                <span className="font-medium">₹{cartSubtotal.toFixed(2)}</span>
              </div>

              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between text-sm"
                >
                  <span className="text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Coupon Discount ({appliedCoupon.code})
                  </span>
                  <span className="font-medium text-green-600">
                    -₹{appliedCoupon.discountAmount.toFixed(2)}
                  </span>
                </motion.div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Free
                    </Badge>
                  ) : (
                    `₹${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax </span>
                <span className="font-medium">All Taxes Included</span>
              </div>

              {/* GST Breakdown */}
              <div className="pl-4 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>GST </span>
                  <span>All Taxes Included</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[var(--medium)]">
                  ₹{total.toFixed(2)}
                </span>
              </div>

              {/* Savings Display */}
              {appliedCoupon && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-2 bg-green-50 rounded-lg"
                >
                  <span className="text-sm text-green-800 font-medium">
                    🎉 You saved ₹{appliedCoupon.discountAmount.toFixed(2)} with
                    this coupon!
                  </span>
                </motion.div>
              )}
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 text-lg group"
              asChild
            >
              <Link to="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Continue Shopping */}
            <Button
              variant="outline"
              className="w-full border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
              asChild
            >
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Fast Shipping</p>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Long Life</p>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
