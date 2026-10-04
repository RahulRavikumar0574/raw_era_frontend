"use client";
import { useState, useEffect } from "react";
import { useToast } from '@/hooks/useToast';

import Link from "next/link";
import { IconX, IconTrendingUp, IconShield, IconTruck } from "@tabler/icons-react";
import { motion } from 'framer-motion';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [heroImage, setHeroImage] = useState('/IMG_4997.PNG');

  useEffect(() => {
    fetch(`${backendUrl}/settings/public`)
      .then(r => r.json())
      .then(data => {
        if (data?.settings?.['homepage.hero_image']) {
          setHeroImage(data.settings['homepage.hero_image']);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Error', 'Please enter your email address');
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Successfully Subscribed!', 'You will now receive updates from the host.');
      setEmail('');
    } catch (error) {
      toast.error('Error', 'Failed to subscribe. Please try again later.');
    }
  };

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
                <li><Link href="/products?category=unisex" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Unisex Topwear</Link></li>
                <li><Link href="/products?category=unisex-bottoms" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Unisex Bottoms</Link></li>
                <li><Link href="/products?category=accessories" className="text-gray-800 hover:text-blue-600 font-medium transition-colors">Accessories</Link></li>
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
      {/* Hero Banner */}
      <div className="w-full bg-white dark:bg-[#18181b] relative">
        <div className="relative w-full flex justify-center bg-black h-[50vh] sm:h-[60vh] md:h-auto">
          <img src={heroImage} alt="Hero Banner" className="w-full h-full md:h-auto object-cover md:object-contain object-top md:object-center max-h-screen" />
        </div>
      </div>

      {/* Categories Section */}
      {/* 
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Explore our diverse collection</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{name: 'Unisex', href: '/products?category=unisex', img: '/categories/unisex_minimalist.jpg'},
              {name: 'Accessories', href: '/products?category=accessories', img: '/categories/accessories_minimalist.jpg'},
              {name: 'Footwear', href: '/products?category=footwear', img: '/categories/footwear_minimalist.jpg'}].map((cat, i) => (
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
      */}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Join Our Community</h2>
          <p className="text-orange-100 mb-4 md:mb-8 text-sm md:text-base max-w-2xl mx-auto">Get exclusive access to new arrivals, special offers, and more</p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-2 md:py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button 
              onClick={handleSubscribe}
              className="px-6 py-2 md:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
