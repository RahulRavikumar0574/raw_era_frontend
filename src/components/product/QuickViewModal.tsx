'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Product } from '@/types';
import { useCartStore, useWishlistStore, useComparisonStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const { addItem: addToCart } = useCartStore();
  const { wishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { products: comparisonProducts, addProduct: addToComparison } = useComparisonStore();
  const toast = useToast();

  if (!product) return null;

  const isInWishlist = wishlist.items.some(item => item.productId === product.id);
  const isInComparison = comparisonProducts.some(p => p.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant || product.variants?.[0]?.id, quantity);
    toast.success('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.info('Removed from Wishlist', `${product.name} has been removed from your wishlist`);
    } else {
      addToWishlist(product);
      toast.success('Added to Wishlist', `${product.name} has been added to your wishlist`);
    }
  };

  const handleAddToComparison = () => {
    if (!isInComparison) {
      addToComparison(product);
      toast.success('Added to Comparison', `${product.name} has been added to comparison`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.origin + `/products/${product.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
      toast.success('Link Copied', 'Product link has been copied to clipboard');
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    {/* Product Images */}
                    <div className="space-y-4">
                      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={product.images[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Image Navigation */}
                        {product.images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                            >
                              <ChevronLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                            >
                              <ChevronRightIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Zoom Icon */}
                        <div className="absolute top-2 left-2 p-2 bg-white bg-opacity-80 rounded-full">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Thumbnail Images */}
                      {product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {product.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={cn(
                                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                                selectedImageIndex === index
                                  ? 'border-orange-500'
                                  : 'border-gray-200 hover:border-gray-300'
                              )}
                            >
                              <img
                                src={image.url}
                                alt={`${product.name} ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                )}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              ({product.rating}) • {product.reviewCount || 0} reviews
                            </span>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl font-bold text-orange-600">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <>
                              <span className="text-lg text-gray-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-medium rounded">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                      </div>

                      {/* Variants */}
                      {product.variants && product.variants.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                          <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant.id)}
                                className={cn(
                                  'px-4 py-2 border rounded-lg text-sm font-medium transition-colors',
                                  selectedVariant === variant.id
                                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                                    : 'border-gray-300 hover:border-gray-400'
                                )}
                              >
                                {variant.value}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quantity */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
                        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-lg">−</span>
                          </button>
                          <span className="px-4 py-2 font-medium">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={quantity >= product.stock}
                          >
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.stock} items available
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleAddToCart}
                          disabled={product.stock === 0}
                          className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          <ShoppingCartIcon className="w-5 h-5" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <div className="flex gap-3">
                          <button
                            onClick={handleToggleWishlist}
                            className={cn(
                              'flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-colors',
                              isInWishlist
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            )}
                          >
                            {isInWishlist ? (
                              <HeartSolid className="w-5 h-5" />
                            ) : (
                              <HeartIcon className="w-5 h-5" />
                            )}
                            {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                          </button>

                          <button
                            onClick={handleAddToComparison}
                            disabled={isInComparison}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            {isInComparison ? 'In Comparison' : 'Compare'}
                          </button>

                          <button
                            onClick={handleShare}
                            className="p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <ShareIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="border-t pt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Brand:</span>
                            <span className="ml-2 font-medium">{product.brand}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Category:</span>
                            <span className="ml-2 font-medium">{product.category?.name || 'Uncategorized'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">SKU:</span>
                            <span className="ml-2 font-medium">{product.sku}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stock:</span>
                            <span className="ml-2 font-medium">{product.stock} units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}