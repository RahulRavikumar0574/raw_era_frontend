'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  PhotoIcon,
  XMarkIcon,
  PlusIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FireIcon,
  TagIcon,
  CubeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { useProductStore } from '@/store';
import { v4 as uuidv4 } from 'uuid';

// All fields optional except name
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  originalPrice: z.number().min(0).optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().optional(),
  stock: z.number().min(0, 'Stock must be non-negative').optional(),
  lowStockThreshold: z.number().min(1).optional(),
  discountRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  variants: z.array(z.object({
    name: z.string(),
    type: z.enum(['size', 'color', 'material', 'style']),
    value: z.string(),
    price: z.number().optional(),
    stock: z.number().min(0).optional(),
    sku: z.string().optional()
  })).optional(),
  specifications: z.array(z.object({
    name: z.string(),
    value: z.string(),
    group: z.string().optional()
  })).optional(),
  tags: z.array(z.string()).optional()
});

type ProductFormData = z.infer<typeof productSchema>;

const categories = [
  { id: '1', name: "Men's Clothing" },
  { id: '2', name: "Women's Clothing" },
  { id: '3', name: "Kids Clothing" },
  { id: '4', name: "Accessories" }
];

function SectionCard({
  title,
  icon: Icon,
  badge,
  children,
  defaultOpen = true,
  delay = 0
}: {
  title: string;
  icon: any;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  delay?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Icon className="w-5 h-5 text-orange-600" />
          </div>
          <span className="text-lg font-semibold text-gray-900">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{badge}</span>
          )}
        </div>
        {open ? <ChevronUpIcon className="w-5 h-5 text-gray-400" /> : <ChevronDownIcon className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CreateProductPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      isNew: true,
      lowStockThreshold: 10,
      variants: [],
      specifications: [],
      tags: []
    }
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant
  } = useFieldArray({ control, name: 'variants' });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec
  } = useFieldArray({ control, name: 'specifications' });

  const watchStock = watch('stock');
  const watchLowThreshold = watch('lowStockThreshold');
  const watchDiscountRate = watch('discountRate');
  const watchPrice = watch('price');
  const watchOriginalPrice = watch('originalPrice');
  const watchTags = watch('tags');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = watchTags || [];
    if (!current.includes(tag)) {
      setValue('tags', [...current, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    const current = watchTags || [];
    setValue('tags', current.filter(t => t !== tag));
  };

  const addProduct = useProductStore(state => state.addProduct);

  const getCategoryById = (id?: string) => {
    if (!id) return { id: 'uncategorized', name: 'Uncategorized', slug: 'uncategorized', isActive: true, order: 99 };
    const mapping: Record<string, { name: string; slug: string }> = {
      '1': { name: "Men's Clothing", slug: 'mens' },
      '2': { name: "Women's Clothing", slug: 'womens' },
      '3': { name: "Kids Clothing", slug: 'kids' },
      '4': { name: 'Accessories', slug: 'accessories' }
    };
    const info = mapping[id] || { name: 'Uncategorized', slug: 'uncategorized' };
    return { id, name: info.name, slug: info.slug, isActive: true, order: parseInt(id) || 5 };
  };

  // Compute effective discount
  const computedDiscount = (() => {
    if (watchDiscountRate && watchDiscountRate > 0) return watchDiscountRate;
    if (watchOriginalPrice && watchPrice && watchOriginalPrice > watchPrice) {
      return Math.round(((watchOriginalPrice - watchPrice) / watchOriginalPrice) * 100);
    }
    return undefined;
  })();

  // Low stock preview
  const isLowStock = watchStock !== undefined && watchStock !== null &&
    watchStock > 0 && watchStock <= (watchLowThreshold || 10);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const discount = computedDiscount;
      const category = getCategoryById(data.categoryId);

      const productData = {
        id: uuidv4(),
        ...data,
        price: data.price ?? 0,
        stock: data.stock ?? 0,
        sku: data.sku || `SKU-${Date.now()}`,
        brand: data.brand || 'Unknown',
        category,
        discount,
        images: imagePreviews.map((url, index) => ({
          id: `img-${uuidv4()}`,
          url,
          alt: `${data.name} - Image ${index + 1}`,
          isPrimary: index === 0,
          order: index + 1
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: 5.0,
        reviewCount: 0
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      addProduct(productData as any);
      toast.success('Product created successfully!');
      router.push('/admin/products');
    } catch {
      toast.error('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
              <p className="text-gray-500 text-sm mt-0.5">Only the product name is required — all other fields are optional</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Basic Information ── */}
          <SectionCard title="Basic Information" icon={InformationCircleIcon} defaultOpen delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name – required */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors',
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  )}
                  placeholder="e.g. Oversized Graphic T-Shirt"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  {...register('sku')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="Auto-generated if blank"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  {...register('brand')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. Souled Store"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-gray-400 font-normal">(optional)</span></label>
                <select
                  {...register('categoryId')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  {...register('shortDescription')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="One-liner product summary"
                />
              </div>

              {/* Full Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="Full product description..."
                />
              </div>
            </div>
          </SectionCard>

          {/* ── Pricing & Inventory ── */}
          <SectionCard title="Pricing & Inventory" icon={TagIcon} defaultOpen delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price <span className="text-gray-400 font-normal">(₹)</span>
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors',
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  )}
                  placeholder="0.00"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original / MRP <span className="text-gray-400 font-normal">(₹, optional)</span>
                </label>
                <input
                  {...register('originalPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="0.00"
                />
              </div>

              {/* Discount Rate override */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Rate <span className="text-gray-400 font-normal">(%, optional)</span>
                </label>
                <input
                  {...register('discountRate', { valueAsNumber: true })}
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {/* Discount preview */}
            {computedDiscount !== undefined && computedDiscount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg"
              >
                <TagIcon className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm font-medium">{computedDiscount}% discount will be shown on the product</span>
              </motion.div>
            )}

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Alert Threshold <span className="text-gray-400 font-normal">(default 10)</span>
                </label>
                <input
                  {...register('lowStockThreshold', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="10"
                />
                <p className="text-xs text-gray-400 mt-1">Shows "Only X left!" badge on the product page when stock ≤ this value</p>
              </div>
            </div>

            {/* Low stock preview badge */}
            <AnimatePresence>
              {isLowStock && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-300 rounded-lg"
                >
                  <FireIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                  <div>
                    <span className="text-orange-700 font-semibold text-sm">Preview: </span>
                    <span className="text-orange-600 text-sm">
                      Customers will see "🔥 Only {watchStock} left!" badge on the product page
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* ── Product Images ── */}
          <SectionCard title="Product Images" icon={PhotoIcon} badge="up to 5" defaultOpen delay={0.1}>
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-orange-50 hover:border-orange-400 transition-all group">
                <PhotoIcon className="w-10 h-10 text-gray-400 group-hover:text-orange-400 mb-2 transition-colors" />
                <p className="text-sm text-gray-500 group-hover:text-orange-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (MAX. 5 images)</p>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* ── Variants ── */}
          <SectionCard title="Product Variants" icon={CubeIcon} badge="optional" defaultOpen={false} delay={0.15}>
            <p className="text-sm text-gray-500 mb-4">Add size, color, or other variants. Leave empty if your product has no variants.</p>
            <div className="space-y-3">
              {variantFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      {...register(`variants.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Size"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select
                      {...register(`variants.${index}.type`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                    >
                      <option value="size">Size</option>
                      <option value="color">Color</option>
                      <option value="material">Material</option>
                      <option value="style">Style</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input
                      {...register(`variants.${index}.value`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="M, L, XL"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                    <input
                      {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="10"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendVariant({ name: 'Size', type: 'size', value: '', stock: 0 })}
              className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full justify-center text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Add Variant
            </button>
          </SectionCard>

          {/* ── Specifications ── */}
          <SectionCard title="Specifications" icon={InformationCircleIcon} badge="optional" defaultOpen={false} delay={0.2}>
            <p className="text-sm text-gray-500 mb-4">Add technical details like material, fit, care instructions, etc.</p>
            <div className="space-y-3">
              {specFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Spec Name</label>
                    <input
                      {...register(`specifications.${index}.name`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Material"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input
                      {...register(`specifications.${index}.value`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="100% Cotton"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendSpec({ name: '', value: '' })}
              className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full justify-center text-sm font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              Add Specification
            </button>
          </SectionCard>

          {/* ── Tags ── */}
          <SectionCard title="Tags" icon={TagIcon} badge="optional" defaultOpen={false} delay={0.25}>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                placeholder="Type a tag and press Enter..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            {(watchTags || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(watchTags || []).map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          {/* ── Product Settings ── */}
          <SectionCard title="Product Settings" icon={InformationCircleIcon} defaultOpen={false} delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'isActive' as const, label: 'Active', desc: 'Visible in store' },
                { name: 'isFeatured' as const, label: 'Featured', desc: 'Shown in featured section' },
                { name: 'isNew' as const, label: 'New Arrival', desc: 'Shows "New" badge' },
              ].map(({ name, label, desc }) => (
                <label key={name} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    {...register(name)}
                    type="checkbox"
                    className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </SectionCard>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2 pb-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </span>
              ) : 'Create Product'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
