//@ts-nocheck

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  User,
  ThumbsUp,
  MessageCircle,
  Send,
} from 'lucide-react';
import {
  useProductBySlug, // Changed from useProducts to useProductBySlug
  useProductReviews,
  useCreateReview,
} from '@/queries/hooks/product';
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from '@/queries/hooks/user';
import { useAuth } from '@/queries/hooks/auth/useAuth';
import { useAtom } from 'jotai';
import { addToCartAtom } from '@/queries/store/cart';
import { toast } from 'react-hot-toast';
import { marked } from 'marked';

const parseMarkdown = (text) => {
  if (!text) return '';

  let html = text
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')

    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')

    // Lists - bullet points
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')

    // Lists - numbered
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')

    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

    // Line breaks
    .replace(/\n/gim, '<br/>');

  // Wrap consecutive <li> elements in <ul>
  html = html.replace(
    /(<li>.*?<\/li>)(\s*<br\s*\/?>)*(\s*<li>.*?<\/li>)*/gim,
    (match) => {
      return '<ul>' + match.replace(/<br\s*\/?>/g, '') + '</ul>';
    }
  );

  return html;
};

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
  });

  // Fixed: Use useProductBySlug instead of useProducts
  const { data: product, isLoading } = useProductBySlug(slug!);

  const { data: wishlistData } = useWishlist();
  const { data: reviewsData } = useProductReviews(product?._id);
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const createReviewMutation = useCreateReview();
  const [, addToCart] = useAtom(addToCartAtom);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  // Removed the [0] access since product is now a single object, not an array
  const reviews = reviewsData?.data || [];

  console.log('Wishlist Data:', wishlistData);
  const isInWishlist = wishlistData?.some((item) => {
    // Handle different possible structures
    const itemProductId = item?.product?._id || item?.productId || item?._id;
    const currentProductId = product?._id || product?.id;

    return String(itemProductId) === String(currentProductId);
  });

  console.log('Inwishlist:', isInWishlist);

  useEffect(() => {
    if (product?.variants && product?.variants.length > 0) {
      setSelectedVariant(product?.variants[0]);
      if (product?.variants[0].size) setSelectedSize(product?.variants[0].size);
      if (product?.variants[0].color)
        setSelectedColor(product?.variants[0].color);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product?._id,
      quantity,
      variant: selectedVariant,
      product: {
        _id: product?._id,
        name: product?.name,
        price: product?.price,
        comparePrice: product?.comparePrice,
        images: product?.images,
        stock: selectedVariant?.stock || product?.stock,
        slug: product?.slug,
        shortDescription: product?.shortDescription,
        description: product?.description,
        gst: product?.gst || 0, // Ensure GST is included
      },
    };

    addToCart(cartItem);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!product) return;

    try {
      await createReviewMutation.mutateAsync({
        productId: product?._id,
        ...reviewForm,
      });
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (error) {
      console.error('Review error:', error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((review) => review.rating === rating).length /
            reviews.length) *
          100
        : 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 bg-gray-200 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h1>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-[var(--medium)]">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[var(--medium)]">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/categories/${product?.category?.slug}`}
            className="hover:text-[var(--medium)]"
          >
            {product?.category?.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              <img
                src={
                  product?.images?.[selectedImageIndex]?.url ||
                  '/placeholder.svg?height=600&width=600'
                }
                alt={product?.name}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {product?.images && product?.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev > 0 ? prev - 1 : product?.images.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev < product?.images.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Discount Badge */}
              {product?.comparePrice &&
                product?.comparePrice > product?.price && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    {Math.round(
                      ((product?.comparePrice - product?.price) /
                        product?.comparePrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                )}
            </div>

            {/* Thumbnail Images */}
            {product?.images && product?.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product?.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-[var(--medium)] shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url || '/placeholder.svg?height=80&width=80'}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product?.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
                <Badge
                  className={`${
                    product?.stock > 10
                      ? 'bg-green-100 text-green-800'
                      : product?.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product?.stock > 10
                    ? 'In Stock'
                    : product?.stock > 0
                    ? `${product?.stock} left`
                    : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product?.price.toFixed(2)}
              </span>
              {product?.comparePrice &&
                product?.comparePrice > product?.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product?.comparePrice.toFixed(2)}
                  </span>
                )}
            </div>

            {/* Short Description */}
            {product?.shortDescription && (
              <p className="text-gray-600 text-lg leading-relaxed">
                {product?.shortDescription}
              </p>
            )}

            {/* Variants */}
            {product?.variants && product?.variants.length > 0 && (
              <div className="space-y-4">
                {/* Size Selection */}
                {product?.variants.some((v) => v.size) && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Size
                    </Label>
                    <div className="flex gap-2">
                      {[
                        ...new Set(
                          product?.variants.map((v) => v.size).filter(Boolean)
                        ),
                      ].map((size) => (
                        <Button
                          key={size}
                          variant={
                            selectedSize === size ? 'default' : 'outline'
                          }
                          onClick={() => {
                            setSelectedSize(size);
                            const variant = product?.variants.find(
                              (v) =>
                                v.size === size &&
                                (!selectedColor || v.color === selectedColor)
                            );
                            if (variant) setSelectedVariant(variant);
                          }}
                          className={
                            selectedSize === size
                              ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                              : ''
                          }
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product?.variants.some((v) => v.color) && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Color
                    </Label>
                    <div className="flex gap-2">
                      {[
                        ...new Set(
                          product?.variants.map((v) => v.color).filter(Boolean)
                        ),
                      ].map((color) => (
                        <Button
                          key={color}
                          variant={
                            selectedColor === color ? 'default' : 'outline'
                          }
                          onClick={() => {
                            setSelectedColor(color);
                            const variant = product?.variants.find(
                              (v) =>
                                v.color === color &&
                                (!selectedSize || v.size === selectedSize)
                            );
                            if (variant) setSelectedVariant(variant);
                          }}
                          className={
                            selectedColor === color
                              ? 'bg-[var(--medium)] hover:bg-[var(--dark)]'
                              : ''
                          }
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Quantity
                  </Label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      disabled={quantity <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      max={selectedVariant?.stock || product?.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              selectedVariant?.stock || product?.stock,
                              Number.parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      className="w-20 text-center border-0 focus:ring-0 h-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.min(
                            selectedVariant?.stock || product?.stock,
                            prev + 1
                          )
                        )
                      }
                      disabled={
                        quantity >= (selectedVariant?.stock || product?.stock)
                      }
                      className="h-10 w-10 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={product?.stock === 0}
                  className="flex-1 bg-[var(--medium)] hover:bg-[var(--dark)] text-white h-12 text-lg group"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  disabled={
                    addToWishlistMutation.isPending ||
                    removeFromWishlistMutation.isPending
                  }
                  className={`h-12 w-12 p-0 ${
                    isInWishlist
                      ? 'text-red-500 border-red-200 hover:bg-red-50'
                      : 'hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-12 p-0 bg-transparent"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
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
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="prose max-w-none">
                    <div
                      className="markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(
                          product?.description ||
                            product?.shortDescription ||
                            'No description available.'
                        ),
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Custom Specifications */}
                    {product?.specifications &&
                      Object.entries(product?.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between py-2 border-b border-gray-100"
                          >
                            <span className="font-medium text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        )
                      )}

                    {/* Basic Product Info */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">SKU</span>
                      <span className="text-gray-600">{product?.sku}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">
                        Category
                      </span>
                      <span className="text-gray-600">
                        {product?.category?.name}
                      </span>
                    </div>

                    {product?.subcategory && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Subcategory
                        </span>
                        <span className="text-gray-600">
                          {product?.subcategory?.name}
                        </span>
                      </div>
                    )}

                    {product?.brand && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Brand</span>
                        <span className="text-gray-600">{product?.brand}</span>
                      </div>
                    )}

                    {/* Physical Properties */}
                    {product?.weight?.value && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Weight
                        </span>
                        <span className="text-gray-600">
                          {product?.weight?.value} {product?.weight?.unit}
                        </span>
                      </div>
                    )}

                    {product?.capacity?.value && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Capacity
                        </span>
                        <span className="text-gray-600">
                          {product?.capacity?.value} {product?.capacity?.unit}
                        </span>
                      </div>
                    )}

                    {product?.dimensions &&
                      (product?.dimensions?.length ||
                        product?.dimensions?.width ||
                        product?.dimensions?.height) && (
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="font-medium text-gray-900">
                            Dimensions
                          </span>
                          <span className="text-gray-600">
                            {product?.dimensions?.length &&
                            product?.dimensions?.width &&
                            product?.dimensions?.height
                              ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit}`
                              : [
                                  product?.dimensions?.length &&
                                    `L: ${product.dimensions.length}${product.dimensions.unit}`,
                                  product?.dimensions?.width &&
                                    `W: ${product.dimensions.width}${product.dimensions.unit}`,
                                  product?.dimensions?.height &&
                                    `H: ${product.dimensions.height}${product.dimensions.unit}`,
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                          </span>
                        </div>
                      )}

                    {/* Stock Information */}
                    {/* <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">
                        Stock Status
                      </span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          product?.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product?.stock <= product?.lowStockThreshold
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product?.stock === 0
                          ? 'Out of Stock'
                          : product?.stock <= product?.lowStockThreshold
                          ? `Low Stock (${product?.stock})`
                          : `In Stock (${product?.stock})`}
                      </span>
                    </div> */}

                    {/* Product Type & Shipping */}
                    {/* <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">
                        Product Type
                      </span>
                      <span className="text-gray-600">
                        {product?.isDigital ? 'Digital' : 'Physical'}
                      </span>
                    </div> */}

                    {/* {!product?.isDigital && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Shipping Required
                        </span>
                        <span className="text-gray-600">
                          {product?.shippingRequired ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )} */}

                    {/* Tax Information */}
                    {product?.taxable && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Taxable
                        </span>
                        <span className="text-gray-600">Yes</span>
                      </div>
                    )}

                    {/* {product?.gst && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">GST</span>
                        <span className="text-gray-600">{product?.gst}%</span>
                      </div>
                    )} */}

                    {/* Sales Information */}
                    {/* {product?.soldCount > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Units Sold
                        </span>
                        <span className="text-gray-600">
                          {product?.soldCount}
                        </span>
                      </div>
                    )} */}

                    {product?.ratings?.count > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Rating
                        </span>
                        <span className="text-gray-600">
                          {product?.ratings?.average?.toFixed(1)} / 5.0 (
                          {product?.ratings?.count} reviews)
                        </span>
                      </div>
                    )}

                    {/* Features */}
                    {product?.features && product?.features?.length > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">
                          Features
                        </span>
                        <div className="flex flex-col gap-1 text-right">
                          {product?.features
                            ?.slice(0, 3)
                            .map((feature, index) => (
                              <span
                                key={index}
                                className="text-gray-600 text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          {product?.features?.length > 3 && (
                            <span className="text-gray-500 text-xs">
                              +{product?.features?.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {/* {product?.tags && product?.tags?.length > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">Tags</span>
                        <div className="flex gap-1 flex-wrap justify-end">
                          {product?.tags?.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reviews Summary */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{reviews.length} reviews</p>
                    </div>

                    <div className="space-y-2">
                      {ratingDistribution.map(
                        ({ rating, count, percentage }) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-8">
                              {rating}★
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {count}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List and Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Write Review Form */}
                  {isAuthenticated && (
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Write a Review
                        </h3>
                        <form
                          onSubmit={handleReviewSubmit}
                          className="space-y-4"
                        >
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Rating
                            </Label>
                            <div className="flex gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() =>
                                    setReviewForm({
                                      ...reviewForm,
                                      rating: i + 1,
                                    })
                                  }
                                  className="p-1"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      i < reviewForm.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300 hover:text-yellow-400'
                                    } transition-colors`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="reviewTitle"
                              className="text-sm font-medium mb-2 block"
                            >
                              Title
                            </Label>
                            <Input
                              id="reviewTitle"
                              value={reviewForm.title}
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  title: e.target.value,
                                })
                              }
                              placeholder="Summarize your review"
                              required
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="reviewComment"
                              className="text-sm font-medium mb-2 block"
                            >
                              Review
                            </Label>
                            <Textarea
                              id="reviewComment"
                              value={reviewForm.comment}
                              onChange={(e) =>
                                setReviewForm({
                                  ...reviewForm,
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Share your thoughts about this product"
                              rows={4}
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={createReviewMutation.isPending}
                            className="bg-[var(--medium)] hover:bg-[var(--dark)] text-white"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {createReviewMutation.isPending
                              ? 'Submitting...'
                              : 'Submit Review'}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 text-center">
                          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No reviews yet
                          </h3>
                          <p className="text-gray-600">
                            Be the first to review this product
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      reviews.map((review, index) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-gray-900">
                                      {review.user?.firstName}{' '}
                                      {review.user?.lastName}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'text-yellow-400 fill-current'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-gray-900 mb-2">
                                    {review.title}
                                  </h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    {review.comment}
                                  </p>

                                  {review.helpful > 0 && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                                      <ThumbsUp className="w-4 h-4 text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {review.helpful} people found this
                                        helpful
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};
