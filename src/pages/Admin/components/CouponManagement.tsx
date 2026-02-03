//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Plus,
  Ticket,
  TrendingUp,
  Users,
  Calendar,
  Percent,
  DollarSign,
  Tag,
  Download,
  Copy,
  BarChart3,
  Gift,
} from 'lucide-react';
// import {
//   useCoupons,
//   useCreateCoupon,
//   useUpdateCoupon,
//   useDeleteCoupon,
//   useCouponStats,
// } from '@/queries/hooks/coupons/useCoupons';
import { format } from 'date-fns';
import {
  useCoupons,
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from '@/queries';

const couponTypeConfig = {
  percentage: {
    icon: Percent,
    color: 'bg-green-100 text-green-800 border-green-200',
    bgColor: 'bg-green-50',
  },
  fixed: {
    icon: DollarSign,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
  },
  'free-shipping': {
    icon: Gift,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
  },
};

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800' },
  inactive: { color: 'bg-red-100 text-red-800' },
  expired: { color: 'bg-gray-100 text-gray-800' },
};

export const CouponManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [couponDetailOpen, setCouponDetailOpen] = useState(false);
  const [createEditOpen, setCreateEditOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<any>(null);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minimumOrderAmount: '',
    maximumDiscountAmount: '',
    usageLimit: '',
    usageLimitPerUser: '1',
    validFrom: '',
    validUntil: '',
    firstTimeUserOnly: false,
    isActive: true,
  });

  const { data: couponsData, isLoading } = useCoupons({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
  });

  const createCouponMutation = useCreateCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const handleViewCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setCouponDetailOpen(true);
  };

  const handleCreateCoupon = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      description: '',
      type: 'percentage',
      value: '',
      minimumOrderAmount: '',
      maximumDiscountAmount: '',
      usageLimit: '',
      usageLimitPerUser: '1',
      validFrom: '',
      validUntil: '',
      firstTimeUserOnly: false,
      isActive: true,
    });
    setCreateEditOpen(true);
  };

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value.toString(),
      minimumOrderAmount: coupon.minimumOrderAmount?.toString() || '',
      maximumDiscountAmount: coupon.maximumDiscountAmount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      usageLimitPerUser: coupon.usageLimitPerUser?.toString() || '1',
      validFrom: format(new Date(coupon.validFrom), 'yyyy-MM-dd'),
      validUntil: format(new Date(coupon.validUntil), 'yyyy-MM-dd'),
      firstTimeUserOnly: coupon.firstTimeUserOnly,
      isActive: coupon.isActive,
    });
    setCreateEditOpen(true);
  };

  const handleDeleteCoupon = (coupon: any) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      value: parseFloat(formData.value),
      minimumOrderAmount: formData.minimumOrderAmount
        ? parseFloat(formData.minimumOrderAmount)
        : undefined,
      maximumDiscountAmount: formData.maximumDiscountAmount
        ? parseFloat(formData.maximumDiscountAmount)
        : undefined,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit)
        : undefined,
      usageLimitPerUser: parseInt(formData.usageLimitPerUser),
    };

    try {
      if (editingCoupon) {
        await updateCouponMutation.mutateAsync({
          id: editingCoupon._id,
          ...payload,
        });
      } else {
        await createCouponMutation.mutateAsync(payload);
      }
      setCreateEditOpen(false);
    } catch (error) {
      console.error('Failed to save coupon:', error);
    }
  };

  const confirmDeleteCoupon = async () => {
    if (!couponToDelete) return;

    try {
      await deleteCouponMutation.mutateAsync(couponToDelete._id);
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  const getCouponStatus = (coupon: any) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'inactive';
    if (validUntil < now) return 'expired';
    if (validFrom > now) return 'scheduled';
    return 'active';
  };

  const getDiscountDisplay = (coupon: any) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}%`;
    } else if (coupon.type === 'fixed') {
      return `₹${coupon.value}`;
    } else {
      return 'Free Shipping';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Coupon Management
            </h1>
            <p className="text-gray-600">
              Manage discount coupons and promotions
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const coupons = couponsData?.data || [];
  const totalCoupons = couponsData?.pagination?.totalItems || 0;
  const activeCoupons = coupons.filter(
    (coupon) => getCouponStatus(coupon) === 'active'
  ).length;
  const usedCoupons = coupons.reduce(
    (acc, coupon) => acc + (coupon.usedCount || 0),
    0
  );
  const totalDiscount = coupons.reduce(
    (acc, coupon) => acc + (coupon.totalDiscountGiven || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Coupon Management
          </h1>
          <p className="text-gray-600">
            Manage discount coupons and promotions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Coupons
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleCreateCoupon}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Coupons
                </p>
                <p className="text-3xl font-bold text-blue-700">
                  {totalCoupons}
                </p>
                <div className="flex items-center mt-2">
                  <Ticket className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">
                    All coupons created
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Active Coupons
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {activeCoupons}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    Currently available
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Total Usage
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {usedCoupons}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">
                    Times redeemed
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  Total Savings
                </p>
                <p className="text-3xl font-bold text-orange-700">
                  ₹{totalDiscount.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <Gift className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">
                    Customer savings
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Coupons Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Coupon Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage discount coupons
                </CardDescription>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free-shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Code</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Discount</TableHead>
                    <TableHead className="font-semibold">Usage</TableHead>
                    <TableHead className="font-semibold">Valid Until</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {coupons.map((coupon, index) => {
                      const typeInfo =
                        couponTypeConfig[
                          coupon.type as keyof typeof couponTypeConfig
                        ];
                      const TypeIcon = typeInfo?.icon || Tag;
                      const status = getCouponStatus(coupon);

                      return (
                        <motion.tr
                          key={coupon._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge className="font-mono text-sm bg-gray-100 text-gray-800 border">
                                {coupon.code}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyCouponCode(coupon.code)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900 truncate">
                                {coupon.description}
                              </div>
                              {coupon.minimumOrderAmount > 0 && (
                                <div className="text-sm text-gray-500">
                                  Min order: ₹{coupon.minimumOrderAmount}
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={`${typeInfo?.color} flex items-center gap-1 w-fit`}
                            >
                              <TypeIcon className="w-3 h-3" />
                              <span className="capitalize">
                                {coupon.type.replace('-', ' ')}
                              </span>
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {getDiscountDisplay(coupon)}
                            </div>
                            {coupon.maximumDiscountAmount && (
                              <div className="text-sm text-gray-500">
                                Max: ₹{coupon.maximumDiscountAmount}
                              </div>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {coupon.usedCount || 0}
                                {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {coupon.usageLimit ? 'Limited' : 'Unlimited'}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {format(
                                  new Date(coupon.validUntil),
                                  'MMM dd, yyyy'
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(coupon.validUntil), 'hh:mm a')}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={
                                statusConfig[
                                  status as keyof typeof statusConfig
                                ]?.color
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => handleViewCoupon(coupon)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditCoupon(coupon)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Coupon
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => copyCouponCode(coupon.code)}
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy Code
                                </DropdownMenuItem>
                                <Separator className="my-1" />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCoupon(coupon)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Coupon
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {couponsData?.pagination &&
              couponsData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * 10 + 1} to{' '}
                    {Math.min(
                      currentPage * 10,
                      couponsData.pagination.totalItems
                    )}{' '}
                    of {couponsData.pagination.totalItems} coupons
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={
                        currentPage >= couponsData.pagination.totalPages
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create/Edit Coupon Dialog */}
      <Dialog open={createEditOpen} onOpenChange={setCreateEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., SAVE20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                    {/* <SelectItem value="free-shipping">Free Shipping</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the coupon"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.type === 'percentage'
                    ? 'Percentage (%)'
                    : formData.type === 'fixed'
                    ? 'Amount (₹)'
                    : 'Value'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder={formData.type === 'percentage' ? '20' : '100'}
                  required={formData.type !== 'free-shipping'}
                  disabled={formData.type === 'free-shipping'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumOrderAmount">
                  Minimum Order Amount (₹)
                </Label>
                <Input
                  id="minimumOrderAmount"
                  type="number"
                  value={formData.minimumOrderAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minimumOrderAmount: e.target.value,
                    })
                  }
                  placeholder="500"
                />
              </div>
            </div>

            {formData.type === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="maximumDiscountAmount">
                  Maximum Discount Amount (₹)
                </Label>
                <Input
                  id="maximumDiscountAmount"
                  type="number"
                  value={formData.maximumDiscountAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maximumDiscountAmount: e.target.value,
                    })
                  }
                  placeholder="1000"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Total Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  placeholder="100 (leave empty for unlimited)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimitPerUser">Usage Limit Per User</Label>
                <Input
                  id="usageLimitPerUser"
                  type="number"
                  value={formData.usageLimitPerUser}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      usageLimitPerUser: e.target.value,
                    })
                  }
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, validFrom: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="firstTimeUserOnly"
                  checked={formData.firstTimeUserOnly}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, firstTimeUserOnly: checked })
                  }
                />
                <Label htmlFor="firstTimeUserOnly">First-time users only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createCouponMutation.isPending ||
                  updateCouponMutation.isPending
                }
              >
                {createCouponMutation.isPending ||
                updateCouponMutation.isPending
                  ? editingCoupon
                    ? 'Updating...'
                    : 'Creating...'
                  : editingCoupon
                  ? 'Update Coupon'
                  : 'Create Coupon'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Coupon Detail Modal */}
      <Dialog open={couponDetailOpen} onOpenChange={setCouponDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Coupon Details
            </DialogTitle>
          </DialogHeader>
          {selectedCoupon && (
            <div className="space-y-6">
              {/* Coupon Header */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedCoupon.code}
                  </h3>
                  <p className="text-gray-600">{selectedCoupon.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        couponTypeConfig[
                          selectedCoupon.type as keyof typeof couponTypeConfig
                        ]?.color
                      }
                    >
                      {selectedCoupon.type.replace('-', ' ')}
                    </Badge>
                    <Badge
                      className={
                        statusConfig[
                          getCouponStatus(
                            selectedCoupon
                          ) as keyof typeof statusConfig
                        ]?.color
                      }
                    >
                      {getCouponStatus(selectedCoupon)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCouponCode(selectedCoupon.code)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>

              {/* Coupon Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {getDiscountDisplay(selectedCoupon)}
                    </div>
                    <div className="text-sm text-gray-600">Discount</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedCoupon.usedCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Times Used</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹
                      {(
                        selectedCoupon.totalDiscountGiven || 0
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Savings</div>
                  </CardContent>
                </Card>
              </div>

              {/* Coupon Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Coupon Information
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Minimum Order</div>
                    <div className="font-medium">
                      {selectedCoupon.minimumOrderAmount
                        ? `₹${selectedCoupon.minimumOrderAmount}`
                        : 'No minimum'}
                    </div>
                  </div>

                  {selectedCoupon.maximumDiscountAmount && (
                    <div>
                      <div className="text-sm text-gray-600">
                        Maximum Discount
                      </div>
                      <div className="font-medium">
                        ₹{selectedCoupon.maximumDiscountAmount}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-sm text-gray-600">Usage Limit</div>
                    <div className="font-medium">
                      {selectedCoupon.usageLimit
                        ? selectedCoupon.usageLimit
                        : 'Unlimited'}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Per User Limit</div>
                    <div className="font-medium">
                      {selectedCoupon.usageLimitPerUser}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Valid from:</span>
                    <span className="ml-2 font-medium">
                      {format(
                        new Date(selectedCoupon.validFrom),
                        'MMMM dd, yyyy'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-600">Valid until:</span>
                    <span className="ml-2 font-medium">
                      {format(
                        new Date(selectedCoupon.validUntil),
                        'MMMM dd, yyyy'
                      )}
                    </span>
                  </div>

                  {selectedCoupon.firstTimeUserOnly && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">
                        First-time users only
                      </span>
                    </div>
                  )}
                </div>

                {selectedCoupon.createdBy && (
                  <div>
                    <div className="text-sm text-gray-600">Created by</div>
                    <div className="font-medium">
                      {selectedCoupon.createdBy.firstName}{' '}
                      {selectedCoupon.createdBy.lastName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              coupon <strong>{couponToDelete?.code}</strong> and all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCoupon}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCouponMutation.isPending}
            >
              {deleteCouponMutation.isPending ? 'Deleting...' : 'Delete Coupon'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
