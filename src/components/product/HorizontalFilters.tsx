'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { SearchFilters, SortOption } from '@/types';
import { useSearchStore } from '@/store';
import { cn } from '@/lib/utils';

interface HorizontalFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableBrands: string[];
  priceRange: [number, number];
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
];

export default function HorizontalFilters({ 
  onFiltersChange, 
  availableBrands, 
  priceRange,
  className 
}: HorizontalFiltersProps) {
  const { filters, updateFilters, clearFilters } = useSearchStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    filters.priceRange || priceRange
  );

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    updateFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setLocalPriceRange(range);
    handleFilterChange({ priceRange: range });
  };

  const handleClearFilters = () => {
    clearFilters();
    setLocalPriceRange(priceRange);
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(key => {
    const value = filters[key as keyof SearchFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  }).length;

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className={cn('bg-white border-b border-gray-200 py-4', className)}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort By */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('sort')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">Sort By</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'sort' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="py-2">
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleFilterChange({ sortBy: option.value });
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                        filters.sortBy === option.value && 'bg-orange-50 text-orange-600 font-medium'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('price')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">
              Price: ₹{localPriceRange[0]} - ₹{localPriceRange[1]}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'price' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={localPriceRange[0]}
                        onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), localPriceRange[1]])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        value={localPriceRange[1]}
                        onChange={(e) => handlePriceRangeChange([localPriceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                      <span>₹{localPriceRange[0].toLocaleString()}</span>
                      <span>₹{localPriceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenDropdown(null)}
                    className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('brand')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">
              Brand {filters.brand && filters.brand.length > 0 && `(${filters.brand.length})`}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'brand' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
              >
                <div className="py-2">
                  {availableBrands.map(brand => (
                    <label key={brand} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand?.includes(brand) || false}
                        onChange={(e) => {
                          const currentBrands = filters.brand || [];
                          const newBrands = e.target.checked
                            ? [...currentBrands, brand]
                            : currentBrands.filter(b => b !== brand);
                          handleFilterChange({ brand: newBrands });
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                      />
                      <span className="text-sm text-gray-900">{brand}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('rating')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">
              Rating {filters.rating && `(${filters.rating}+ ★)`}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'rating' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="py-2">
                  {[4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => {
                        handleFilterChange({ rating });
                        setOpenDropdown(null);
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2',
                        filters.rating === rating && 'bg-orange-50 text-orange-600 font-medium'
                      )}
                    >
                      <span>{rating}</span>
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-500">& above</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Features Filter */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('features')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">Features</span>
            <ChevronDownIcon className="w-4 h-4 text-gray-600" />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'features' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="py-2">
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock || false}
                      onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                    />
                    <span className="text-sm text-gray-900">In Stock</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isNew || false}
                      onChange={(e) => handleFilterChange({ isNew: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                    />
                    <span className="text-sm text-gray-900">New Arrivals</span>
                  </label>
                  <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.isFeatured || false}
                      onChange={(e) => handleFilterChange({ isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-3"
                    />
                    <span className="text-sm text-gray-900">Featured</span>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}