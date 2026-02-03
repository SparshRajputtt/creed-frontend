//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,
  ArrowUpDown,
  SlidersHorizontal,
  X,
  Eye,
} from 'lucide-react';
import { useProducts } from '@/queries/hooks/product';
import { useCategories } from '@/queries/hooks/category';
import {
  useAddToWishlist,
  useCart,
  useRemoveFromWishlist,
  useWishlist,
} from '@/queries/hooks/user';
import { addToCartAtom, useAuth } from '@/queries';
import { useAtom } from 'jotai';
import { toast } from 'sonner';

interface ProductsProps {}

export const Products: React.FC<ProductsProps> = () => {
  const navigate = useNavigate(); // Added this missing hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
  });

  // Build query parameters properly
  const queryParams = {
    page: filters.page,
    limit: 12,
    ...(filters.search && { search: filters.search }),
    ...(filters.category &&
      filters.category !== 'all' && { category: filters.category }),
    ...(filters.minPrice && { minPrice: parseFloat(filters.minPrice) }),
    ...(filters.maxPrice && { maxPrice: parseFloat(filters.maxPrice) }),
    sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}`,
  };

  const { data: productsData, isLoading } = useProducts(queryParams);
  const { data: categories } = useCategories();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleSearchSubmit = () => {
    updateFilter('search', searchValue);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
    setSearchValue('');
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

  const ProductCard = ({ product, index }: { product: any; index: number }) => {
    // Move these hooks to the component level
    const { data: wishlistData, isLoading: wishlistLoading } = useWishlist();
    const { isAuthenticated, user } = useAuth();
    const addToWishlistMutation = useAddToWishlist();
    const removeFromWishlistMutation = useRemoveFromWishlist();

    // Check if product is in wishlist with improved logic
    const isInWishlist = React.useMemo(() => {
      if (!wishlistData || !Array.isArray(wishlistData) || !product?._id) {
        return false;
      }

      return wishlistData.some((item) => {
        // Handle different possible structures more robustly
        const itemProductId =
          item?.product?._id ||
          item?.productId ||
          item?._id ||
          item?.product?.id ||
          item?.id;

        const currentProductId = product?._id || product?.id;

        // Convert both to strings and compare
        return String(itemProductId) === String(currentProductId);
      });
    }, [wishlistData, product?._id]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent any default behavior
      e.stopPropagation(); // Prevent event bubbling

      if (!isAuthenticated) {
        toast.error('Please login to add items to wishlist');
        navigate('/login');
        return;
      }

      if (!product?._id) {
        toast.error('Product information is missing');
        return;
      }

      // Prevent multiple rapid clicks
      if (
        addToWishlistMutation.isLoading ||
        removeFromWishlistMutation.isLoading
      ) {
        return;
      }

      try {
        if (isInWishlist) {
          await removeFromWishlistMutation.mutateAsync(product._id);
          toast.success('Removed from wishlist');
        } else {
          await addToWishlistMutation.mutateAsync(product._id);
          toast.success('Added to wishlist');
        }
      } catch (error) {
        console.error('Wishlist error:', error);

        // More specific error handling
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update wishlist';
        toast.error(errorMessage);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group"
      >
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
                  <Badge variant="destructive" className="text-xs px-2 py-1">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-100 transition-opacity duration-200">
                <Button
                  onClick={handleWishlistToggle}
                  size="icon"
                  variant="secondary"
                  disabled={
                    wishlistLoading ||
                    addToWishlistMutation.isLoading ||
                    removeFromWishlistMutation.isLoading
                  }
                  className={`h-7 w-7 lg:h-8 lg:w-8 bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${
                    isInWishlist ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  <Heart
                    className={`h-3 w-3 lg:h-4 lg:w-4 ${
                      isInWishlist ? 'fill-current' : ''
                    }`}
                  />
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
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 lg:p-4 flex-1 flex flex-col">
              <div className="flex-1">
                {/* Product Name */}
                <Link to={`/products/${product?.slug}`}>
                  <h3 className="font-medium lg:font-semibold text-sm lg:text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {product?.name}
                  </h3>
                </Link>

                {/* Rating */}
                {product?.ratings?.count > 0 && (
                  <div className="flex items-center mb-2 lg:mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product?.ratings?.average || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-1 lg:ml-2">
                      ({product?.ratings?.count})
                    </span>
                  </div>
                )}

                {/* Short Description - Hidden on mobile */}
                {product?.shortDescription && (
                  <p className="hidden lg:block text-xs text-muted-foreground mb-3 line-clamp-2">
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
                      ₹{product?.price?.toFixed(2)}
                    </span>
                    {product?.comparePrice &&
                      product?.comparePrice > product?.price && (
                        <span className="text-xs lg:text-sm text-muted-foreground line-through">
                          ₹{product?.comparePrice?.toFixed(2)}
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
      </motion.div>
    );
  };

  const ProductListItem = ({
    product,
    index,
  }: {
    product: any;
    index: number;
  }) => {
    // Add wishlist functionality to list items too
    const { data: wishlistData } = useWishlist();
    const { isAuthenticated } = useAuth();
    const addToWishlistMutation = useAddToWishlist();
    const removeFromWishlistMutation = useRemoveFromWishlist();

    const isInWishlist = React.useMemo(() => {
      if (!wishlistData || !Array.isArray(wishlistData) || !product?._id) {
        return false;
      }

      return wishlistData.some((item) => {
        const itemProductId =
          item?.product?._id ||
          item?.productId ||
          item?._id ||
          item?.product?.id ||
          item?.id;

        const currentProductId = product?._id || product?.id;

        return String(itemProductId) === String(currentProductId);
      });
    }, [wishlistData, product?._id]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error('Please login to add items to wishlist');
        navigate('/login');
        return;
      }

      if (!product?._id) {
        toast.error('Product information is missing');
        return;
      }

      if (
        addToWishlistMutation.isLoading ||
        removeFromWishlistMutation.isLoading
      ) {
        return;
      }

      try {
        if (isInWishlist) {
          await removeFromWishlistMutation.mutateAsync(product._id);
          toast.success('Removed from wishlist');
        } else {
          await addToWishlistMutation.mutateAsync(product._id);
          toast.success('Added to wishlist');
        }
      } catch (error) {
        console.error('Wishlist error:', error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to update wishlist';
        toast.error(errorMessage);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Link to={`/products/${product?.slug}`} className="flex-shrink-0">
                <img
                  src={
                    product?.images?.[0]?.url ||
                    '/placeholder.svg?height=120&width=120'
                  }
                  alt={product?.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>

              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">
                      {product?.category?.name}
                    </Badge>
                    <Link to={`/products/${product?.slug}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors">
                        {product?.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{product?.price?.toLocaleString()}
                      </span>
                      {product?.comparePrice &&
                        product?.comparePrice > product?.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product?.comparePrice?.toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {product?.shortDescription || product?.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
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

                    {product?.stock <= product?.lowStockThreshold &&
                      product?.stock > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-orange-600"
                        >
                          Only {product?.stock} left
                        </Badge>
                      )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-8 w-8 p-0 transition-colors ${
                        isInWishlist ? 'text-red-500' : 'text-gray-600'
                      }`}
                      onClick={handleWishlistToggle}
                      disabled={
                        addToWishlistMutation.isLoading ||
                        removeFromWishlistMutation.isLoading
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isInWishlist ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product?.stock === 0}
                      className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-64 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 lg:mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Products
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Discover our amazing collection of products
          </p>
        </motion.div>

        {/* Filters and Search - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 lg:p-6 mb-6 lg:mb-8"
        >
          {/* Search - Full width on mobile */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-10 text-sm"
            />
            <Button
              onClick={handleSearchSubmit}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-3 text-xs bg-[var(--medium)] hover:bg-[var(--dark)]"
            >
              Search
            </Button>
          </div>

          {/* Filters Row - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <Select
                value={filters.category}
                onValueChange={(value) => updateFilter('category', value)}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-');
                  updateFilter('sortBy', sortBy);
                  updateFilter('sortOrder', sortOrder);
                }}
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="ratings.average-desc">
                    Highest Rated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between sm:justify-start gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 p-0 ${
                    viewMode === 'grid'
                      ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                      : ''
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 p-0 ${
                    viewMode === 'list'
                      ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                      : ''
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Advanced Filters Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 h-8 px-3 text-xs"
              >
                <SlidersHorizontal className="h-3 w-3" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      size="sm"
                      className="flex items-center gap-2 h-8 px-3 text-xs"
                    >
                      <X className="h-3 w-3" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-4 lg:mb-6"
        >
          <p className="text-gray-600 text-sm">
            Showing {productsData?.data?.length || 0} of{' '}
            {productsData?.pagination?.totalItems || 0} products
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              <AnimatePresence>
                {productsData?.data?.map((product, index) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {productsData?.data?.map((product, index) => (
                  <ProductListItem
                    key={product?._id}
                    product={product}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {productsData?.pagination && productsData.pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-2 mt-8 lg:mt-12"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('page', filters.page - 1)}
              disabled={filters.page === 1}
              className="text-xs px-3"
            >
              Previous
            </Button>

            {Array.from(
              { length: Math.min(5, productsData.pagination.totalPages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={filters.page === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateFilter('page', page)}
                    className={`h-8 w-8 p-0 text-xs ${
                      filters.page === page
                        ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                        : ''
                    }`}
                  >
                    {page}
                  </Button>
                );
              }
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('page', filters.page + 1)}
              disabled={filters.page >= productsData.pagination.totalPages}
              className="text-xs px-3"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {productsData?.data?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 lg:py-16"
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4 text-sm lg:text-base">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[var(--medium)] hover:bg-[var(--dark)] text-sm"
              size="sm"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
