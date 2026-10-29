'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';
import { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  showStock?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  gender?: 'unisex' | 'fitted';
  productStock?: number;
}

export default function SizeSelector({
  variants,
  selectedVariant,
  onVariantSelect,
  showStock = false,
  size = 'md',
  className,
  gender = 'unisex',
  productStock = 0,
}: SizeSelectorProps) {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const rawSizeVariants = variants?.filter(variant => variant.type?.toLowerCase() === 'size') || [];

  if (rawSizeVariants.length === 0) return null;

  // Flatten and expand any comma-separated variants (e.g. "S,M,L,XL,XXL,3XL") into individual clickable sizes
  const parsedVariants: ProductVariant[] = [];
  rawSizeVariants.forEach((variant) => {
    if (variant.value && variant.value.includes(',')) {
      const parts = variant.value.split(',').map((p) => p.trim()).filter(Boolean);
      parts.forEach((part, idx) => {
        // Fall back to productStock if individual variant stock is 0 but product is in stock
        const effectiveStock =
          variant.stock > 0
            ? variant.stock
            : productStock > 0
            ? productStock
            : 0;

        parsedVariants.push({
          ...variant,
          id: `${variant.id}-${part}-${idx}`,
          value: part,
          stock: effectiveStock,
        });
      });
    } else {
      const effectiveStock =
        variant.stock > 0
          ? variant.stock
          : productStock > 0
          ? productStock
          : 0;

      parsedVariants.push({
        ...variant,
        stock: effectiveStock,
      });
    }
  });

  const sizeClasses = {
    sm: 'min-w-[36px] h-9 px-2.5 text-xs',
    md: 'min-w-[46px] h-11 px-3.5 text-sm',
    lg: 'min-w-[54px] h-12 px-4 text-base'
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">Select Size:</span>
          {selectedVariant && (
            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              {selectedVariant.value}
            </span>
          )}
        </div>
        {selectedVariant && showStock && (
          <span className={cn(
            'text-xs font-medium',
            selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of stock'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 items-center">
        {parsedVariants.map((variant) => {
          const isSelected =
            selectedVariant?.id === variant.id ||
            selectedVariant?.value?.toUpperCase() === variant.value?.toUpperCase();
          const isOutOfStock = variant.stock === 0 && productStock === 0;
          const isHovered = hoveredVariant === variant.id;

          return (
            <motion.button
              key={variant.id}
              type="button"
              onClick={() => !isOutOfStock && onVariantSelect(variant)}
              onMouseEnter={() => setHoveredVariant(variant.id)}
              onMouseLeave={() => setHoveredVariant(null)}
              disabled={isOutOfStock}
              className={cn(
                sizeClasses[size],
                'relative flex items-center justify-center border-2 rounded-xl font-bold transition-all duration-200 select-none cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                isSelected
                  ? 'border-orange-500 bg-orange-500 text-white shadow-sm ring-1 ring-orange-500'
                  : isOutOfStock
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50/60 shadow-xs',
                'disabled:cursor-not-allowed'
              )}
              whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
            >
              <span>{variant.value}</span>
              
              {/* Selected indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center shadow-xs"
                  >
                    <CheckIcon className="w-2.5 h-2.5 text-white stroke-[3]" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Out of stock diagonal line */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-xl">
                  <div className="w-[140%] h-[1.5px] bg-red-400 rotate-45 absolute" />
                </div>
              )}

              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && showStock && !isOutOfStock && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap z-20 shadow-md"
                  >
                    {variant.stock} in stock
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Size guide link */}
      <div>
        <button
          className="text-xs text-orange-600 hover:text-orange-700 underline font-medium inline-flex items-center gap-1"
          type="button"
          onClick={() => setShowGuide(true)}
        >
          Size Guide
        </button>
      </div>

      {/* Size Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden border border-gray-200 relative max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex items-center justify-between shadow-md">
              <h2 className="text-lg md:text-xl font-bold tracking-wide">Garment Size Guide</h2>
              <button
                className="text-white hover:text-orange-100 text-2xl leading-none font-bold focus:outline-none"
                onClick={() => setShowGuide(false)}
                aria-label="Close size guide"
              >
                &times;
              </button>
            </div>
            <div className="p-6 md:p-8 bg-white text-gray-900 overflow-y-auto">
              {gender === 'unisex' ? (
                <>
                  <h3 className="font-bold text-orange-600 mb-2 text-base">Topwear (Inches & CM)</h3>
                  <table className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                    <thead>
                      <tr className="bg-orange-100 text-gray-900">
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Size</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">USA Chest</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">USA Sleeve</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Intl. Chest (cm)</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Intl. Sleeve (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-center">
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">S</td><td className="border px-2 py-2">35-37</td><td className="border px-2 py-2">34.5</td><td className="border px-2 py-2">89-94</td><td className="border px-2 py-2">88</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">M</td><td className="border px-2 py-2">38-40</td><td className="border px-2 py-2">35.5</td><td className="border px-2 py-2">97-102</td><td className="border px-2 py-2">90</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">L</td><td className="border px-2 py-2">41-43</td><td className="border px-2 py-2">36.5</td><td className="border px-2 py-2">104-109</td><td className="border px-2 py-2">93</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XL</td><td className="border px-2 py-2">44-46</td><td className="border px-2 py-2">37.5</td><td className="border px-2 py-2">112-117</td><td className="border px-2 py-2">95</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XXL</td><td className="border px-2 py-2">47-49</td><td className="border px-2 py-2">38.5</td><td className="border px-2 py-2">119-124</td><td className="border px-2 py-2">98</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">3XL</td><td className="border px-2 py-2">50-52</td><td className="border px-2 py-2">39.5</td><td className="border px-2 py-2">126-132</td><td className="border px-2 py-2">100</td></tr>
                    </tbody>
                  </table>
                  <h3 className="font-bold text-orange-600 mb-2 text-base">Bottoms (Inches & CM)</h3>
                  <table className="w-full mb-4 border border-gray-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                    <thead>
                      <tr className="bg-orange-100 text-gray-900">
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Size</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">USA Waist</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">USA Inseam</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Intl. Waist (cm)</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Intl. Inseam (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-center">
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">S</td><td className="border px-2 py-2">27-29</td><td className="border px-2 py-2">30-32</td><td className="border px-2 py-2">68-74</td><td className="border px-2 py-2">76</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">M</td><td className="border px-2 py-2">30-32</td><td className="border px-2 py-2">32-34</td><td className="border px-2 py-2">76-81</td><td className="border px-2 py-2">78-81</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">L</td><td className="border px-2 py-2">33-36</td><td className="border px-2 py-2">34-36</td><td className="border px-2 py-2">81-86</td><td className="border px-2 py-2">81-86</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XL</td><td className="border px-2 py-2">36-38</td><td className="border px-2 py-2">36-38</td><td className="border px-2 py-2">91-97</td><td className="border px-2 py-2">81-86</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XXL</td><td className="border px-2 py-2">39-41</td><td className="border px-2 py-2">32-34</td><td className="border px-2 py-2">99-104</td><td className="border px-2 py-2">81-86</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">3XL</td><td className="border px-2 py-2">42-44</td><td className="border px-2 py-2">34-36</td><td className="border px-2 py-2">106-112</td><td className="border px-2 py-2">86</td></tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-orange-600 mb-2 text-base">Fitted Garments</h3>
                  <table className="w-full mb-6 border border-gray-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                    <thead>
                      <tr className="bg-orange-100 text-gray-900">
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Size</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Length</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Bust</th>
                        <th className="border border-gray-200 px-3 py-2 font-semibold">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-center">
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XS</td><td className="border px-2 py-2">26"</td><td className="border px-2 py-2">37"</td><td className="border px-2 py-2">15"</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">S</td><td className="border px-2 py-2">27"</td><td className="border px-2 py-2">39"</td><td className="border px-2 py-2">15"</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">M</td><td className="border px-2 py-2">27"</td><td className="border px-2 py-2">41"</td><td className="border px-2 py-2">15½"</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">L</td><td className="border px-2 py-2">27"</td><td className="border px-2 py-2">44"</td><td className="border px-2 py-2">16"</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">XL</td><td className="border px-2 py-2">29"</td><td className="border px-2 py-2">46"</td><td className="border px-2 py-2">16"</td></tr>
                      <tr><td className="border px-2 py-2 font-bold bg-gray-50">2XL</td><td className="border px-2 py-2">30"</td><td className="border px-2 py-2">50"</td><td className="border px-2 py-2">16"</td></tr>
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
