'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhotoIcon,
  TagIcon,
  CubeIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  category?: { id: string; name: string; slug: string } | null;
  images: { id: string; url: string; alt: string; isPrimary: boolean }[];
  variants: { id: string; name: string; type: string; value: string; stock: number }[];
  createdAt: string;
}

function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

function adminHeaders(): Record<string, string> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'x-admin-token': token } : {}),
  };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const toast = useToast();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      params.set('pageSize', '100');

      const res = await fetch(`${backendUrl}/products/admin/all?${params}`, {
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items: AdminProduct[] = data.items || data;
      setProducts(items);
      applyStatusFilter(items, selectedStatus);
    } catch (err) {
      toast.error('Failed to load products', 'Could not reach the server.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  const applyStatusFilter = (items: AdminProduct[], status: string) => {
    let filtered = [...items];
    if (status === 'active') filtered = filtered.filter(p => p.isActive);
    else if (status === 'inactive') filtered = filtered.filter(p => !p.isActive);
    else if (status === 'low-stock') filtered = filtered.filter(p => p.stock <= 10);
    setFilteredProducts(filtered);
  };

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => { applyStatusFilter(products, selectedStatus); }, [selectedStatus, products]);

  // Load categories for filter dropdown
  useEffect(() => {
    fetch(`${backendUrl}/categories`)
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : Array.isArray(data?.categories) ? data.categories : []))
      .catch(() => {});
  }, []);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`${backendUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success('Product Deleted', 'Product has been permanently deleted.');
      loadProducts();
    } catch {
      toast.error('Delete Failed', 'Could not delete the product.');
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      const res = await fetch(`${backendUrl}/products/${productId}/status`, {
        method: 'PATCH',
        headers: adminHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      toast.success('Status Updated', `Product is now ${updated.isActive ? 'active' : 'inactive'}.`);
      loadProducts();
    } catch {
      toast.error('Update Failed', 'Could not toggle product status.');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog — changes reflect instantly on the store</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadProducts} className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" title="Refresh">
              <ArrowPathIcon className="w-4 h-4" />
            </button>
            <button onClick={() => router.push('/admin/products/create')} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loadProducts()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
              </div>
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="low-stock">Low Stock</option>
            </select>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Product</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">SKU</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Stock</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-gray-500">Loading products...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                      <p className="text-gray-500 mb-4">Add your first product to get started</p>
                      <button onClick={() => router.push('/admin/products/create')} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <PlusIcon className="w-4 h-4" /> Add Product
                      </button>
                    </td>
                  </tr>
                ) : filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <motion.tr key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              <img src={product.images[0].url} alt={product.images[0].alt} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <PhotoIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-sm">{product.sku}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          <TagIcon className="w-3 h-3" />
                          {product.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <CubeIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{product.stock}</span>
                          <span className={cn('px-2 py-1 text-xs rounded-full', stockStatus.color)}>{stockStatus.label}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => handleToggleStatus(product.id)} className={cn('px-3 py-1 text-xs rounded-full font-medium transition-colors', product.isActive ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200')}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedProduct(product); setShowViewModal(true); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Product">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => router.push(`/admin/products/edit/${product.id}`)} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit Product">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Product">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredProducts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Showing {filteredProducts.length} of {products.length} products</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img src={selectedProduct.images[0]?.url || '/raw_era.png'} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedProduct.name}</h2>
                    <p className="text-sm text-gray-500">{selectedProduct.brand} · {selectedProduct.category?.name || 'Uncategorized'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-orange-600">₹{selectedProduct.price.toLocaleString()}</span>
                    {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                      <span className="text-lg text-gray-400 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                    )}
                    {selectedProduct.discount && selectedProduct.discount > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-sm rounded-full">{selectedProduct.discount}% OFF</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-200 text-sm">
                    <div><p className="text-gray-500">SKU</p><p className="font-mono font-semibold">{selectedProduct.sku}</p></div>
                    <div><p className="text-gray-500">Stock</p><p className="font-semibold">{selectedProduct.stock} units</p></div>
                    <div><p className="text-gray-500">Status</p><p className={cn('font-semibold', selectedProduct.isActive ? 'text-green-600' : 'text-gray-500')}>{selectedProduct.isActive ? 'Active' : 'Inactive'}</p></div>
                    <div><p className="text-gray-500">Flags</p><p className="font-semibold">{[selectedProduct.isFeatured && 'Featured', selectedProduct.isNew && 'New'].filter(Boolean).join(', ') || '—'}</p></div>
                  </div>
                  {selectedProduct.variants.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">Variants:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.variants.map(v => (
                          <span key={v.id} className="px-3 py-1 border border-gray-300 rounded-md text-sm">{v.value} ({v.stock} in stock)</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Close</button>
              <button onClick={() => { setShowViewModal(false); router.push(`/admin/products/edit/${selectedProduct.id}`); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Edit Product</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function XMarkIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}