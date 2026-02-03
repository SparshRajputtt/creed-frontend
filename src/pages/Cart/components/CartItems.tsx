//@ts-nocheck

import type React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useAtom } from 'jotai';
import {
  cartItemsAtom,
  updateCartItemAtom,
  removeFromCartAtom,
} from '@/queries/store/cart';
import { useAddToWishlist } from '@/queries/hooks/user';

export const CartItems: React.FC = () => {
  const [cartItems] = useAtom(cartItemsAtom);
  const [, updateCartItem] = useAtom(updateCartItemAtom);
  const [, removeFromCart] = useAtom(removeFromCartAtom);
  const addToWishlistMutation = useAddToWishlist();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleMoveToWishlist = async (item: any) => {
    try {
      await addToWishlistMutation.mutateAsync(item.product?._id);
      removeFromCart(item._id);
    } catch (error) {
      console.error('Move to wishlist error:', error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">Add some products to get started</p>
        <Button
          className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white group"
          asChild
        >
          <Link to="/products">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 ">
      <AnimatePresence>
        {cartItems.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border border-gray-200 hover:border-[var(--medium)] transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <Link
                    to={`/products/${item.product?.slug}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={
                        item.product?.images?.[0]?.url ||
                        '/placeholder.svg?height=120&width=120'
                      }
                      alt={item.product?.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <Link to={`/products/${item.product?.slug}`}>
                        <h3 className="font-semibold text-lg text-gray-900 hover:text-[var(--medium)] transition-colors line-clamp-2">
                          {item.product?.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                        {item.product?.shortDescription ||
                          item.product?.description}
                      </p>
                    </div>

                    {/* Variants */}
                    {(item.size || item.color) && (
                      <div className="flex gap-2">
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
                    )}

                    {/* Price and Stock */}
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{item.product?.price.toFixed(2)}
                        </span>
                        {item.product?.comparePrice &&
                          item.product?.comparePrice > item.product?.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{item.product?.comparePrice.toFixed(2)}
                            </span>
                          )}
                      </div>
                      <Badge
                        className={`text-xs ${
                          item.product?.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : item.product?.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.product?.stock > 10
                          ? 'In Stock'
                          : item.product?.stock > 0
                          ? `${item.product?.stock} left`
                          : 'Out of Stock'}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                          Quantity:
                        </span>
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.product?.stock}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                Math.max(
                                  1,
                                  Number.parseInt(e.target.value) || 1
                                )
                              )
                            }
                            className="w-16 text-center border-0 focus:ring-0 h-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product?.stock}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveToWishlist(item)}
                          disabled={addToWishlistMutation.isPending}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          Save for Later
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Item Total */}
                  {/* <div className="flex-shrink-10 text-left">
                    <div className="text-xl font-bold text-gray-900">
                      ${item.itemTotal.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">
                      ${item.product?.price.toFixed(2)} × {item.quantity}
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
