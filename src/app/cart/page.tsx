'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { mockProducts } from '@/data/mockData';
import ProductCard from '@/components/product/ProductCard';

export default function CartPage() {
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const {
    cart,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateTotals
  } = useCartStore();

  const { addItem: addToWishlist } = useWishlistStore();
  const toast = useToast();
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Get recommended products dynamically from backend (fallback to mock products)
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    fetch(`${backendUrl}/products?pageSize=10`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error();
        const data = await res.json();
        const items = data.items || data;
        const cartProductIds = cart.items.map(item => item.productId);
        setRecommendedProducts(items.filter((p: any) => !cartProductIds.includes(p.id)).slice(0, 4));
      })
      .catch(() => {
        const cartProductIds = cart.items.map(item => item.productId);
        setRecommendedProducts(mockProducts.filter(product => !cartProductIds.includes(product.id)).slice(0, 4));
      });
  }, [cart.items]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
      removeItem(itemId);
      toast.success('Removed from Cart', `${item.product.name} has been removed from your cart`);
    }
  };

  const handleMoveToWishlist = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
      addToWishlist(item.product);
      removeItem(itemId);
      toast.success('Moved to Wishlist', `${item.product.name} has been moved to your wishlist`);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsApplyingCoupon(true);
    
    // Simulate API call
    setTimeout(() => {
      applyCoupon(couponCode);
      toast.success('Coupon Applied', `Coupon "${couponCode}" has been applied successfully`);
      setCouponCode('');
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.info('Coupon Removed', 'Coupon has been removed from your cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.info('Cart Cleared', 'All items have been removed from your cart');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* You may also like section for empty cart */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">You may also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          
                          {item.variant && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.variant.name}: {item.variant.value}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 transition-colors"
                                disabled={item.quantity >= item.product.stock}
                              >
                                <PlusIcon className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Actions */}
                            <button
                              onClick={() => handleMoveToWishlist(item.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <HeartIcon className="w-4 h-4" />
                              Move to Wishlist
                            </button>

                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.product.originalPrice && item.product.originalPrice > item.price && (
                            <p className="text-sm text-gray-500 line-through">
                              ₹{(item.product.originalPrice * item.quantity).toLocaleString()}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            ₹{item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isApplyingCoupon}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                
                {cart.couponCode && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800 font-medium">
                        {cart.couponCode}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cart.subtotal.toLocaleString()}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{cart.discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {cart.shipping === 0 ? 'Free' : `₹${cart.shipping.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="font-medium">₹{cart.tax.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-red-600">
                      ₹{cart.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <TruckIcon className="w-5 h-5 text-blue-500" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You may also like section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You may also like</h2>
              <p className="text-gray-600">Discover more products you might love</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}