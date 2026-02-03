//@ts-nocheck

import type React from 'react';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Loader2, Plus } from 'lucide-react';
import { productFormAtom, selectedProductAtom } from '../state/adminAtoms';
import {
  useCreateProduct,
  useUpdateProduct,
} from '@/queries/hooks/product/useProductMutations';
import { useCategories } from '@/queries/hooks/category/useCategories';

interface ProductFormProps {
  onClose: () => void;
  isEdit?: boolean;
}

const CAPACITY_UNITS = [
  { value: 'L', label: 'Liters (L)' },
  { value: 'mL', label: 'Milliliters (mL)' },
  { value: 'gal', label: 'Gallons (gal)' },
];
const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'lb', label: 'Pounds (lb)' },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  onClose,
  isEdit = false,
}) => {
  const [formData, setFormData] = useAtom(productFormAtom);
  const [selectedProduct] = useAtom(selectedProductAtom);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');
  const [variants, setVariants] = useState<any[]>([]);
  const [specifications, setSpecifications] = useState<{
    [key: string]: string;
  }>({});
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { data: categories } = useCategories();

  // Debug: Log mutation states
  console.log('Create mutation state:', {
    isPending: createProductMutation.isPending,
    isError: createProductMutation.isError,
    error: createProductMutation.error,
    isSuccess: createProductMutation.isSuccess,
  });

  useEffect(() => {
    if (isEdit && selectedProduct) {
      setFormData({
        name: selectedProduct?.name,
        description: selectedProduct?.description,
        shortDescription: selectedProduct?.shortDescription || '',
        price: selectedProduct?.price.toString(),
        comparePrice: selectedProduct?.comparePrice?.toString() || '',
        costPrice: selectedProduct?.costPrice?.toString() || '',
        category: selectedProduct?.category._id,
        subcategory: selectedProduct?.subcategory?._id || '',
        brand: selectedProduct?.brand || '',
        sku: selectedProduct?.sku,
        stock: selectedProduct?.stock.toString(),
        lowStockThreshold: selectedProduct?.lowStockThreshold.toString(),
        weight: selectedProduct?.weight?.toString() || '',
        capacity: selectedProduct?.capacity?.toString() || '',
        dimensions: selectedProduct?.dimensions || '',
        tags: selectedProduct?.tags.join(', '),
        features: selectedProduct?.features.join(', '),
        specifications: JSON.stringify(selectedProduct?.specifications || {}),
        seoTitle: selectedProduct?.seoTitle || '',
        seoDescription: selectedProduct?.seoDescription || '',
        variants: JSON.stringify(selectedProduct?.variants || []),
        isDigital: selectedProduct?.isDigital,
        shippingRequired: selectedProduct?.shippingRequired,
        taxable: selectedProduct?.taxable,
        isFeatured: selectedProduct?.isFeatured,
        gst: selectedProduct?.gst?.toString() || '',
        taxClass: selectedProduct?.taxClass || '',
      });
      setTags(selectedProduct?.tags || []);
      setFeatures(selectedProduct?.features || []);
      setVariants(selectedProduct?.variants || []);
      setSpecifications(selectedProduct?.specifications || {});
      setImagePreviews(selectedProduct?.images?.map((img) => img.url) || []);
    }
  }, [isEdit, selectedProduct, setFormData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addFeature = () => {
    if (currentFeature.trim() && !features.includes(currentFeature.trim())) {
      const newFeatures = [...features, currentFeature.trim()];
      setFeatures(newFeatures);
      setCurrentFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const addSpecification = () => {
    if (
      newSpecKey.trim() &&
      newSpecValue.trim() &&
      !specifications[newSpecKey.trim()]
    ) {
      setSpecifications((prev) => ({
        ...prev,
        [newSpecKey.trim()]: newSpecValue.trim(),
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (keyToRemove: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[keyToRemove];
    setSpecifications(newSpecs);
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: '',
        options: [],
        price: '',
        stock: '',
        sku: '',
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form submitted!'); // Debug log
    console.log('Form data:', formData); // Debug log
    console.log('Is edit mode:', isEdit); // Debug log
    console.log('Images:', images); // Debug log
    console.log('Tags:', tags); // Debug log
    console.log('Features:', features); // Debug log
    console.log('Specifications:', specifications); // Debug log
    console.log('Variants:', variants); // Debug log

    // Validation checks
    if (!formData.name?.trim()) {
      console.error('Product name is required');
      alert('Product name is required');
      return;
    }

    if (!formData.description?.trim()) {
      console.error('Product description is required');
      alert('Product description is required');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      console.error('Valid price is required');
      alert('Valid price is required');
      return;
    }

    if (!formData.category) {
      console.error('Category is required');
      alert('Category is required');
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      console.error('Valid stock quantity is required');
      alert('Valid stock quantity is required');
      return;
    }

    // For new products, require at least one image
    if (!isEdit && images.length === 0 && imagePreviews.length === 0) {
      console.error('At least one product image is required');
      alert('At least one product image is required');
      return;
    }

    try {
      console.log('Preparing submission data...'); // Debug log

      if (isEdit && selectedProduct) {
        console.log('Updating existing product:', selectedProduct?._id); // Debug log

        // Prepare product data object
        const productData = {
          ...formData,
          tags: tags.join(','),
          features: features.join(','),
          specifications: JSON.stringify(specifications),
          variants: JSON.stringify(variants),
        };

        // Remove any undefined, null, or empty string values
        Object.keys(productData).forEach((key) => {
          const value = productData[key];
          if (value === null || value === undefined || value === '') {
            delete productData[key];
          }
        });

        // Prepare the data structure for update mutation
        const updateData = {
          id: selectedProduct?._id,
          productData: productData,
          // Only include images if new ones were selected
          ...(images.length > 0 && { images }),
        };

        console.log('Update data:', updateData); // Debug log

        const result = await updateProductMutation.mutateAsync(updateData);
        console.log('Update result:', result); // Debug log
      } else {
        console.log('Creating new product...'); // Debug log

        // Prepare product data object
        const productData = {
          ...formData,
          tags: tags.join(','),
          features: features.join(','),
          specifications: JSON.stringify(specifications),
          variants: JSON.stringify(variants),
        };

        // Remove any undefined, null, or empty string values
        Object.keys(productData).forEach((key) => {
          const value = productData[key];
          if (value === null || value === undefined || value === '') {
            delete productData[key];
          }
        });

        // Prepare the data structure that your mutation expects
        const mutationData = {
          productData: productData,
          images: images.length > 0 ? images : undefined,
        };

        console.log('Product data:', productData); // Debug log
        console.log('Images:', images); // Debug log
        console.log('Mutation data:', mutationData); // Debug log

        console.log('Calling createProductMutation.mutateAsync...'); // Debug log
        const result = await createProductMutation.mutateAsync(mutationData);
        console.log('Create result:', result); // Debug log
      }

      console.log('Operation successful, closing form...'); // Debug log
      onClose();
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

  const isLoading =
    createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    maxLength={200}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand || ''}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Brand name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  rows={4}
                  required
                  maxLength={2000}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription || ''}
                  onChange={(e) =>
                    handleInputChange('shortDescription', e.target.value)
                  }
                  rows={2}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.comparePrice || ''}
                    onChange={(e) =>
                      handleInputChange('comparePrice', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPrice || ''}
                    onChange={(e) =>
                      handleInputChange('costPrice', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Category & Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) =>
                      handleInputChange('category', value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formData.subcategory || ''}
                    onValueChange={(value) =>
                      handleInputChange('subcategory', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
              </div>
            </div>

            {/* Inventory */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Inventory & Shipping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock || ''}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold || '10'}
                    onChange={(e) =>
                      handleInputChange('lowStockThreshold', e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight-value">Weight</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="weight-value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight?.value || ''}
                    onChange={(e) =>
                      handleInputChange('weight', {
                        ...formData.weight,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter weight"
                  />
                  <Select
                    value={formData.weight?.unit || 'kg'}
                    onValueChange={(value) =>
                      handleInputChange('weight', {
                        ...formData.weight,
                        unit: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEIGHT_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity-value">Capacity</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="capacity-value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.capacity?.value || ''}
                    onChange={(e) =>
                      handleInputChange('capacity', {
                        ...formData.capacity,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter capacity"
                  />
                  <Select
                    value={formData.capacity?.unit || 'L'}
                    onValueChange={(value) =>
                      handleInputChange('capacity', {
                        ...formData.capacity,
                        unit: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAPACITY_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="space-y-4">
              <h3 ClassName="text-lg font-semibold border-b pb-2">
                Tax Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gst">GST (%)</Label>
                  <Input
                    id="gst"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.gst || ''}
                    onChange={(e) => handleInputChange('gst', e.target.value)}
                    placeholder="GST percentage"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="taxClass">Tax Class</Label>
                  <Input
                    id="taxClass"
                    value={formData.taxClass || ''}
                    onChange={(e) =>
                      handleInputChange('taxClass', e.target.value)
                    }
                    placeholder="Tax classification"
                  />
                </div> */}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Product Images {!isEdit && '*'}
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload images
                  </span>
                </label>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview || '/placeholder.svg'}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Tags</h3>
              <div className="flex space-x-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Features</h3>
              <div className="flex space-x-2">
                <Input
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  placeholder="Add a feature"
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addFeature())
                  }
                />
                <Button type="button" onClick={addFeature}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{feature}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFeature(feature)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Specification name"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Specification value"
                />
                <Button type="button" onClick={addSpecification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spec
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <strong>{key}:</strong> {value}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Product Variants
                </h3>
                <Button type="button" onClick={addVariant} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>
              {variants.map((variant, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label>Variant {index + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Input
                      placeholder="Variant name"
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(index, 'name', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Options (comma separated)"
                      value={variant.options?.join(', ') || ''}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          'options',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                    />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(index, 'price', e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, 'stock', e.target.value)
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                SEO Settings
              </h3>
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle || ''}
                  onChange={(e) =>
                    handleInputChange('seoTitle', e.target.value)
                  }
                  maxLength={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription || ''}
                  onChange={(e) =>
                    handleInputChange('seoDescription', e.target.value)
                  }
                  rows={3}
                  maxLength={160}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Product Settings
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={(e) =>
                      handleInputChange('isFeatured', e.target.checked)
                    }
                  />
                  <span>Featured</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isDigital || false}
                    onChange={(e) =>
                      handleInputChange('isDigital', e.target.checked)
                    }
                  />
                  <span>Digital Product</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.shippingRequired !== false}
                    onChange={(e) =>
                      handleInputChange('shippingRequired', e.target.checked)
                    }
                  />
                  <span>Requires Shipping</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.taxable !== false}
                    onChange={(e) =>
                      handleInputChange('taxable', e.target.checked)
                    }
                  />
                  <span>Taxable</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEdit ? 'Update Product' : 'Create Product'}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
