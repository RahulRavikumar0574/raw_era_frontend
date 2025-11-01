'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
  StarIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  ShoppingCartIcon as CartSolidIcon
} from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { useCartStore, useWishlistStore, useComparisonStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';

type ProductCardProps = {
  product: Product;
  className?: string;
  showQuickActions?: boolean;
  layout?: 'grid' | 'list';
};

export default function ProductCard({
  product,
  className,
  showQuickActions = true,
  layout = 'grid'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  const addToWishlist = useWishlistStore(state => state.addItem);
  const removeFromWishlist = useWishlistStore(state => state.removeItem);
  const isInWishlist = useWishlistStore(state => state.isInWishlist);
  const addToComparison = useComparisonStore(state => state.addProduct);
  const isInComparison = useComparisonStore(state => state.isInComparison);
  const toast = useToast();

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const secondaryImage = product.images[1];
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setShowSizeSelector(true);
      toast.info('Select Size', 'Please select a size before adding to cart');
      return;
    }
    
    addToCart(product, selectedVariant?.id, 1);
    
    const variantText = selectedVariant ? ` (${selectedVariant.value})` : '';
    toast.success('Added to Cart', `${product.name}${variantText} has been added to your cart`);
    
    // Redirect to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info('Removed from Wishlist', `${product.name} has been removed from your wishlist`);
    } else {
      addToWishlist(product);
      toast.success('Added to Wishlist', `${product.name} has been added to your wishlist`);
    }
  };

  const handleAddToComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToComparison(product);
    toast.success('Added to Comparison', `${product.name} has been added to comparison`);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleVariantSelect = (variant: any) => {
    setSelectedVariant(variant);
    setShowSizeSelector(false);
  };

  const renderSizeSelector = () => {
    if (!product.variants || product.variants.length === 0) return null;

    return (
      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Size:</span>
          {selectedVariant && (
            <span className="text-sm text-orange-600 font-medium">
              {selectedVariant.value}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleVariantSelect(variant);
              }}
              className={cn(
                'px-3 py-1.5 text-sm border rounded-md transition-all',
                selectedVariant?.id === variant.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700',
                variant.stock === 0 && 'opacity-50 cursor-not-allowed'
              )}
              disabled={variant.stock === 0}
            >
              {variant.value}
              {variant.stock === 0 && (
                <span className="ml-1 text-xs">(Out)</span>
              )}
            </button>
          ))}
        </div>
        {showSizeSelector && (
          <p className="text-xs text-red-600 mt-1">Please select a size</p>
        )}
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={cn(
          'w-4 h-4',
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ));
  };

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-gray-100',
          className
        )}
      >
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Link href={`/products/${product.id}`}>
              <img
                src={primaryImage?.url || '/placeholder-product.jpg'}
                alt={primaryImage?.alt || product.name}
                className="w-full h-full object-cover rounded-lg"
                onLoad={() => setImageLoaded(true)}
              />
            </Link>
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                -{discountPercentage}%
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-semibold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.shortDescription}
              </p>
            </Link>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount})
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-orange-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Selector for List View */}
              {renderSizeSelector()}

              {showQuickActions && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={handleWishlistToggle}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    {isInWishlist(product.id) ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleAddToComparison}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Add to Comparison"
                    disabled={!!isInComparison(product.id)}
                  >
                    <ArrowsRightLeftIcon className={cn(
                      'w-5 h-5',
                      isInComparison(product.id) ? 'text-blue-500' : 'text-gray-400'
                    )} />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        'bg-white shadow-md rounded-[var(--border-radius)] transition-all hover:shadow-lg border border-transparent hover:border-[var(--accent)]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-64">
            <img
              src={isHovered && secondaryImage ? secondaryImage.url : primaryImage?.url || '/placeholder-product.jpg'}
              alt={primaryImage?.alt || product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
        </div>

        {discountPercentage > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{discountPercentage}%
          </span>
        )}

        {/* Quick Actions */}
        {showQuickActions && (
          <div className={cn(
            'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300',
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          )}>
            <button
              onClick={handleWishlistToggle}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              {isInWishlist(product.id) ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={handleAddToComparison}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              title="Add to Comparison"
              disabled={!!isInComparison(product.id)}
            >
              <ArrowsRightLeftIcon className={cn(
                'w-5 h-5',
                isInComparison(product.id) ? 'text-blue-500' : 'text-gray-600'
              )} />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              title="Quick View"
            >
              <EyeIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Quick Add to Cart */}
        <div className={cn(
          'absolute bottom-3 left-3 right-3 transition-all duration-300',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviewCount})
          </span>
        </div>

        {/* Available Sizes Display */}
        {product.variants && product.variants.filter(v => v.type === 'SIZE').length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-xs font-medium text-gray-700">Available Sizes:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.variants
                .filter(v => v.type === 'SIZE')
                .map((variant) => (
                  <span 
                    key={variant.id}
                    className="px-2 py-0.5 text-xs border rounded-md border-gray-300 bg-gray-50 text-gray-700"
                  >
                    {variant.value}
                  </span>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector for Grid View */}
        {renderSizeSelector()}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-600">
              ₹{(selectedVariant?.price || product.price).toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          )}
          
          {product.stock === 0 && (
            <span className="text-xs text-red-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </motion.div>
  );
}