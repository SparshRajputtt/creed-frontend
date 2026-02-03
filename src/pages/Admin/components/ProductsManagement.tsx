//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  TrendingUp,
  AlertTriangle,
  Filter,
  ArrowUpDown,
  Download,
  Upload,
  Sparkles,
  BarChart3,
  TrendingDown,
} from 'lucide-react';
import { useProducts } from '@/queries/hooks/product/useProducts';
import { useDeleteProduct } from '@/queries/hooks/product/useProductMutations';
import { useCategories } from '@/queries/hooks/category/useCategories';
import { ProductForm } from './ProductForm';
import {
  selectedProductAtom,
  modalOpenAtom,
  modalTypeAtom,
} from '../state/adminAtoms';
import { getImageUrl } from '@/utils/getImageUrl';

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  trend,
  subtitle,
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {title}
        </h3>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
};

const ProductRow = ({ product, onEdit, onDelete, index }) => {
  const getStockStatus = (stock: number, lowStockThreshold: number) => {
    if (stock === 0)
      return {
        label: 'Out of Stock',
        color: 'bg-red-100 text-red-700 border-red-200',
      };
    if (stock <= lowStockThreshold)
      return {
        label: 'Low Stock',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
      };
    return {
      label: 'In Stock',
      color: 'bg-green-100 text-green-700 border-green-200',
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const stockStatus = getStockStatus(
    product?.stock,
    product?.lowStockThreshold
  );

  console.log('Product data:', product?.images[0]?.url);
  return (
    <TableRow className="hover:bg-gray-50/50 transition-colors duration-150 group">
      <TableCell className="py-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={product?.images[0]?.url}
              alt={product?.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-150"
            />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-150">
              {product?.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                {product?.sku}
              </span>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="font-medium border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-150"
        >
          {product?.category.name}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-bold text-gray-900 text-lg">
            ₹{product?.price}
          </div>
          {product?.comparePrice && (
            <div className="text-sm text-gray-500 line-through">
              ₹{product?.comparePrice}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <span className="font-bold text-lg text-gray-900">
            {product?.stock}
          </span>
          <Badge className={`${stockStatus.color} font-semibold shadow-sm`}>
            {stockStatus.label}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`${getStatusColor(
            product?.status
          )} font-semibold shadow-sm capitalize`}
        >
          {product?.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-600 font-medium">
          {new Date(product?.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-gray-100 hover:scale-110 transition-all duration-150"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEdit(product)}
              className="cursor-pointer hover:bg-blue-50"
            >
              <Edit className="mr-3 h-4 w-4 text-blue-600" />
              <span className="font-medium">Edit Product</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-green-50">
              <Eye className="mr-3 h-4 w-4 text-green-600" />
              <span className="font-medium">View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(product?._id)}
              className="cursor-pointer hover:bg-red-50 text-red-600"
            >
              <Trash2 className="mr-3 h-4 w-4" />
              <span className="font-medium">Delete Product</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export const ProductsManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useAtom(selectedProductAtom);
  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  const [modalType, setModalType] = useAtom(modalTypeAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: productsData, isLoading } = useProducts({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  const { data: categories } = useCategories();
  const deleteProductMutation = useDeleteProduct();

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setModalType('create');
    setModalOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(productId);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalProducts = productsData?.pagination?.totalItems || 0;
  const activeProducts =
    productsData?.data?.filter((p) => p.status === 'active').length || 0;
  const lowStockCount =
    productsData?.data?.filter((p) => p.stock <= p.lowStockThreshold).length ||
    0;
  const outOfStockCount =
    productsData?.data?.filter((p) => p.stock === 0).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-600">
                  Manage your store inventory with style
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              onClick={handleCreateProduct}
              className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Products"
            value={totalProducts.toLocaleString()}
            change={12}
            icon={Package}
            color="text-blue-600"
            trend={true}
            subtitle="+12% from last month"
          />
          <StatCard
            title="Active Products"
            value={activeProducts.toLocaleString()}
            change={8.2}
            icon={TrendingUp}
            color="text-green-600"
            trend={true}
            subtitle="Currently available"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockCount.toLocaleString()}
            change={-15}
            icon={AlertTriangle}
            color="text-orange-600"
            trend={true}
            subtitle="Need restocking"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockCount.toLocaleString()}
            change={-25}
            icon={AlertTriangle}
            color="text-red-600"
            trend={true}
            subtitle="Unavailable items"
          />
        </div>

        {/* Enhanced Product Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Product Inventory
                </h3>
                <p className="text-gray-600 mt-1">
                  Complete list of all products in your store
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 border-gray-300">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-40 border-gray-300">
                    <SelectValue placeholder="Category" />
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/80">
                <TableRow className="border-gray-200">
                  <TableHead className="font-bold text-gray-700 py-4">
                    <div className="flex items-center gap-2">
                      Product
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Category
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      Price
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    <div className="flex items-center gap-2">
                      Stock
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-gray-700">
                    Created
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsData?.data?.map((product, index) => (
                  <ProductRow
                    key={product?._id}
                    product={product}
                    index={index}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {productsData?.pagination && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(
                    currentPage * 10,
                    productsData.pagination.totalItems
                  )}{' '}
                  of {productsData.pagination.totalItems} products
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {[
                      ...Array(Math.min(5, productsData.pagination.totalPages)),
                    ].map((_, i) => {
                      const pageNum = currentPage - 2 + i;
                      if (
                        pageNum > 0 &&
                        pageNum <= productsData.pagination.totalPages
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={
                              currentPage === pageNum
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'hover:bg-blue-50 hover:border-blue-300'
                            }
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= productsData.pagination.totalPages}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Form Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                {modalType === 'create' ? 'Create New Product' : 'Edit Product'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              onClose={() => setModalOpen(false)}
              isEdit={modalType === 'edit'}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
