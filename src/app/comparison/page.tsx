'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  ShareIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useComparisonStore, useCartStore, useWishlistStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

export default function ComparisonPage() {
  const { products: comparisonProducts, removeProduct, clearComparison } = useComparisonStore();
  const { addItem: addToCart } = useCartStore();
  const { wishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const toast = useToast();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [compactView, setCompactView] = useState(false);

  const handleAddToCart = (product: Product) => {
    // If there are variants, add first variant; else, add without variant
    if (product.variants && product.variants.length > 0) {
      addToCart(product, product.variants[0].id, 1);
    } else {
      addToCart(product, undefined, 1);
    }
    toast.success('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleToggleWishlist = (product: Product) => {
    const isInWishlist = wishlist.items.some(item => item.id === product.id);
    
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from Wishlist', `${product.name} has been removed from your wishlist`);
    } else {
      addToWishlist(product);
      toast.success('Added to Wishlist', `${product.name} has been added to your wishlist`);
    }
  };

  const handleRemoveFromComparison = (productId: string) => {
    const product = comparisonProducts.find((item: Product) => item.id === productId);
    removeProduct(productId);
    if (product) {
      toast.info('Removed from Comparison', `${product.name} has been removed from comparison`);
    }
  };

  const handleClearComparison = () => {
    clearComparison();
    toast.info('Comparison Cleared', 'All products have been removed from comparison');
  };

  const comparisonFeatures = [
    { key: 'price', label: 'Price', type: 'price' },
    { key: 'rating', label: 'Rating', type: 'rating' },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'stock', label: 'Stock', type: 'number' },
    { key: 'material', label: 'Material', type: 'text' },
    { key: 'sizes', label: 'Available Sizes', type: 'array' },
    { key: 'colors', label: 'Available Colors', type: 'array' },
    { key: 'isNew', label: 'New Arrival', type: 'boolean' },
    { key: 'isFeatured', label: 'Featured', type: 'boolean' },
  ];

  const getFeatureValues = (feature: any) => {
    return comparisonProducts.map(product => {
      const value = product[feature.key as keyof Product];
      return { product: product.id, value };
    });
  };

  const hasFeatureDifferences = (feature: any) => {
    const values = getFeatureValues(feature);
    const uniqueValues = new Set(values.map(v => JSON.stringify(v.value)));
    return uniqueValues.size > 1;
  };

  const getBestValue = (feature: any) => {
    const values = getFeatureValues(feature);
    
    switch (feature.type) {
      case 'price':
        const minPrice = Math.min(...values.map(v => Number(v.value) || Infinity));
        return values.find(v => Number(v.value) === minPrice)?.product;
      case 'rating':
        const maxRating = Math.max(...values.map(v => Number(v.value) || 0));
        return values.find(v => Number(v.value) === maxRating)?.product;
      case 'number':
        if (feature.key === 'stock') {
          const maxStock = Math.max(...values.map(v => Number(v.value) || 0));
          return values.find(v => Number(v.value) === maxStock)?.product;
        }
        break;
    }
    return null;
  };

  const renderFeatureValue = (product: Product, feature: any) => {
    const value = product[feature.key as keyof Product];
    const isDifferent = highlightDifferences && hasFeatureDifferences(feature);
    const isBest = getBestValue(feature) === product.id;
    
    const cellClasses = cn(
      'transition-all duration-200',
      isDifferent && 'bg-yellow-50 border-l-4 border-yellow-400',
      isBest && highlightDifferences && 'bg-green-50 border-l-4 border-green-500'
    );
    
    switch (feature.type) {
      case 'price':
        const discount = product.originalPrice && product.originalPrice > product.price 
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0;
        
        return (
          <div className={cn("text-right p-2 rounded", cellClasses)}>
            <div className="flex flex-col items-end">
              <span className={cn(
                "text-lg font-bold",
                isBest && highlightDifferences ? "text-green-600" : "text-orange-600"
              )}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {discount}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      case 'rating':
        return (
          <div className={cn("p-2 rounded", cellClasses)}>
            <div className="flex items-center justify-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.rating) ? (
                    <StarSolid key={i} className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <StarIcon key={i} className="w-4 h-4 text-gray-300" />
                  )
                ))}
              </div>
              <span className={cn(
                "text-sm font-medium",
                isBest && highlightDifferences ? "text-green-600" : "text-gray-600"
              )}>
                ({product.rating})
              </span>
            </div>
          </div>
        );
      case 'array':
        if (feature.key === 'sizes') {
          return (
            <div className={cn("p-2 rounded", cellClasses)}>
              <div className="flex flex-wrap gap-1 justify-center">
                {product.variants?.slice(0, compactView ? 3 : undefined).map((variant, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded font-medium">
                    {variant.value}
                  </span>
                ))}
                {compactView && product.variants && product.variants.length > 3 && (
                  <span className="px-2 py-1 bg-gray-200 text-xs rounded">
                    +{product.variants.length - 3}
                  </span>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className={cn("p-2 rounded text-center", cellClasses)}>
            <span className="text-sm text-gray-600">-</span>
          </div>
        );
      case 'boolean':
        return (
          <div className={cn("p-2 rounded flex justify-center", cellClasses)}>
            {value ? (
              <div className="flex items-center gap-1">
                <CheckIcon className={cn(
                  "w-5 h-5",
                  isBest && highlightDifferences ? "text-green-600" : "text-green-500"
                )} />
                {!compactView && <span className="text-sm text-green-600 font-medium">Yes</span>}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <XIcon className="w-5 h-5 text-gray-400" />
                {!compactView && <span className="text-sm text-gray-400">No</span>}
              </div>
            )}
          </div>
        );
      case 'number':
        return (
          <div className={cn("p-2 rounded text-center", cellClasses)}>
            <span className={cn(
              "text-sm font-medium",
              isBest && highlightDifferences ? "text-green-600" : "text-gray-900"
            )}>
              {String(value) || '0'}
              {feature.key === 'stock' && ' units'}
            </span>
          </div>
        );
      default:
        return (
          <div className={cn("p-2 rounded text-center", cellClasses)}>
            <span className="text-sm text-gray-900 font-medium">{String(value) || '-'}</span>
          </div>
        );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Product Comparison - SouledStore',
        text: `Compare ${comparisonProducts.length} products on SouledStore`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied', 'Comparison link copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg"
            >
              <ArrowsUpDownIcon className="w-16 h-16 text-orange-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              No products to compare
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Add products to comparison from the products page to see detailed side-by-side comparisons with highlighting and insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-medium rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                Browse Products
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Product Comparison
            </h1>
            <p className="text-gray-800 mt-2 text-lg">
              Compare <span className='font-bold text-orange-700'>{comparisonProducts.length}</span> products side by side with smart insights
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                highlightDifferences
                  ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
              )}
            >
              <EyeIcon className="w-4 h-4" />
              {highlightDifferences ? 'Hide' : 'Show'} Differences
            </button>
            
            <button
              onClick={() => setCompactView(!compactView)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                compactView
                  ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
              )}
            >
              <ArrowsUpDownIcon className="w-4 h-4" />
              {compactView ? 'Detailed' : 'Compact'} View
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-lg font-medium transition-all"
            >
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-lg font-medium transition-all"
            >
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
            
            <button
              onClick={handleClearComparison}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-lg font-medium transition-all"
            >
              Clear All
            </button>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Product Headers */}
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className={cn(
                    "p-6 text-left font-bold text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100",
                    compactView ? "w-32" : "w-48"
                  )}>
                    <div className="flex items-center gap-2">
                      <ArrowsUpDownIcon className="w-5 h-5 text-gray-600" />
                      Products
                    </div>
                  </th>
                  {comparisonProducts.map((product: Product, index) => (
                    <motion.th
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={cn("text-center", compactView ? "min-w-48 p-4" : "min-w-64 p-6")}
                    >
                      <div className="relative">
                        <button
                          onClick={() => handleRemoveFromComparison(product.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-all hover:scale-110 z-10"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                        
                        <div className={cn("mb-4", compactView ? "mb-2" : "mb-4")}>
                          <div className="relative group">
                            <img
                              src={product.images[0]?.url || '/placeholder-product.jpg'}
                              alt={product.name}
                              className={cn(
                                "object-cover rounded-xl mx-auto shadow-md group-hover:shadow-lg transition-all",
                                compactView ? "w-24 h-24" : "w-32 h-32"
                              )}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all" />
                          </div>
                        </div>
                        
                        <h3 className={cn(
                          "font-bold text-gray-900 mb-3 line-clamp-2",
                          compactView ? "text-sm" : "text-base"
                        )}>
                          {product.name}
                        </h3>
                        
                        <div className={cn(
                          "flex gap-2 justify-center",
                          compactView ? "flex-col gap-1" : "flex-row gap-2"
                        )}>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className={cn(
                              "flex items-center justify-center gap-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
                              compactView ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
                            )}
                          >
                            <ShoppingCartIcon className={cn(compactView ? "w-3 h-3" : "w-4 h-4")} />
                            {!compactView && "Add to Cart"}
                          </button>
                          
                          <button
                            onClick={() => handleToggleWishlist(product)}
                            className={cn(
                              'rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
                              compactView ? "p-1.5" : "p-2",
                              wishlist.items.some(item => item.id === product.id)
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-600 hover:from-red-200 hover:to-red-300'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300'
                            )}
                          >
                            {wishlist.items.some(item => item.id === product.id) ? (
                              <HeartSolid className={cn(compactView ? "w-3 h-3" : "w-4 h-4")} />
                            ) : (
                              <HeartIcon className={cn(compactView ? "w-3 h-3" : "w-4 h-4")} />
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.th>
                  ))}
                </tr>
              </thead>

              {/* Feature Comparison */}
              <tbody>
                {comparisonFeatures.map((feature, index) => {
                  const hasDifferences = hasFeatureDifferences(feature);
                  
                  return (
                    <motion.tr
                      key={feature.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={cn(
                        "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
                        hasDifferences && highlightDifferences && 'bg-yellow-50/30'
                      )}
                    >
                      <td className="p-6 font-bold text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100">
                        <div className="flex items-center gap-2">
                          {feature.label}
                          {hasDifferences && highlightDifferences && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </td>
                      {comparisonProducts.map((product: Product) => (
                        <td key={product.id} className={cn("text-center", compactView ? "p-3" : "p-6")}>
                          {renderFeatureValue(product, feature)}
                        </td>
                      ))}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <Link
            href="/products"
            className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => {
              let added = 0;
              comparisonProducts.forEach((product: Product) => {
                if (product.variants && product.variants.length > 0) {
                  addToCart(product, product.variants[0].id, 1);
                } else {
                  addToCart(product, undefined, 1);
                }
                added++;
              });
              toast.success('Added All to Cart', `${added} products have been added to your cart`);
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Add All to Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}