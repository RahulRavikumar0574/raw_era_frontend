'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  ClockIcon,
  FireIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { MicrophoneIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { mockProducts } from '@/data/mockData';
import { useSearchStore } from '@/store';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AdvancedSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showVoiceSearch?: boolean;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand' | 'recent' | 'trending';
  value: string;
  label: string;
  count?: number;
  product?: Product;
}

export default function AdvancedSearch({
  onSearch,
  placeholder = "Search for products, brands, and more...",
  className,
  showSuggestions = true,
  showVoiceSearch = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { recentSearches, addRecentSearch } = useSearchStore();

  // Mock trending searches
  const trendingSearches = [
    'oversized t-shirt',
    'vintage hoodie',
    'summer dress',
    'denim jacket',
    'kids superhero'
  ];

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent and trending when no query
      const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map(search => ({
        type: 'recent',
        value: search,
        label: search
      }));

      const trendingSuggestions: SearchSuggestion[] = trendingSearches.map(search => ({
        type: 'trending',
        value: search,
        label: search
      }));

      setSuggestions([...recentSuggestions, ...trendingSuggestions]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const queryLower = query.toLowerCase();
      const newSuggestions: SearchSuggestion[] = [];

      // Product suggestions
      const productMatches = mockProducts
        .filter(product => 
          product.name.toLowerCase().includes(queryLower) ||
          product.description.toLowerCase().includes(queryLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(queryLower))
        )
        .slice(0, 5);

      productMatches.forEach(product => {
        newSuggestions.push({
          type: 'product',
          value: product.name,
          label: product.name,
          product
        });
      });

      // Brand suggestions
      const brands = Array.from(new Set(mockProducts.map(p => p.brand)))
        .filter(brand => brand.toLowerCase().includes(queryLower))
        .slice(0, 3);

      brands.forEach(brand => {
        const count = mockProducts.filter(p => p.brand === brand).length;
        newSuggestions.push({
          type: 'brand',
          value: brand,
          label: `${brand} (${count} products)`,
          count
        });
      });

      // Category suggestions
      const categories = Array.from(new Set(mockProducts.map(p => p.category.name)))
        .filter(category => category.toLowerCase().includes(queryLower))
        .slice(0, 3);

      categories.forEach(category => {
        const count = mockProducts.filter(p => p.category.name === category).length;
        newSuggestions.push({
          type: 'category',
          value: category,
          label: `${category} (${count} products)`,
          count
        });
      });

      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query, recentSearches]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      onSearch?.(query.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.value);
    addRecentSearch(suggestion.value);
    onSearch?.(suggestion.value);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined' || !(window as any).webkitSpeechRecognition) {
      alert('Voice search not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      addRecentSearch(transcript);
      onSearch?.(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
      case 'trending':
        return <FireIcon className="w-4 h-4 text-orange-500" />;
      case 'brand':
      case 'category':
        return <TagIcon className="w-4 h-4 text-blue-500" />;
      case 'product':
        return <MagnifyingGlassIcon className="w-4 h-4 text-green-500" />;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-12 pr-20 py-3 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 shadow-sm transition-all duration-200 text-gray-800 placeholder-gray-500"
          />
          
          {/* Search Icon */}
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          {/* Right Side Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            )}
            
            {showVoiceSearch && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                disabled={isListening}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  isListening 
                    ? 'bg-red-100 text-red-600' 
                    : 'hover:bg-gray-200 text-gray-400'
                )}
                title="Voice Search"
              >
                <MicrophoneIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No suggestions found</p>
              </div>
            ) : (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.value}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors',
                      selectedIndex === index && 'bg-gray-50'
                    )}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    
                    <div className="flex-1 min-w-0">
                      {suggestion.type === 'product' && suggestion.product ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={suggestion.product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={suggestion.product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {suggestion.label}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{suggestion.product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {suggestion.label}
                          </p>
                          {suggestion.type === 'recent' && (
                            <p className="text-xs text-gray-500">Recent search</p>
                          )}
                          {suggestion.type === 'trending' && (
                            <p className="text-xs text-gray-500">Trending</p>
                          )}
                        </div>
                      )}
                    </div>

                    {suggestion.type === 'product' && suggestion.product && (
                      <Link
                        href={`/products/${suggestion.product.id}`}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}