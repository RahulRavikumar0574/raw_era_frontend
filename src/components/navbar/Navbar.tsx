"use client";

import { useState, useRef, useEffect } from 'react';
import { IconUser, IconHeart, IconShoppingCart, IconMapPin, IconMenu2 } from '@tabler/icons-react';
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  ArrowsUpDownIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Bulk Orders', href: '/bulk-order' },
  { label: 'International', href: '/international-order' },
  { label: 'Contact', href: '/feedback' },
];

const mostSearched = [
  'Oversized T-Shirt',
  'Vintage Hoodie',
  'Denim Jacket',
  'Summer Dress',
  'Cargo Shorts',
];


export default function NavbarTop({ onHamburgerClick }: { onHamburgerClick?: () => void }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const cartItems = useCartStore(state => state.cart.items);
  const wishlistItems = useWishlistStore(state => state.wishlist.items);
  const comparisonProducts = typeof window !== 'undefined' && window.localStorage.getItem('comparison')
    ? JSON.parse(window.localStorage.getItem('comparison') || '[]')
    : [];
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const toast = useToast();

  const handleSearch = (query: string) => {
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
    await fetch(`${backendUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
    logout();
    setIsUserMenuOpen(false);
    toast.success('Logged Out', 'You have been successfully logged out');
    router.push('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    // Hydrate user from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
    fetch(`${backendUrl}/auth/me`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        const u = data.user;
        if (u) {
          login({
            id: u.id,
            email: u.email,
            firstName: u.firstName || 'User',
            lastName: u.lastName || '',
            avatar: u.avatarUrl || undefined,
          } as any);
        }
      })
      .catch(() => {});
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">

      
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Hamburger + Logo */}
          <div className="flex items-center">
            <button
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              <IconMenu2 className="w-6 h-6 text-gray-700" />
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                The Raw Era
              </span>
            </Link>
          </div>
          {/* Center Section - Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Search Bar - Simplified */}
          <div className="hidden md:flex items-center flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                onFocus={() => router.push('/products')}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Right Section - Icons */}
          <div className="flex items-center space-x-2 ml-4">
            
            {/* Comparison Icon */}
            <Link href="/comparison" className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors group hidden md:block" title="Compare Products">
              <ArrowsUpDownIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
              {comparisonProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {comparisonProducts.length}
                </span>
              )}
            </Link>
            
            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors group">
              <IconHeart className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-orange-50 transition-colors group"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-7 h-7 rounded-full object-cover border-2 border-orange-200"
                    />
                  ) : (
                    <UserCircleIcon className="w-7 h-7 text-gray-600 group-hover:text-orange-600 transition-colors" />
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                    {user.firstName}
                  </span>
                </button>
              ) : (
                <Link href="/auth/login" className="p-2 rounded-lg hover:bg-orange-50 transition-colors group">
                  <IconUser className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isAuthenticated && user && isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserCircleIcon className="w-5 h-5" />
                  My Profile
                </Link>
                
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <ClipboardDocumentListIcon className="w-5 h-5" />
                  My Orders
                </Link>
                
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  Settings
                </Link>
              </div>
              
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
            </div>
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-orange-50 transition-colors group">
              <IconShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Search Bar - Mobile */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  onFocus={() => {
                    router.push('/products');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks
                .filter((link) => link.label !== 'Bulk Orders')
                .map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))
              }
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Quick Links */}
            <div className="space-y-1">
              <Link
                href="/bulk-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                <span className="font-medium">Bulk Orders</span>
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                <IconMapPin className="w-5 h-5" />
                <span className="font-medium">Track Order</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                <ClipboardDocumentListIcon className="w-5 h-5" />
                <span className="font-medium">My Orders</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
              >
                <IconHeart className="w-5 h-5" />
                <span className="font-medium">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* User Section */}
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="px-4 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="font-medium">My Profile</span>
                </Link>
                <Link
                  href="/profile/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                <IconUser className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-2 text-sm text-gray-600">
                <a href="tel:+919946812233" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                  <span>📞</span>
                  <span>+91 99468 12233</span>
                </a>
                <a href="mailto:Info@rawera.com" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                  <span>✉️</span>
                  <span>Info@rawera.com</span>
                </a>
                <a href="https://www.instagram.com/the.rawera?igsh=YzA5dzA0dndjOTJ2" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                  <span>📷</span>
                  <span>@the.rawera</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
