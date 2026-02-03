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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  UserPlus,
  Users,
  Crown,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShoppingBag,
  TrendingUp,
  UserCheck,
  Download,
} from 'lucide-react';
import {
  useAdminUsers,
  useUpdateUserRole,
  useToggleUserStatus,
  useDeleteUser,
} from '@/queries/hooks/admin/useAdminUsers';
import { format } from 'date-fns';

const roleConfig = {
  admin: {
    icon: Crown,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    bgColor: 'bg-purple-50',
  },
  seller: {
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
  },
  user: {
    icon: User,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    bgColor: 'bg-gray-50',
  },
};

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800' },
  inactive: { color: 'bg-red-100 text-red-800' },
  suspended: { color: 'bg-yellow-100 text-yellow-800' },
};

export const UsersManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const { data: usersData, isLoading } = useAdminUsers({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useToggleUserStatus();
  const deleteUserMutation = useDeleteUser();

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateStatusMutation.mutateAsync({ userId, status: newStatus });
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUserMutation.mutateAsync(userToDelete._id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
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

  const users = usersData?.data || [];
  const totalUsers = usersData?.pagination.totalItems;
  const activeUsers = usersData?.pagination.totalItems; //users.filter((user) => user.status === 'active').length;
  const adminUsers = users.filter((user) => user.role === 'admin').length;
  const sellerUsers = users.filter((user) => user.role === 'seller').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-700">{totalUsers}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">
                    +8.2% from last month
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {activeUsers}
                </p>
                <div className="flex items-center mt-2">
                  <UserCheck className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">
                    {((activeUsers / totalUsers) * 100).toFixed(1)}% active
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Admins</p>
                <p className="text-3xl font-bold text-purple-700">
                  {adminUsers}
                </p>
                <div className="flex items-center mt-2">
                  <Crown className="w-4 h-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600">
                    Admin accounts
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Sellers</p>
                <p className="text-3xl font-bold text-orange-700">
                  {sellerUsers}
                </p>
                <div className="flex items-center mt-2">
                  <Shield className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">
                    Seller accounts
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {/* <SelectItem value="seller">Seller</SelectItem> */}
                    <SelectItem value="user">User</SelectItem>
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
                    <SelectItem value="suspended">Suspended</SelectItem>
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
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Contact</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    {/* <TableHead className="font-semibold">Status</TableHead> */}
                    <TableHead className="font-semibold">Orders</TableHead>
                    <TableHead className="font-semibold">Joined</TableHead>
                    <TableHead className="text-right font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {users.map((user, index) => {
                      const roleInfo =
                        roleConfig[user.role as keyof typeof roleConfig];
                      const RoleIcon = roleInfo?.icon || User;

                      return (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={user.avatar || '/placeholder.svg'}
                                  alt={user.firstName}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{user.username || user.email.split('@')[0]}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-3 h-3 mr-2 text-gray-400" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Phone className="w-3 h-3 mr-2 text-gray-400" />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user._id, value)
                              }
                              disabled={updateRoleMutation.isPending}
                            >
                              <SelectTrigger className="w-32">
                                <Badge
                                  className={`${roleInfo?.color} flex items-center gap-1 border-0`}
                                >
                                  <RoleIcon className="w-3 h-3" />
                                  <span className="capitalize">
                                    {user.role}
                                  </span>
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    Admin
                                  </div>
                                </SelectItem>
                                {/* <SelectItem value="seller">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Seller
                                  </div>
                                </SelectItem> */}
                                <SelectItem value="user">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    User
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {/* <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={
                                  statusConfig[
                                    user.status as keyof typeof statusConfig
                                  ]?.color
                                }
                              >
                                {user.status}
                              </Badge>
                              <Switch
                                checked={user.status === 'active'}
                                onCheckedChange={() =>
                                  handleStatusToggle(user._id, user.status)
                                }
                                disabled={updateStatusMutation.isPending}
                                size="sm"
                              />
                            </div>
                          </TableCell> */}

                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <ShoppingBag className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {user.orderCount || 0}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {format(
                                  new Date(user.createdAt),
                                  'MMM dd, yyyy'
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(user.createdAt), 'hh:mm a')}
                              </div>
                            </div>
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
                                  onClick={() => handleViewUser(user)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <Separator className="my-1" />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
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
            {usersData?.pagination && usersData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t bg-gray-50/50">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(currentPage * 10, usersData.pagination.totalItems)}{' '}
                  of {usersData.pagination.totalItems} users
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
                    disabled={currentPage >= usersData.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* User Detail Modal */}
      <Dialog open={userDetailOpen} onOpenChange={setUserDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src={selectedUser.avatar || '/placeholder.svg'}
                    alt={selectedUser.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-lg">
                    {selectedUser.firstName.charAt(0)}
                    {selectedUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={
                        roleConfig[selectedUser.role as keyof typeof roleConfig]
                          ?.color
                      }
                    >
                      {selectedUser.role}
                    </Badge>
                    <Badge
                      className={
                        statusConfig[
                          selectedUser.status as keyof typeof statusConfig
                        ]?.color
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedUser.orderCount || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.floor(
                        (Date.now() -
                          new Date(selectedUser.createdAt).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Days Active</div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-3" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <span>
                      Joined{' '}
                      {format(
                        new Date(selectedUser.createdAt),
                        'MMMM dd, yyyy'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Addresses
                  </h4>
                  <div className="space-y-3">
                    {selectedUser.addresses.map(
                      (address: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                            <div className="text-sm">
                              <div className="font-medium">
                                {address.firstName} {address.lastName}
                              </div>
                              <div className="text-gray-600">
                                {address.address1}
                              </div>
                              {address.address2 && (
                                <div className="text-gray-600">
                                  {address.address2}
                                </div>
                              )}
                              <div className="text-gray-600">
                                {address.city}, {address.state}{' '}
                                {address.postalCode}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
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
              user account for{' '}
              <strong>
                {userToDelete?.firstName} {userToDelete?.lastName}
              </strong>{' '}
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
