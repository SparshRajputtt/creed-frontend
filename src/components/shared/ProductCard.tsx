//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Badge as BadgeIcon,
  Zap,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { addToCartAtom, useAddToCart } from '@/queries';
import { useAtom } from 'jotai';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
  category: {
    name: string;
    slug: string;
  };
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: {
    average: number;
    count: number;
  };
  description?: string;
  variants?: Array<{
    color?: string;
    size?: string;
  }>;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isOutOfStock =
    product?.status === 'out_of_stock' || product?.stock === 0;
  const hasDiscount =
    product?.originalPrice && product?.originalPrice > product?.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product?.originalPrice! - product?.price) / product?.originalPrice!) *
          100
      )
    : 0;

  const handleImageHover = () => {
    if (product?.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleImageLeave = () => {
    setCurrentImageIndex(0);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist API call
  };

  const [, addToCart] = useAtom(addToCartAtom);

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

  if (viewMode === 'list') {
    return (
      <motion.div whileHover={{ y: -2 }} className={cn('group', className)}>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex">
              {/* Image Section */}
              <div className="relative w-80 h-80 flex-shrink-0">
                <Link to={`/products/${product?.slug}`}>
                  <div
                    className="relative w-full h-full overflow-hidden bg-gray-100"
                    onMouseEnter={handleImageHover}
                    onMouseLeave={handleImageLeave}
                  >
                    <img
                      src={
                        product?.images[currentImageIndex]?.url ||
                        '/placeholder.svg'
                      }
                      alt={
                        product?.images[currentImageIndex]?.alt || product?.name
                      }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product?.isNew && (
                        <Badge className="bg-green-500 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                      {hasDiscount && (
                        <Badge className="bg-red-500 text-white">
                          -{discountPercentage}%
                        </Badge>
                      )}
                      {isOutOfStock && (
                        <Badge variant="destructive">
                          <Clock className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
                        onClick={handleWishlistToggle}
                      >
                        <Heart
                          className={cn(
                            'w-4 h-4',
                            isWishlisted
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          )}
                        />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-10 h-10 p-0 rounded-full bg-white/90 hover:bg-white"
                        asChild
                      >
                        <Link to={`/products/${product?.slug}`}>
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/categories/${product?.category.slug}`}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                    >
                      {product?.category.name}
                    </Link>

                    <Link to={`/products/${product?.slug}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                        {product?.name}
                      </h3>
                    </Link>

                    {product?.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {product?.description}
                      </p>
                    )}

                    {/* Rating */}
                    {product?.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'w-4 h-4',
                                i < Math.floor(product?.rating!.average)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product?.rating.count})
                        </span>
                      </div>
                    )}

                    {/* Color variants */}
                    {product?.variants &&
                      product?.variants.some((v) => v.color) && (
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-sm text-gray-600">Colors:</span>
                          <div className="flex gap-1">
                            {product?.variants
                              .filter((v) => v.color)
                              .slice(0, 4)
                              .map((variant, i) => (
                                <div
                                  key={i}
                                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                                  style={{
                                    backgroundColor:
                                      variant.color?.toLowerCase(),
                                  }}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product?.price?.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{product?.originalPrice!?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isOutOfStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn('group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-0">
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Link to={`/products/${product?.slug}`}>
              <div
                onMouseEnter={handleImageHover}
                onMouseLeave={handleImageLeave}
                className="relative w-full h-full"
              >
                <img
                  src={
                    product?.images[currentImageIndex]?.url ||
                    '/placeholder.svg'
                  }
                  alt={product?.images[currentImageIndex]?.alt || product?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product?.isNew && (
                <Badge className="bg-emerald-500 text-white text-xs px-2 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  New
                </Badge>
              )}
              {product?.isFeatured && (
                <Badge className="bg-purple-500 text-white text-xs px-2 py-1">
                  <BadgeIcon className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {hasDiscount && (
                <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-bold">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Stock status */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-9 h-9 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isWishlisted
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-600 hover:text-red-500'
                    )}
                  />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-9 h-9 p-0 rounded-full bg-white/95 hover:bg-white shadow-lg"
                  asChild
                >
                  <Link to={`/products/${product?.slug}`}>
                    <Eye className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Image dots indicator */}
            {product?.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {product?.images.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4">
            <Link
              to={`/categories/${product?.category.slug}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 uppercase tracking-wide"
            >
              {product?.category.name}
            </Link>

            <Link to={`/products/${product?.slug}`}>
              <h3 className="text-lg font-semibold text-gray-900 mt-1 mb-2 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {product?.name}
              </h3>
            </Link>

            {/* Rating */}
            {product?.rating && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product?.rating!.average)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product?.rating.count})
                </span>
              </div>
            )}

            {/* Color variants */}
            {product?.variants && product?.variants.some((v) => v.color) && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-1">
                  {product?.variants
                    .filter((v) => v.color)
                    .slice(0, 4)
                    .map((variant, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-gray-200 shadow-sm"
                        style={{
                          backgroundColor: variant.color?.toLowerCase(),
                        }}
                      />
                    ))}
                  {product?.variants.filter((v) => v.color).length > 4 && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">+</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{product?.price?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product?.originalPrice!.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                disabled={isOutOfStock}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
