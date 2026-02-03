//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAtom } from 'jotai';
import {
  cartItemsAtom,
  cartSubtotalAtom,
  updateCartItemAtom,
  removeFromCartAtom,
} from '@/queries/store/cart';
import {
  appliedCouponAtom,
  setCouponAtom,
  removeCouponAtom,
} from '@/queries/store/coupon';
import { useValidateCoupon } from '@/queries/hooks/coupon';
import { toast } from 'sonner';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [cartSubtotal] = useAtom(cartSubtotalAtom);
  const [, updateCartItem] = useAtom(updateCartItemAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const [appliedCoupon] = useAtom(appliedCouponAtom);
  const [, setCoupon] = useAtom(setCouponAtom);
  const [, removeCoupon] = useAtom(removeCouponAtom);
  const [promoCode, setPromoCode] = useState('');
  const [couponError, setCouponError] = useState<string>('');

  const validateCouponMutation = useValidateCoupon();

  // const getGSTBreakdown = () => {
  //   const gstBreakdown = { 12: 0, 18: 0 };

  //   cartItems.forEach((item) => {
  //     const gstRate = item?.product?.gst || 18;
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

  // const gstBreakdown = getGSTBreakdown();
  const shippingCost = cartSubtotal >= 500 ? 0 : 59;

  // Calculate totals with coupon discount
  const subtotalAfterDiscount = appliedCoupon
    ? cartSubtotal - appliedCoupon.discountAmount
    : cartSubtotal;

  const total = subtotalAfterDiscount + shippingCost;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[var(--lightest)] to-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[var(--medium)]" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Cart ({cartItems.length})
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {cartItems.length === 0 ? (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Add some products to get started
                      </p>
                      <Button
                        onClick={onClose}
                        className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                        asChild
                      >
                        <Link to="/products">Browse Products</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        >
                          {/* Product Image */}
                          <Link
                            to={`/products/${item?.product?.slug}`}
                            onClick={onClose}
                            className="flex-shrink-0"
                          >
                            <img
                              src={
                                item?.product?.images?.[0]?.url ||
                                '/placeholder.svg?height=80&width=80'
                              }
                              alt={item?.product?.name}
                              className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition-transform"
                            />
                          </Link>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/products/${item?.product?.slug}`}
                              onClick={onClose}
                              className="block"
                            >
                              <h3 className="font-medium text-gray-900 hover:text-[var(--medium)] transition-colors line-clamp-2">
                                {item?.product?.name}
                              </h3>
                            </Link>

                            {/* Variants */}
                            {(item?.size || item?.color) && (
                              <div className="flex gap-2 mt-1">
                                {item?.size && (
                                  <Badge variant="outline" className="text-xs">
                                    Size: {item?.size}
                                  </Badge>
                                )}
                                {item?.color && (
                                  <Badge variant="outline" className="text-xs">
                                    Color: {item?.color}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Price and Quantity */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item?.quantity <= 1}
                                  className="h-7 w-7 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item?.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item?._id,
                                      item?.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item?.quantity >= item?.product?.stock
                                  }
                                  className="h-7 w-7 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  ₹{item?.itemTotal?.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  ₹{item?.product?.price?.toFixed(2)} each
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item?._id)}
                              className="mt-2 h-7 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 justify-start"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="border-t bg-white p-6 space-y-4">
                    {/* Promo Code Section */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={promoCode}
                          onChange={(e) =>
                            setPromoCode(e.target.value.toUpperCase())
                          }
                          onKeyPress={handleKeyPress}
                          className="flex-1"
                          disabled={validateCouponMutation.isPending}
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={
                            !promoCode.trim() ||
                            validateCouponMutation.isPending
                          }
                          variant="outline"
                          className="border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent min-w-[70px]"
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
                        <Alert className="border-red-200 bg-red-50 py-2">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <AlertDescription className="text-red-800 text-sm">
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
                                {appliedCoupon.code}
                              </span>
                              <p className="text-xs text-green-600">
                                -₹{appliedCoupon.discountAmount.toFixed(2)}{' '}
                                saved
                              </p>
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

                    {/* Order Summary */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ₹{cartSubtotal?.toFixed(2)}
                        </span>
                      </div>

                      {appliedCoupon && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-between"
                        >
                          <span className="text-green-600 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            Coupon ({appliedCoupon.code})
                          </span>
                          <span className="font-medium text-green-600">
                            -₹{appliedCoupon.discountAmount.toFixed(2)}
                          </span>
                        </motion.div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">
                          {shippingCost === 0
                            ? 'Free'
                            : `₹${shippingCost.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (GST)</span>
                        <span className="font-medium">All taxes included</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-base font-semibold">
                        <span>Total</span>
                        <span className="text-[var(--medium)]">
                          ₹{total?.toFixed(2)}
                        </span>
                      </div>

                      {/* Savings Display */}
                      {appliedCoupon && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center p-2 bg-green-50 rounded-lg"
                        >
                          <span className="text-xs text-green-800 font-medium">
                            🎉 You saved ₹
                            {appliedCoupon.discountAmount.toFixed(2)}!
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 group"
                        asChild
                      >
                        <Link to="/checkout" onClick={onClose}>
                          Checkout
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[var(--medium)] text-[var(--medium)] hover:bg-[var(--lightest)] bg-transparent"
                        asChild
                      >
                        <Link to="/cart" onClick={onClose}>
                          View Full Cart
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
