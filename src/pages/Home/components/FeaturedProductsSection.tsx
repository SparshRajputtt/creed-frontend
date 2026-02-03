//@ts-nocheck
import type React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useFeaturedProducts } from '@/queries/hooks/product/useProducts';
import { addToCartAtom, useAddToCart } from '@/queries';
import { useAtom } from 'jotai';

export const FeaturedProductsSection: React.FC = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(8);

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

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 lg:mb-12 gap-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base">
                Handpicked favorites from our premium collection
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-3 lg:p-4 space-y-2">
                    <div className="h-3 lg:h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-2 lg:h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 lg:h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 lg:mb-12 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-sm lg:text-base">
              Handpicked favorites from our premium collection
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="self-start sm:self-auto"
          >
            <Link to="/products?featured=true">
              <span className="hidden sm:inline">View All</span>
              <span className="sm:hidden">All Products</span>
              <ArrowRight className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
            </Link>
          </Button>
        </div>

        {featuredProducts && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <Card
                key={product?._id}
                className="group hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 border hover:border-primary/20 h-full flex flex-col overflow-hidden"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-muted/50">
                    <Link
                      to={`/products/${product?.slug}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={
                          product?.images[0]?.url ||
                          '/placeholder.svg?height=300&width=300'
                        }
                        alt={product?.images[0]?.alt || product?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product?.discountPercentage > 0 && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">
                          -{product?.discountPercentage}%
                        </Badge>
                      )}
                      {product?.stock <= product?.lowStockThreshold &&
                        product?.stock > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-orange-100 border-orange-300 text-orange-800 text-xs px-2 py-1"
                          >
                            Low Stock
                          </Badge>
                        )}
                      {product?.stock === 0 && (
                        <Badge
                          variant="destructive"
                          className="text-xs px-2 py-1"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 lg:h-8 lg:w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <Heart className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 lg:h-8 lg:w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                        asChild
                      >
                        <Link to={`/products/${product?.slug}`}>
                          <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Quick Add to Cart - Bottom overlay */}
                    {product?.stock > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="p-2 lg:p-3">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="w-full h-7 lg:h-8 text-xs lg:text-sm bg-white text-black hover:bg-gray-100"
                          >
                            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                            <span className="hidden sm:inline">
                              Add to Cart
                            </span>
                            <span className="sm:hidden">Add</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 lg:p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      {/* Brand */}
                      {/* {product?.brand && (
                        <p className="text-xs lg:text-sm text-muted-foreground mb-1 uppercase tracking-wide">
                          {product?.brand}
                        </p>
                      )} */}

                      {/* Product Name */}
                      <Link to={`/products/${product?.slug}`}>
                        <h3 className="font-medium lg:font-semibold text-sm lg:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {product?.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      {product?.ratings.count > 0 && (
                        <div className="flex items-center mb-2 lg:mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product?.ratings.average)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1 lg:ml-2">
                            ({product?.ratings.count})
                          </span>
                        </div>
                      )}

                      {/* Short Description - Hidden on mobile */}
                      {product?.shortDescription && (
                        <p className="lg:block text-xs text-muted-foreground mb-3 line-clamp-2">
                          {product?.shortDescription.slice(0, 40)}...
                        </p>
                      )}
                    </div>

                    {/* Price and Stock Info */}
                    <div className="mt-auto">
                      {/* Price */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <span className="font-bold text-primary text-sm lg:text-base">
                            ₹{product?.price.toFixed(2)}
                          </span>
                          {product?.comparePrice &&
                            product?.comparePrice > product?.price && (
                              <span className="text-xs lg:text-sm text-muted-foreground line-through">
                                ₹{product?.comparePrice.toFixed(2)}
                              </span>
                            )}
                        </div>

                        {/* Stock Count - Small indicator */}
                        {product?.stock > 0 && product?.stock <= 20 && (
                          <span className="hidden lg:block text-xs text-muted-foreground">
                            {product?.stock} left
                          </span>
                        )}
                      </div>

                      {/* Additional Info Row */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {/* Sold Count */}
                        {product?.soldCount > 0 && (
                          <span>{product?.soldCount} sold</span>
                        )}

                        {/* SKU - Hidden on mobile */}
                        <span className="hidden lg:inline text-xs">
                          SKU: {product?.sku}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
