import Link from 'next/link';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingBagIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-800">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-white">The Raw Era</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your destination for premium quality fashion. Discover trendy clothing for men, women, and kids.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="w-4 h-4 text-orange-500" />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <EnvelopeIcon className="w-4 h-4 text-orange-500" />
                <span>support@souledstore.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="w-4 h-4 text-orange-500" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-orange-500 transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-sm hover:text-orange-500 transition-colors">Shop</Link></li>
              <li><Link href="/categories" className="text-sm hover:text-orange-500 transition-colors">Categories</Link></li>
              <li><Link href="/track-order" className="text-sm hover:text-orange-500 transition-colors">Track Order</Link></li>
              <li><Link href="/orders" className="text-sm hover:text-orange-500 transition-colors">My Orders</Link></li>
              <li><Link href="/wishlist" className="text-sm hover:text-orange-500 transition-colors">Wishlist</Link></li>
              <li><Link href="/feedback" className="text-sm hover:text-orange-500 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/bulk-order" className="text-sm hover:text-orange-500 transition-colors">Bulk Orders</Link></li>
              <li><Link href="/international-order" className="text-sm hover:text-orange-500 transition-colors">International Orders</Link></li>
              <li><Link href="/returns" className="text-sm hover:text-orange-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/shipping" className="text-sm hover:text-orange-500 transition-colors">Shipping Info</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-orange-500 transition-colors">FAQs</Link></li>
              <li><Link href="/size-guide" className="text-sm hover:text-orange-500 transition-colors">Size Guide</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                Subscribe
              </button>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1-2 0a1 1 0 0 1 2 0z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <TruckIcon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Free Shipping</h4>
              <p className="text-xs text-gray-400">On orders over ₹500</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowPathIcon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">30-Day Returns</h4>
              <p className="text-xs text-gray-400">Easy returns & exchanges</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Secure Payment</h4>
              <p className="text-xs text-gray-400">100% secure transactions</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBagIcon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">COD Available</h4>
              <p className="text-xs text-gray-400">Cash on delivery option</p>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} The Raw Era. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/returns" className="text-gray-400 hover:text-orange-500 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="text-gray-400 hover:text-orange-500 transition-colors">FAQs</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Payment Methods:</span>
            <div className="flex gap-2">
              <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">💳</div>
              <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">UPI</div>
              <div className="w-8 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">₹</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 