'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useWishlistStore, useCartStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export default function WishlistPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const { 
    wishlist, 
    removeItem, 
    clearWishlist 
  } = useWishlistStore();
  
  const { addToCart } = useCartStore();
  const toast = useToast();

  const handleRemoveItem = (productId: string) => {
    const item = wishlist.items.find(item => item.productId === productId);
    if (item) {
      removeItem(productId);
      toast.success('Removed from Wishlist', `${item.product.name} has been removed from your wishlist`);
    }
  };

  const handleAddToCart = (productId: string) => {
    const item = wishlist.items.find(item => item.productId === productId);
    if (item) {
      addToCart(item.product);
      toast.success('Added to Cart', `${item.product.name} has been added to your cart`);
    }
  };

  const handleMoveToCart = (productId: string) => {
    const item = wishlist.items.find(item => item.productId === productId);
    if (item) {
      addToCart(item.product);
      removeItem(productId);
      toast.success('Moved to Cart', `${item.product.name} has been moved to your cart`);
    }
  };

  const handleSelectItem = (productId: string) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.items.map(item => item.productId));
    }
  };

  const handleAddSelectedToCart = () => {
    selectedItems.forEach(productId => {
      handleAddToCart(productId);
    });
    setSelectedItems([]);
  };

  const handleRemoveSelected = () => {
    if (window.confirm(`Are you sure you want to remove ${selectedItems.length} items from your wishlist?`)) {
      selectedItems.forEach(productId => {
        removeItem(productId);
      });
      setSelectedItems([]);
      toast.success('Items Removed', `${selectedItems.length} items have been removed from your wishlist`);
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      setSelectedItems([]);
      toast.info('Wishlist Cleared', 'All items have been removed from your wishlist');
    }
  };

  const handleShareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist - SouledStore',
        text: 'Check out my wishlist on SouledStore!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link Copied', 'Wishlist link has been copied to clipboard');
    }
  };

  if (wishlist.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <HeartIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon. They'll appear here for easy access later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <HeartSolidIcon className="w-8 h-8 text-orange-500" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlist.items.length} {wishlist.items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShareWishlist}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                Share
              </button>
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {wishlist.items.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === wishlist.items.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium">
                    Select All ({selectedItems.length}/{wishlist.items.length})
                  </span>
                </label>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddSelectedToCart}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />
                    Add to Cart ({selectedItems.length})
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Remove ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.productId)}
                      onChange={() => handleSelectItem(item.productId)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </label>
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <Link href={`/products/${item.product.id}`}>
                    <img
                      src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Remove from Wishlist */}
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Remove from Wishlist"
                  >
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-12 flex flex-col gap-2">
                    {item.product.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        New
                      </span>
                    )}
                    {item.product.originalPrice && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="block"
                  >
                    <h3 className="font-semibold text-lg text-gray-900 hover:text-red-600 transition-colors line-clamp-2 mb-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-red-600">
                      ₹{item.product.price.toLocaleString()}
                    </span>
                    {item.product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    {item.product.stock > 0 ? (
                      <span className="text-sm text-green-600 font-medium">
                        In Stock ({item.product.stock} available)
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item.productId)}
                      disabled={item.product.stock === 0}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                        item.product.stock > 0
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={item.product.stock === 0}
                      className={cn(
                        'px-3 py-2 rounded-lg border transition-colors',
                        item.product.stock > 0
                          ? 'border-red-600 text-red-600 hover:bg-red-50'
                          : 'border-gray-300 text-gray-400 cursor-not-allowed'
                      )}
                      title="Add to Cart"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-3">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}