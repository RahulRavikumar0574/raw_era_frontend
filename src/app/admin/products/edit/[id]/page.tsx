'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  InformationCircleIcon,
  LinkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

function getAdminToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0).optional(),
  originalPrice: z.number().min(0).optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  stock: z.number().min(0).optional(),
  lowStockThreshold: z.number().min(1).optional(),
  discountRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  variants: z.array(z.object({
    name: z.string(),
    type: z.enum(['SIZE', 'COLOR', 'MATERIAL', 'STYLE']),
    value: z.string(),
    price: z.number().optional(),
    stock: z.number().min(0).optional(),
    sku: z.string().optional(),
  })).optional(),
  specifications: z.array(z.object({
    name: z.string(),
    value: z.string(),
    group: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category { id: string; name: string; slug: string; }

function SectionCard({
  title, icon: Icon, badge, children, defaultOpen = true, delay = 0,
}: {
  title: string; icon: any; badge?: string; children: React.ReactNode;
  defaultOpen?: boolean; delay?: number;
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
          {badge && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">{badge}</span>}
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

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [tagInput, setTagInput] = useState('');
  const [productName, setProductName] = useState('');

  const {
    register, control, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true, isFeatured: false, isNew: false,
      lowStockThreshold: 10, variants: [], specifications: [], tags: [], categoryId: '',
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } =
    useFieldArray({ control, name: 'variants' });
  const { fields: specFields, append: appendSpec, remove: removeSpec } =
    useFieldArray({ control, name: 'specifications' });

  const watchStock = watch('stock');
  const watchLowThreshold = watch('lowStockThreshold');
  const watchDiscountRate = watch('discountRate');
  const watchPrice = watch('price');
  const watchOriginalPrice = watch('originalPrice');
  const watchTags = watch('tags');

  // Load categories
  useEffect(() => {
    fetch(`${backendUrl}/categories`)
      .then(r => r.json())
      .then((data: any) => {
        const cats = Array.isArray(data) ? data : Array.isArray(data?.categories) ? data.categories : [];
        setCategories(cats.filter((c: any) => c.isActive));
      })
      .catch(() => {
        setCategories([
          { id: 'mens', name: "Men's Clothing", slug: 'mens' },
          { id: 'womens', name: "Women's Clothing", slug: 'womens' },
          { id: 'kids', name: 'Kids Clothing', slug: 'kids' },
          { id: 'accessories', name: 'Accessories', slug: 'accessories' },
        ]);
      });
  }, []);

  // Load existing product data
  useEffect(() => {
    if (!id) return;
    const token = getAdminToken();
    setIsLoading(true);
    fetch(`${backendUrl}/products/${id}`, {
      headers: { ...(token ? { 'x-admin-token': token } : {}) },
    })
      .then(async r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((p: any) => {
        setProductName(p.name);

        // Populate images
        const urls = (p.images || [])
          .sort((a: any, b: any) => a.order - b.order)
          .map((img: any) => img.url);
        setImageUrls(urls.length > 0 ? urls : ['']);

        // Populate tags
        const tagNames = (p.tags || []).map((t: any) =>
          typeof t === 'string' ? t : t.name
        );

        // Reset form with existing values
        reset({
          name: p.name,
          description: p.description || '',
          shortDescription: p.shortDescription || '',
          price: p.price,
          originalPrice: p.originalPrice || undefined,
          sku: p.sku || '',
          brand: p.brand || '',
          categoryId: p.categoryId || p.category?.id || '',
          stock: p.stock ?? 0,
          lowStockThreshold: 10,
          isActive: p.isActive ?? true,
          isFeatured: p.isFeatured ?? false,
          isNew: p.isNew ?? false,
          seoTitle: p.seoTitle || '',
          seoDescription: p.seoDescription || '',
          variants: (p.variants || []).map((v: any) => ({
            name: v.name,
            type: (v.type || 'SIZE') as 'SIZE' | 'COLOR' | 'MATERIAL' | 'STYLE',
            value: v.value,
            price: v.price || undefined,
            stock: v.stock ?? 0,
            sku: v.sku || '',
          })),
          specifications: (p.specifications || []).map((s: any) => ({
            name: s.name,
            value: s.value,
            group: s.group || '',
          })),
          tags: tagNames,
        });
      })
      .catch(() => {
        toast.error('Product not found', 'Could not load product data.');
        router.push('/admin/products');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const current = watchTags || [];
    if (!current.includes(tag)) setValue('tags', [...current, tag]);
    setTagInput('');
  };
  const removeTag = (tag: string) => setValue('tags', (watchTags || []).filter(t => t !== tag));

  const addImageUrl = () => {
    if (imageUrls.length < 5) setImageUrls(prev => [...prev, '']);
  };
  const removeImageUrl = (i: number) => setImageUrls(prev => prev.filter((_, idx) => idx !== i));
  const updateImageUrl = (i: number, val: string) =>
    setImageUrls(prev => prev.map((u, idx) => (idx === i ? val : u)));

  const computedDiscount = (() => {
    if (watchDiscountRate && watchDiscountRate > 0) return watchDiscountRate;
    if (watchOriginalPrice && watchPrice && watchOriginalPrice > watchPrice) {
      return Math.round(((watchOriginalPrice - watchPrice) / watchOriginalPrice) * 100);
    }
    return undefined;
  })();

  const isLowStock =
    watchStock !== undefined && watchStock !== null &&
    watchStock > 0 && watchStock <= (watchLowThreshold || 10);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const token = getAdminToken();
      if (!token) {
        toast.error('Not authenticated', 'Please log in to the admin portal first.');
        return;
      }

      const validImages = imageUrls
        .map((url, i) => ({ url: url.trim(), alt: data.name, isPrimary: i === 0, order: i + 1 }))
        .filter(img => img.url.length > 0);

      const payload = {
        name: data.name,
        description: data.description || '',
        shortDescription: data.shortDescription,
        price: data.price ?? 0,
        originalPrice: data.originalPrice,
        discount: computedDiscount,
        sku: data.sku,
        brand: data.brand,
        categoryId: data.categoryId,
        stock: data.stock ?? 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        isNew: data.isNew ?? false,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        images: validImages,
        variants: (data.variants || []).map(v => ({ ...v, type: v.type.toUpperCase() as any })),
        specifications: data.specifications || [],
        tags: data.tags || [],
      };

      const res = await fetch(`${backendUrl}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || `HTTP ${res.status}`);
      }

      toast.success('Product updated!', 'Changes saved and live on the store.');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error('Update failed', err?.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => router.push('/admin/products')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-gray-500 text-sm mt-0.5 truncate max-w-xs">{productName}</p>
            </div>
          </div>
          <a
            href={`/products/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-2"
          >
            View on store ↗
          </a>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ── Basic Information ── */}
          <SectionCard title="Basic Information" icon={InformationCircleIcon} defaultOpen delay={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors',
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300',
                  )}
                  placeholder="e.g. Oversized Graphic T-Shirt"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  {...register('sku')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-50"
                  placeholder="Auto-generated"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  {...register('brand')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. The Raw Era"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('categoryId')}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white',
                    errors.categoryId ? 'border-red-300' : 'border-gray-300',
                  )}
                >
                  <option value="">Select category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-600 text-xs mt-1">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  {...register('shortDescription')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="One-liner product summary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number" step="0.01" min="0"
                  className={cn('w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors', errors.price ? 'border-red-300' : 'border-gray-300')}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original / MRP (₹)</label>
                <input
                  {...register('originalPrice', { valueAsNumber: true })}
                  type="number" step="0.01" min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                <input
                  {...register('discountRate', { valueAsNumber: true })}
                  type="number" step="1" min="0" max="100"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {computedDiscount !== undefined && computedDiscount > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                <TagIcon className="w-4 h-4 text-red-600" />
                <span className="text-red-700 text-sm font-medium">{computedDiscount}% discount will show on the product</span>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number" min="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="e.g. 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
                <input
                  {...register('lowStockThreshold', { valueAsNumber: true })}
                  type="number" min="1"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="10"
                />
              </div>
            </div>

            <AnimatePresence>
              {isLowStock && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-3 flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-300 rounded-lg">
                  <FireIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                  <span className="text-orange-600 text-sm">Customers will see "🔥 Only {watchStock} left!" on the product page</span>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* ── Product Images ── */}
          <SectionCard title="Product Images" icon={PhotoIcon} badge="up to 5 URLs" defaultOpen delay={0.1}>
            <p className="text-sm text-gray-500 mb-4">
              Paste direct image URLs. The first URL is the primary image shown in listings.
            </p>
            <div className="space-y-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                    {url ? (
                      <img src={url} alt="" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={e => updateImageUrl(i, e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                      placeholder={i === 0 ? 'Primary image URL' : `Image ${i + 1} URL (optional)`}
                    />
                  </div>
                  {i === 0 ? (
                    <span className="mt-3 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium whitespace-nowrap">Primary</span>
                  ) : (
                    <button type="button" onClick={() => removeImageUrl(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {imageUrls.length < 5 && (
              <button type="button" onClick={addImageUrl} className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full justify-center text-sm font-medium">
                <PlusIcon className="w-4 h-4" /> Add Another Image URL
              </button>
            )}
          </SectionCard>

          {/* ── Variants ── */}
          <SectionCard title="Product Variants" icon={CubeIcon} badge="optional" defaultOpen={variantFields.length > 0} delay={0.15}>
            <p className="text-sm text-gray-500 mb-4">Add or modify size, color, or other variants.</p>
            <div className="space-y-3">
              {variantFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input {...register(`variants.${index}.name`)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500" placeholder="Size" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                    <select {...register(`variants.${index}.type`)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 bg-white">
                      <option value="SIZE">Size</option>
                      <option value="COLOR">Color</option>
                      <option value="MATERIAL">Material</option>
                      <option value="STYLE">Style</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input {...register(`variants.${index}.value`)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500" placeholder="M, L, XL" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                    <input {...register(`variants.${index}.stock`, { valueAsNumber: true })} type="number" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500" placeholder="10" />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeVariant(index)} className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => appendVariant({ name: 'Size', type: 'SIZE', value: '', stock: 0 })} className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full justify-center text-sm font-medium">
              <PlusIcon className="w-4 h-4" /> Add Variant
            </button>
          </SectionCard>

          {/* ── Specifications ── */}
          <SectionCard title="Specifications" icon={InformationCircleIcon} badge="optional" defaultOpen={specFields.length > 0} delay={0.2}>
            <p className="text-sm text-gray-500 mb-4">Edit technical details like material, fit, care instructions, etc.</p>
            <div className="space-y-3">
              {specFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Spec Name</label>
                    <input {...register(`specifications.${index}.name`)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500" placeholder="Material" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Value</label>
                    <input {...register(`specifications.${index}.value`)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500" placeholder="100% Cotton" />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeSpec(index)} className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => appendSpec({ name: '', value: '' })} className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all w-full justify-center text-sm font-medium">
              <PlusIcon className="w-4 h-4" /> Add Specification
            </button>
          </SectionCard>

          {/* ── Tags ── */}
          <SectionCard title="Tags" icon={TagIcon} badge="optional" defaultOpen={false} delay={0.25}>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Type a tag and press Enter..."
              />
              <button type="button" onClick={addTag} className="px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium">Add</button>
            </div>
            {(watchTags || []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(watchTags || []).map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><XMarkIcon className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

          {/* ── Product Settings ── */}
          <SectionCard title="Product Settings" icon={InformationCircleIcon} defaultOpen={false} delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'isActive' as const, label: 'Active', desc: 'Visible on the store' },
                { name: 'isFeatured' as const, label: 'Featured', desc: 'Shown in featured section' },
                { name: 'isNew' as const, label: 'New Arrival', desc: 'Shows "New" badge' },
              ].map(({ name, label, desc }) => (
                <label key={name} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input {...register(name)} type="checkbox" className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
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
              onClick={() => router.push('/admin/products')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
