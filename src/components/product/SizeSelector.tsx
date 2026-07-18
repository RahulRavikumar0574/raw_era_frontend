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
  gender?: 'men' | 'women';
}

export default function SizeSelector({
  variants,
  selectedVariant,
  onVariantSelect,
  showStock = false,
  size = 'md',
  className,
  gender = 'men',
}: SizeSelectorProps) {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const sizeVariants = variants?.filter(variant => variant.type?.toLowerCase() === 'size') || [];

  if (sizeVariants.length === 0) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Size:</span>
        {selectedVariant && (
          <span className="text-sm text-gray-600">
            {selectedVariant.value}
            {showStock && (
              <span className={cn(
                'ml-1',
                selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                ({selectedVariant.stock > 0 ? `${selectedVariant.stock} left` : 'Out of stock'})
              </span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {sizeVariants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const isOutOfStock = variant.stock === 0;
          const isHovered = hoveredVariant === variant.id;

          return (
            <motion.button
              key={variant.id}
              onClick={() => !isOutOfStock && onVariantSelect(variant)}
              onMouseEnter={() => setHoveredVariant(variant.id)}
              onMouseLeave={() => setHoveredVariant(null)}
              disabled={isOutOfStock}
              className={cn(
                sizeClasses[size],
                'relative flex items-center justify-center border-2 rounded-lg font-medium transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                isSelected
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : isOutOfStock
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-orange-300 hover:bg-orange-50',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              whileHover={!isOutOfStock ? { scale: 1.05 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
            >
              {variant.value}
              
              {/* Selected indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
                  >
                    <CheckIcon className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-5/6 h-0.5 bg-red-500 rotate-45 absolute" />
                  <span className="absolute text-xs text-red-600 font-bold" style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>X</span>
                </div>
              )}

              {/* Hover tooltip */}
              <AnimatePresence>
                {isHovered && showStock && !isOutOfStock && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
                  >
                    {variant.stock} in stock
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Size guide link */}
      <button
        className="text-xs text-orange-600 hover:text-orange-700 underline"
        type="button"
        onClick={() => setShowGuide(true)}
      >
        Size Guide
      </button>

      {/* Size Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-0 overflow-hidden border-2 border-orange-300 relative"
          >
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-4 text-white flex items-center justify-between shadow-md">
              <h2 className="text-lg md:text-2xl font-bold tracking-wide">Size Guide</h2>
              <button
                className="text-white text-2xl hover:text-orange-200 focus:outline-none"
                onClick={() => setShowGuide(false)}
                aria-label="Close size guide"
              >
                &times;
              </button>
            </div>
            <div className="p-8 md:p-10 bg-white text-gray-900">
              {gender === 'men' ? (
                <>
                  <h3 className="font-bold text-orange-600 mb-2 text-base md:text-lg">Men's Tops</h3>
                  <table className="w-full mb-6 border border-orange-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                    <thead>
                      <tr className="bg-orange-200 text-gray-900">
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Size</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">USA Chest</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">USA Sleeve</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Intl. Chest</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Intl. Sleeve</th>
                      </tr>
                    </thead>
                  <tbody>
                    <tr><td className="border px-2 py-1">S</td><td className="border px-2 py-1">35-37</td><td className="border px-2 py-1">34.5</td><td className="border px-2 py-1">89-94</td><td className="border px-2 py-1">88</td></tr>
                    <tr><td className="border px-2 py-1">M</td><td className="border px-2 py-1">38-40</td><td className="border px-2 py-1">35.5</td><td className="border px-2 py-1">97-102</td><td className="border px-2 py-1">90</td></tr>
                    <tr><td className="border px-2 py-1">L</td><td className="border px-2 py-1">41-43</td><td className="border px-2 py-1">36.5</td><td className="border px-2 py-1">104-109</td><td className="border px-2 py-1">93</td></tr>
                    <tr><td className="border px-2 py-1">XL</td><td className="border px-2 py-1">44-46</td><td className="border px-2 py-1">37.5</td><td className="border px-2 py-1">112-117</td><td className="border px-2 py-1">95</td></tr>
                    <tr><td className="border px-2 py-1">XXL</td><td className="border px-2 py-1">47-49</td><td className="border px-2 py-1">38.5</td><td className="border px-2 py-1">119-124</td><td className="border px-2 py-1">98</td></tr>
                  </tbody>
                </table>
                  <h3 className="font-bold text-orange-600 mb-2 text-base md:text-lg">Men's Bottoms</h3>
                  <table className="w-full mb-6 border border-orange-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                    <thead>
                      <tr className="bg-orange-200 text-gray-900">
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Size</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">USA Waist</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">USA Inseam</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Intl. Waist</th>
                        <th className="border border-orange-200 px-3 py-2 font-semibold">Intl. Inseam</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border px-2 py-1">S</td><td className="border px-2 py-1">27-29</td><td className="border px-2 py-1">30-32</td><td className="border px-2 py-1">68-74</td><td className="border px-2 py-1">76</td></tr>
                      <tr><td className="border px-2 py-1">M</td><td className="border px-2 py-1">30-32</td><td className="border px-2 py-1">32-34</td><td className="border px-2 py-1">76-81</td><td className="border px-2 py-1">78-81</td></tr>
                      <tr><td className="border px-2 py-1">L</td><td className="border px-2 py-1">33-36</td><td className="border px-2 py-1">34-36</td><td className="border px-2 py-1">81-86</td><td className="border px-2 py-1">81-86</td></tr>
                      <tr><td className="border px-2 py-1">XL</td><td className="border px-2 py-1">36-38</td><td className="border px-2 py-1">36-38</td><td className="border px-2 py-1">91-97</td><td className="border px-2 py-1">81-86</td></tr>
                      <tr><td className="border px-2 py-1">XXL</td><td className="border px-2 py-1">39-41</td><td className="border px-2 py-1">32-34</td><td className="border px-2 py-1">99-104</td><td className="border px-2 py-1">81-86</td></tr>
                    </tbody>
                  </table>
                
                
              </>
            ) : (
              <>
                <h3 className="font-bold text-orange-600 mb-2 text-base md:text-lg">Women's Garments</h3>
                <table className="w-full mb-6 border border-orange-200 rounded-lg overflow-hidden text-xs md:text-sm bg-white">
                  <thead>
                    <tr className="bg-orange-200 text-gray-900">
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Size</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Length</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Bust</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Shoulder</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Short Sleeves</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">3/4 Sleeves</th>
                      <th className="border border-orange-200 px-3 py-2 font-semibold">Full Sleeves</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-2 py-1">XS</td><td className="border px-2 py-1">26"</td><td className="border px-2 py-1">37"</td><td className="border px-2 py-1">15"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">17"</td><td className="border px-2 py-1">21"</td></tr>
                    <tr><td className="border px-2 py-1">S</td><td className="border px-2 py-1">27"</td><td className="border px-2 py-1">39"</td><td className="border px-2 py-1">15"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">17"</td><td className="border px-2 py-1">21"</td></tr>
                    <tr><td className="border px-2 py-1">M</td><td className="border px-2 py-1">27"</td><td className="border px-2 py-1">41"</td><td className="border px-2 py-1">15½"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">18"</td><td className="border px-2 py-1">21"</td></tr>
                    <tr><td className="border px-2 py-1">L</td><td className="border px-2 py-1">27"</td><td className="border px-2 py-1">44"</td><td className="border px-2 py-1">16"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">18"</td><td className="border px-2 py-1">22"</td></tr>
                    <tr><td className="border px-2 py-1">XL</td><td className="border px-2 py-1">29"</td><td className="border px-2 py-1">46"</td><td className="border px-2 py-1">16"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">19"</td><td className="border px-2 py-1">22"</td></tr>
                    <tr><td className="border px-2 py-1">2XL</td><td className="border px-2 py-1">30"</td><td className="border px-2 py-1">50"</td><td className="border px-2 py-1">16"</td><td className="border px-2 py-1">8"</td><td className="border px-2 py-1">19"</td><td className="border px-2 py-1">22"</td></tr>
                  </tbody>
                </table>
                <h3 className="font-semibold mb-2">Kaftan & Nightwear</h3>
                <table className="w-full border text-xs">
                  <thead>
                    <tr className="bg-pink-100">
                      <th className="border px-2 py-1">Type</th>
                      <th className="border px-2 py-1">XS</th>
                      <th className="border px-2 py-1">S</th>
                      <th className="border px-2 py-1">M</th>
                      <th className="border px-2 py-1">L</th>
                      <th className="border px-2 py-1">XL</th>
                      <th className="border px-2 py-1">2XL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-2 py-1">Kaftan Length</td><td className="border px-2 py-1">33"</td><td className="border px-2 py-1">33"</td><td className="border px-2 py-1">33"</td><td className="border px-2 py-1">33"</td><td className="border px-2 py-1">35"</td><td className="border px-2 py-1">35"</td></tr>
                    <tr><td className="border px-2 py-1">Sleepshirt Length</td><td className="border px-2 py-1">38"</td><td className="border px-2 py-1">38"</td><td className="border px-2 py-1">38"</td><td className="border px-2 py-1">38"</td><td className="border px-2 py-1">38"</td><td className="border px-2 py-1">38"</td></tr>
                    <tr><td className="border px-2 py-1">Nightgown Length</td><td className="border px-2 py-1">52"</td><td className="border px-2 py-1">52"</td><td className="border px-2 py-1">52"</td><td className="border px-2 py-1">52"</td><td className="border px-2 py-1">53"</td><td className="border px-2 py-1">53"</td></tr>
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
