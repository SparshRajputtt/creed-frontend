//@ts-nocheck

import type React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useSearchParams } from 'react-router-dom';
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
  Grid3X3,
  List,
  Star,
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  X,
  ArrowLeft,
} from 'lucide-react';
import {
  useCategoryBySlug,
  useCategoryProducts,
} from '@/queries/hooks/category';
import {
  useAddToWishlist,
  useCart,
  useRemoveFromWishlist,
  useWishlist,
} from '@/queries/hooks/user';
import { addToCartAtom, useAuth, userAtom } from '@/queries';
import { useAtom } from 'jotai';
import { toast } from 'sonner';

export const CategoryProducts: React.FC = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: Number.parseInt(searchParams.get('page') || '1'),
  });

  // Get category by slug first
  const { data: category, isLoading: categoryLoading } = useCategoryBySlug(
    slug!
  );

  const { data: wishlistData } = useWishlist();

  const { isAuthenticated, user } = useAuth();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    const isInWishlist = wishlistData?.some((item) => {
      // Handle different possible structures
      const itemProductId = item?.product?._id || item?.productId || item?._id;
      const currentProductId = product?._id || product?.id;

      return String(itemProductId) === String(currentProductId);
    });

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync(product?._id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlistMutation.mutateAsync(product?._id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  // Then fetch products for this specific category
  const { data: productsData, isLoading: productsLoading } =
    useCategoryProducts(category?._id, {
      page: filters.page,
      limit: 12,
      search: filters.search || undefined,
      minPrice: filters.minPrice
        ? Number.parseFloat(filters.minPrice)
        : undefined,
      maxPrice: filters.maxPrice
        ? Number.parseFloat(filters.maxPrice)
        : undefined,
      sort: `${filters.sortOrder === 'desc' ? '-' : ''}${filters.sortBy}`,
    });

  const isLoading = categoryLoading || productsLoading;

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    });
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

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Category Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The category you're looking for doesn't exist.
          </p>
          <Link to="/categories">
            <Button className="bg-[var(--medium)] hover:bg-[var(--dark)]">
              Browse Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
        >
          <Link to="/" className="hover:text-[var(--medium)]">
            Home
          </Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-[var(--medium)]">
            Categories
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </motion.nav>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="p-0 h-auto"
                >
                  <Link
                    to="/categories"
                    className="flex items-center gap-1 text-[var(--medium)] hover:text-[var(--dark)]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Categories
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                {category.description}
              </p>
              <div className="flex items-center gap-4">
                {/* <Badge className="bg-[var(--lightest)] text-[var(--medium)] border-[var(--light)]">
                  {productsData?.pagination?.totalItems ||
                    productsData?.count ||
                    0}{' '}
                  Products
                </Badge> */}
                {category.isPopular && (
                  <Badge className="bg-[var(--medium)] text-white">
                    Popular Category
                  </Badge>
                )}
              </div>

              {/* {category.children.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
                    Subcategories
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {category.children.map((child) => (
                      <Link
                        key={child._id}
                        to={`/categories/${child.slug}`}
                        className="inline-block"
                      >
                        <Badge
                          variant="outline"
                          className="hover:bg-[var(--lightest)] hover:border-[var(--medium)] transition-colors cursor-pointer"
                        >
                          {child.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
            {category.image?.url && (
              <div className="relative">
                <img
                  src={category.image.url || '/placeholder.svg'}
                  alt={category.name}
                  className="w-full md:h-104 h-64 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Subcategories
            </h2>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory._id}
                  to={`/categories/${subcategory.slug}`}
                  className="inline-block"
                >
                  <Badge
                    variant="outline"
                    className="hover:bg-[var(--lightest)] hover:border-[var(--medium)] transition-colors cursor-pointer"
                  >
                    {subcategory.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search in ${category.name}...`}
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                updateFilter('sortBy', sortBy);
                updateFilter('sortOrder', sortOrder);
              }}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={
                  viewMode === 'grid'
                    ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                    : ''
                }
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={
                  viewMode === 'list'
                    ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                    : ''
                }
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Price
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Price
                    </label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <X className="h-4 w-4" />
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
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <p className="text-gray-600">
            Showing {productsData?.data?.length || 0} of{' '}
            {productsData?.pagination?.totalItems || productsData?.count || 0}{' '}
            products in {category.name}
          </p>
        </motion.div>

        {/* Products Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {productsData?.data?.map((product, index) => (
                  <motion.div
                    key={product?._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product?.isFeatured && (
                            <Badge className="bg-[var(--medium)] text-white">
                              Featured
                            </Badge>
                          )}
                          {product?.comparePrice &&
                            product?.comparePrice > product?.price && (
                              <Badge variant="destructive">
                                -
                                {Math.round(
                                  ((product?.comparePrice - product?.price) /
                                    product?.comparePrice) *
                                    100
                                )}
                                %
                              </Badge>
                            )}
                          {product?.stock === 0 && (
                            <Badge variant="secondary">Out of Stock</Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => handleWishlistToggle(product)}
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>

                        {/* Quick Add to Cart */}
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product?.stock === 0}
                            className="w-full bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                            size="sm"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
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

                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i <
                                    Math.floor(product?.ratings?.average || 0)
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

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">
                                ₹{product?.price.toLocaleString()}
                              </span>
                              {product?.comparePrice &&
                                product?.comparePrice > product?.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ₹{product?.comparePrice.toLocaleString()}
                                  </span>
                                )}
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
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {productsData?.data?.map((product, index) => (
                  <motion.div
                    key={product?._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Link
                            to={`/products/${product?.slug}`}
                            className="flex-shrink-0"
                          >
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
                                <Link to={`/products/${product?.slug}`}>
                                  <h3 className="font-semibold text-gray-900 hover:text-[var(--medium)] transition-colors">
                                    {product?.name}
                                  </h3>
                                </Link>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-gray-900">
                                    ₹{product?.price.toLocaleString()}
                                  </span>
                                  {product?.comparePrice &&
                                    product?.comparePrice > product?.price && (
                                      <span className="text-sm text-gray-500 line-through">
                                        ₹
                                        {product?.comparePrice.toLocaleString()}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                              {product?.shortDescription ||
                                product?.description}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i <
                                          Math.floor(
                                            product?.ratings?.average || 0
                                          )
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
                                  onClick={() => handleWishlistToggle(product)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 bg-transparent"
                                >
                                  <Heart className="h-4 w-4" />
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
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-2 mt-12"
          >
            <Button
              variant="outline"
              onClick={() => updateFilter('page', filters.page - 1)}
              disabled={filters.page === 1}
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
                    onClick={() => updateFilter('page', page)}
                    className={
                      filters.page === page
                        ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                        : ''
                    }
                  >
                    {page}
                  </Button>
                );
              }
            )}

            <Button
              variant="outline"
              onClick={() => updateFilter('page', filters.page + 1)}
              disabled={filters.page >= productsData.pagination.totalPages}
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
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found in {category.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={clearFilters}
              className="bg-[var(--medium)] hover:bg-[var(--dark)]"
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
