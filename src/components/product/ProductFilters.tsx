'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { SearchFilters, SortOption } from '@/types';
import { useSearchStore } from '@/store';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  availableBrands: string[];
  priceRange: [number, number];
  className?: string;
}

type ExpandedSectionKey = 'price' | 'brand' | 'rating' | 'features';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Most Popular' },
];

export default function ProductFilters({ 
  onFiltersChange, 
  availableBrands, 
  priceRange,
  className 
}: ProductFiltersProps) {
  const { filters, updateFilters, clearFilters } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    rating: true,
    features: true,
  });


  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    filters.priceRange || priceRange
  );

  const toggleSection = (section: ExpandedSectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filters */}
      <div className={cn('hidden lg:block', className)}>
        <FilterContent
          filters={filters}
          localPriceRange={localPriceRange}
          expandedSections={expandedSections}
          availableBrands={availableBrands}
          priceRange={priceRange}
          onFilterChange={handleFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
          onToggleSection={toggleSection}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent
                  filters={filters}
                  localPriceRange={localPriceRange}
                  expandedSections={expandedSections}
                  availableBrands={availableBrands}
                  priceRange={priceRange}
                  onFilterChange={handleFilterChange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onToggleSection={toggleSection}
                  onClearFilters={handleClearFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface FilterContentProps {
  filters: SearchFilters;
  localPriceRange: [number, number];
  expandedSections: Record<string, boolean>;
  availableBrands: string[];
  priceRange: [number, number];
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onToggleSection: (section: ExpandedSectionKey) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

function FilterContent({
  filters,
  localPriceRange,
  expandedSections,
  availableBrands,
  priceRange,
  onFilterChange,
  onPriceRangeChange,
  onToggleSection,
  onClearFilters,
  activeFiltersCount,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Sort By</h4>
        <select
          value={filters.sortBy || 'relevance'}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-gray-900">Price Range</h4>
          {expandedSections.price ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div className="px-3">
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={localPriceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value), localPriceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={localPriceRange[1]}
                  onChange={(e) => onPriceRangeChange([localPriceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider mt-2"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>₹{localPriceRange[0].toLocaleString()}</span>
                <span>₹{localPriceRange[1].toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('brand')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-gray-900">Brand</h4>
          {expandedSections.brand ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.brand && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 max-h-48 overflow-y-auto"
            >
              {availableBrands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand?.includes(brand) || false}
                    onChange={(e) => {
                      const currentBrands = filters.brand || [];
                      const newBrands = e.target.checked
                        ? [...currentBrands, brand]
                        : currentBrands.filter(b => b !== brand);
                      onFilterChange({ brand: newBrands });
                    }}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('rating')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-gray-900">Customer Rating</h4>
          {expandedSections.rating ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === rating}
                    onChange={() => onFilterChange({ rating })}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-700">{rating}</span>
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-500">& above</span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <button
          onClick={() => onToggleSection('features')}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="font-medium text-gray-900">Features</h4>
          {expandedSections.features ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock || false}
                  onChange={(e) => onFilterChange({ inStock: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isNew || false}
                  onChange={(e) => onFilterChange({ isNew: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">New Arrivals</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.isFeatured || false}
                  onChange={(e) => onFilterChange({ isFeatured: e.target.checked })}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}