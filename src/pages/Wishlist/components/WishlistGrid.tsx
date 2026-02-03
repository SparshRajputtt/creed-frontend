//@ts-nocheck

import type React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist, useRemoveFromWishlist } from '@/queries/hooks/user';
import { useAtom } from 'jotai';
import { addToCartAtom } from '@/queries/store/cart';
import { toast } from 'react-hot-toast';

export const WishlistGrid: React.FC = () => {
  const { data: wishlistData, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [, addToCart] = useAtom(addToCartAtom);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist.mutateAsync(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product: any) => {
    if (!product) return;

    if (product?.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Create cart item similar to ProductDetail component
    const cartItem = {
      productId: product?._id,
      quantity: 1,
      variant:
        product?.variants && product?.variants.length > 0
          ? product?.variants[0]
          : null,
      product: {
        _id: product?._id,
        name: product?.name,
        price: product?.price,
        comparePrice: product?.comparePrice,
        images: product?.images,
        stock: product?.stock,
        slug: product?.slug,
        shortDescription: product?.shortDescription,
        description: product?.description,
        gst: product?.gst || 0,
      },
    };

    addToCart(cartItem);
    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!wishlistData || wishlistData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Heart className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start adding products you love to your wishlist and keep track of
          items you want to purchase later.
        </p>
        <Button
          className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
          asChild
        >
          <Link to="/products">Browse Products</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <AnimatePresence>
        {wishlistData.map((wishlistItem, index) => {
          // Extract product from wishlist item
          const product = wishlistItem.product || wishlistItem;

          return (
            <motion.div
              key={product?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden">
                  <Link to={`/products/${product?.slug}`}>
                    <img
                      src={
                        product?.images?.[0]?.url ||
                        '/placeholder.svg?height=300&width=300'
                      }
                      alt={product?.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Discount Badge */}
                  {product?.comparePrice &&
                    product?.comparePrice > product?.price && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        {Math.round(
                          ((product?.comparePrice - product?.price) /
                            product?.comparePrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}

                  {/* Status Badge */}
                  {product?.stock === 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-12 bg-gray-800 text-white"
                    >
                      Out of Stock
                    </Badge>
                  )}

                  {/* Remove from Wishlist */}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleRemoveFromWishlist(product?._id)}
                    disabled={removeFromWishlist.isPending}
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </Button>

                  {/* Quick Add to Cart */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product?.stock === 0}
                      className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Link to={`/products/${product?.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors line-clamp-2">
                        {product?.name}
                      </h3>
                    </Link>

                    {/* Category */}
                    {product?.category && (
                      <p className="text-sm text-gray-500">
                        {product?.category.name}
                      </p>
                    )}

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product?.ratings?.average || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product?.ratings?.count || 0})
                      </span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{product?.price.toFixed(2)}
                        </span>
                        {product?.comparePrice &&
                          product?.comparePrice > product?.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product?.comparePrice.toFixed(2)}
                            </span>
                          )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(product?._id)}
                        disabled={removeFromWishlist.isPending}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Stock Status */}
                    {/* <div className="text-sm">
                      {product?.stock > 10 ? (
                        <span className="text-green-600 font-medium">
                          In Stock
                        </span>
                      ) : product?.stock > 0 ? (
                        <span className="text-yellow-600 font-medium">
                          Only {product?.stock} left
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
