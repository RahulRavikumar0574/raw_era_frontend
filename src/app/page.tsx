"use client";
import { useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import { IconX, IconTrendingUp, IconShield, IconTruck } from "@tabler/icons-react";
import { motion } from 'framer-motion';

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white pt-16">
      {/* Drawer/Sidebar with overlay and animation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Overlay: semi-transparent, page visible behind */}
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setDrawerOpen(false)} />
          {/* Drawer: slide-in animation */}
          <div className="relative w-72 h-full bg-white p-6 overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
            <button
              className="mb-4"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <IconX className="w-6 h-6" />
            </button>
            {/* Main menu and submenu structure */}
            <div>
              <div className="font-bold mb-2 text-gray-800 text-md tracking-wide uppercase">CATEGORY</div>
              <ul className="mb-4 pl-2 space-y-1">
                <li><Link href="/products?category=mens" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Men</Link></li>
                <li><Link href="/products?category=womens" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Women</Link></li>
                <li><Link href="/products?category=kids" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Kids</Link></li>
              </ul>
              <div className="font-bold mb-2 text-gray-800 text-md tracking-wide uppercase">MAIN CATEGORY</div>
              <ul className="mb-4 pl-2 space-y-1">
                <li><Link href="/main-categories/influencers" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">INFLUENCERS</Link></li>
                <li><Link href="/main-categories/artists" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">ARTISTS</Link></li>
                <li><Link href="/main-categories/movies" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">MOVIES</Link></li>
                <li><Link href="/main-categories/the-raw-era" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">THE RAW ERA (OG PRODUCTS)</Link></li>
              </ul>
              <div className="font-bold mb-2 text-gray-800 text-md tracking-wide uppercase">PRODUCTS</div>
              <ul className="pl-2 space-y-1">
                <li><Link href="/products/oversized-tee" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">OVERSIZED TEE</Link></li>
                <li><Link href="/products/shirts" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">SHIRTS</Link></li>
                <li><Link href="/products/crop-shirts" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">CROP SHIRTS</Link></li>
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* Hero Carousel */}
      <div className="w-full bg-white dark:bg-[#18181b] min-h-[500px] relative">
        <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false} showIndicators={true} showArrows={true} interval={5000} className="hero-carousel">
          <div className="relative h-[500px]">
            <img src="/banner1.webp" alt="Banner 1" className="object-cover h-full" onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-8 text-white">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-5xl font-bold mb-4">New Season Collection</h2>
                  <p className="text-xl mb-6 text-gray-200">Discover the latest trends in fashion</p>
                  <Link href="/products" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Shop Now</Link>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px]">
            <img src="/banner2.webp" alt="Banner 2" className="object-cover h-full" onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-8 text-white">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-5xl font-bold mb-4">Premium Quality</h2>
                  <p className="text-xl mb-6 text-gray-200">Crafted with care and attention to detail</p>
                  <Link href="/products?featured=true" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Explore</Link>
                </motion.div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px]">
            <img src="/banner3.webp" alt="Banner 3" className="object-cover h-full" onError={(e) => e.currentTarget.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="max-w-7xl mx-auto px-8 text-white">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-5xl font-bold mb-4">Limited Edition</h2>
                  <p className="text-xl mb-6 text-gray-200">Exclusive designs you won't find anywhere else</p>
                  <Link href="/products?new=true" className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">Shop Limited</Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>

      {/* Categories Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our diverse collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{name: 'Men', href: '/products?category=mens', img: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=400&q=80'},
              {name: 'Women', href: '/products?category=womens', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80'},
              {name: 'Kids', href: '/products?category=kids', img: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80'},
              {name: 'Accessories', href: '/products?category=accessories', img: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=400&q=80'}].map((cat, i) => (
              <Link key={cat.name} href={cat.href} className="group relative overflow-hidden rounded-lg aspect-square">
                <img src={cat.img} alt={cat.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-semibold text-xl">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconTruck className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Free Shipping</h3>
                <p className="text-gray-600 text-sm">On orders over ₹500</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconShield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Payment</h3>
                <p className="text-gray-600 text-sm">100% secure transactions</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-start gap-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconTrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Premium Quality</h3>
                <p className="text-gray-600 text-sm">Curated collections</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">Get exclusive access to new arrivals, special offers, and more</p>
          <Link href="/products" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Start Shopping</Link>
        </div>
      </div>
    </div>
  );
}
