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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  FolderTree,
  Package,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import { useCategories } from '@/queries/hooks/category/useCategories';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/queries/hooks/category/useCategoryMutations';
import {
  selectedCategoryAtom,
  categoryFormAtom,
  modalOpenAtom,
  modalTypeAtom,
} from '../state/adminAtoms';

export const CategoriesManagement: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [categoryForm, setCategoryForm] = useAtom(categoryFormAtom);
  const [modalOpen, setModalOpen] = useAtom(modalOpenAtom);
  const [modalType, setModalType] = useAtom(modalTypeAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: categories, isLoading } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Debug: Log mutation states
  console.log('Create category mutation state:', {
    isPending: createCategoryMutation.isPending,
    isError: createCategoryMutation.isError,
    error: createCategoryMutation.error,
    isSuccess: createCategoryMutation.isSuccess,
  });

  const handleCreateCategory = () => {
    setCategoryForm({
      name: '',
      description: '',
      parent: '',
      icon: '',
      sortOrder: 0,
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      metaKeywords: '',
    });
    setSelectedCategory(null);
    setModalType('create');
    setModalOpen(true);
    setImage(null);
    setImagePreview('');
  };

  const handleEditCategory = (category: any) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || '',
      icon: category.icon || '',
      sortOrder: category.sortOrder,
      isFeatured: category.isFeatured,
      seoTitle: category.seoTitle || '',
      seoDescription: category.seoDescription || '',
      metaKeywords: category.metaKeywords?.join(', ') || '',
    });
    setSelectedCategory(category);
    setModalType('edit');
    setModalOpen(true);
    setImage(null);
    setImagePreview(category.image?.url || '');
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted!'); // Debug log
    console.log('Category form data:', categoryForm); // Debug log
    console.log('Modal type:', modalType); // Debug log
    console.log('Selected image:', image); // Debug log

    // Validation checks
    if (!categoryForm.name?.trim()) {
      console.error('Category name is required');
      alert('Category name is required');
      return;
    }

    try {
      console.log('Preparing submission data...'); // Debug log

      // Prepare category data object
      const categoryData = { ...categoryForm };

      // Handle parent category - convert "none" to empty string or null
      if (categoryData.parent === 'none' || categoryData.parent === '') {
        categoryData.parent = null;
      }

      // Remove any undefined, null, or empty string values (except parent which can be null)
      Object.keys(categoryData).forEach((key) => {
        const value = categoryData[key];
        if (
          key !== 'parent' &&
          (value === null || value === undefined || value === '')
        ) {
          delete categoryData[key];
        }
      });

      console.log('Cleaned category data:', categoryData); // Debug log

      if (modalType === 'create') {
        console.log('Creating new category...'); // Debug log

        const mutationData = {
          categoryData: categoryData,
          image: image || undefined,
        };

        console.log('Create mutation data:', mutationData); // Debug log
        const result = await createCategoryMutation.mutateAsync(mutationData);
        console.log('Create result:', result); // Debug log
      } else if (selectedCategory) {
        console.log('Updating existing category:', selectedCategory._id); // Debug log

        const mutationData = {
          id: selectedCategory._id,
          categoryData: categoryData,
          image: image || undefined,
        };

        console.log('Update mutation data:', mutationData); // Debug log
        const result = await updateCategoryMutation.mutateAsync(mutationData);
        console.log('Update result:', result); // Debug log
      }

      console.log('Operation successful, closing modal...'); // Debug log
      setModalOpen(false);
    } catch (error) {
      console.error('Error in handleSubmit:', error); // Debug log

      // Show user-friendly error message
      if (error?.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error?.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading_mutation =
    createCategoryMutation.isPending || updateCategoryMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">
              Organize your products with categories
            </p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">
            Organize your products with categories
          </p>
        </div>
        <Button
          onClick={handleCreateCategory}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Featured Categories
            </CardTitle>
            <Package className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories?.filter((c) => c.isFeatured).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Highlighted categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories?.reduce((sum, c) => sum + c.productCount, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total products</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>
            Manage your product categories and hierarchy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {category.image?.url ? (
                          <img
                            src={category.image.url || '/placeholder.svg'}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FolderTree className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-gray-500">
                            {category.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.parent ? (
                        <Badge variant="outline">{category.parent.name}</Badge>
                      ) : (
                        <span className="text-gray-500">Root</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.productCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={
                            category.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {category.isFeatured && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Form Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalType === 'create' ? 'Create New Category' : 'Edit Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={categoryForm.name || ''}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select
                  value={categoryForm.parent || 'none'}
                  onValueChange={(value) =>
                    setCategoryForm({ ...categoryForm, parent: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Root Category)</SelectItem>
                    {categories
                      ?.filter((c) => c._id !== selectedCategory?._id)
                      .map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={categoryForm.description || ''}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload image
                  </span>
                </label>
              </div>
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview || '/placeholder.svg'}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Class</Label>
                <Input
                  id="icon"
                  value={categoryForm.icon || ''}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, icon: e.target.value })
                  }
                  placeholder="e.g., fas fa-shopping-bag"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={categoryForm.sortOrder || 0}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      sortOrder: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">SEO Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={categoryForm.seoTitle || ''}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      seoTitle: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={categoryForm.seoDescription || ''}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      seoDescription: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={categoryForm.metaKeywords || ''}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      metaKeywords: e.target.value,
                    })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Category Settings</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={categoryForm.isFeatured || false}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      isFeatured: e.target.checked,
                    })
                  }
                />
                <span>Featured Category</span>
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading_mutation}>
                {isLoading_mutation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {modalType === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    {modalType === 'create'
                      ? 'Create Category'
                      : 'Update Category'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
