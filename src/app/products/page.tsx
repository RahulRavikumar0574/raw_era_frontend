'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import ProductCard from '@/components/product/ProductCard';
import HorizontalFilters from '@/components/product/HorizontalFilters';
import { Product, SearchFilters } from '@/types';
import { useSearchStore, useProductStore } from '@/store';
import { cn } from '@/lib/utils';

import ChatbotEntry from './ChatbotEntry';

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const storeProducts = useProductStore(state => state.products);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id?: string; name: string; slug: string }>>([]);
  
  const { filters, updateFilters, addRecentSearch } = useSearchStore();

  // Get category from URL on mount
  useEffect(() => {
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    
    if (category) {
      setCurrentCategory(category);
      updateFilters({ category });
    }
    if (query) {
      setSearchQuery(query);
      updateFilters({ query });
    }
  }, [searchParams]);
  // Load categories for tabs
  useEffect(() => {
    const controller = new AbortController();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
    fetch(`${backendUrl}/categories`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load categories');
        const data = await r.json();
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const currentCategoryName = useMemo(() => {
    if (!currentCategory) return null;
    const found = categories.find(c => c.slug === currentCategory);
    const name = found?.name ?? currentCategory;
    if (name.toLowerCase() === 'mens') return 'Men';
    if (name.toLowerCase() === 'womens') return 'Women';
    if (name.toLowerCase() === 'kids') return 'Kids';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [currentCategory, categories]);


  // Calculate available brands and price range from products
  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(storeProducts.map(p => p.brand)));
    return brands.sort();
  }, [storeProducts]);

  const priceRange = useMemo((): [number, number] => {
    const prices = storeProducts.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [storeProducts]);

  // Load products from backend when filters/search change
  useEffect(() => {
    const controller = new AbortController();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const params = new URLSearchParams();
    if (filters.query || searchQuery) params.set('q', (filters.query || searchQuery) as string);
    if (filters.category || currentCategory) params.set('category', (filters.category || currentCategory) as string);
    if (filters.sortBy) {
      const sortMap: Record<string, 'price_asc' | 'price_desc' | 'newest'> = {
        'price-asc': 'price_asc',
        'price-desc': 'price_desc',
        'newest': 'newest',
      } as any;
      const sort = sortMap[filters.sortBy as string];
      if (sort) params.set('sort', sort);
    }
    setIsLoading(true);
    fetch(`${backendUrl}/products?${params.toString()}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load products');
        const data = await r.json();
        const items: Product[] = data.items || data; // support array or paged
        setFilteredProducts(items);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [filters, searchQuery, currentCategory]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    updateFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      updateFilters({ query: searchQuery.trim() });
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Real-time search with debounce
    if (value.trim() === '') {
      updateFilters({ query: undefined });
    }
  };

  return (
    <>
      <ChatbotEntry />
      <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentCategoryName
                  ? `${currentCategoryName} Products`
                  : 'All Products'
                }
              </h1>
              <p className="text-gray-600 mt-1">
                {currentCategoryName
                  ? `Browse our collection of ${filteredProducts.length} ${currentCategoryName} products`
                  : `Discover our amazing collection of ${filteredProducts.length} products`
                }
              </p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-md w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </form>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            <button
              onClick={() => {
                setCurrentCategory(null);
                updateFilters({ category: undefined });
              }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                !currentCategory
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              All Products
            </button>
            {categories.map((cat) => {
              const displayName = 
                cat.slug === 'mens' ? 'Men' :
                cat.slug === 'womens' ? 'Women' :
                cat.slug === 'kids' ? 'Kids' :
                cat.name;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setCurrentCategory(cat.slug);
                    updateFilters({ category: cat.slug });
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors',
                    currentCategory === cat.slug
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Horizontal Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HorizontalFilters
            onFiltersChange={handleFiltersChange}
            availableBrands={availableBrands}
            priceRange={priceRange}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col">
          {/* Main Content */}
          <div className="w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
                </span>
                {filters.query && (
                  <span className="text-sm text-gray-500">
                    for "{filters.query}"
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:block">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLayout('grid')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      layout === 'grid'
                        ? 'bg-white shadow-sm text-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    title="Grid View"
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      layout === 'list'
                        ? 'bg-white shadow-sm text-orange-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                    title="List View"
                  >
                    <ListBulletIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="w-full h-64 bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    updateFilters({});
                    setSearchQuery('');
                  }}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={cn(
                  'gap-6',
                  layout === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'flex flex-col space-y-4'
                )}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      layout={layout}
                      showQuickActions={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Load More Button (for pagination) */}
            {filteredProducts.length > 0 && filteredProducts.length >= 20 && (
              <div className="text-center mt-12">
                <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Load More Products
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}