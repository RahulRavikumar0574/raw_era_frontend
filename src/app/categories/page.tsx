'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  UserGroupIcon,
  SparklesIcon,
  FilmIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface CategoryItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CategorySection {
  title: string;
  items: CategoryItem[];
}

const categories: CategorySection[] = [
  {
    title: 'CATEGORY',
    items: [
      { name: 'Men', href: '/products?category=mens', icon: UserGroupIcon },
      { name: 'Women', href: '/products?category=womens', icon: UserGroupIcon },
      { name: 'Kids', href: '/products?category=kids', icon: UserGroupIcon },
    ]
  },
  {
    title: 'MAIN CATEGORY',
    items: [
      { name: 'Influencers', href: '/products?main_category=influencers', icon: StarIcon },
      { name: 'Artists', href: '/products?main_category=artists', icon: SparklesIcon },
      { name: 'Movies', href: '/products?main_category=movies', icon: FilmIcon },
      { name: 'The Raw Era (OG Products)', href: '/products?main_category=raw-era', icon: SparklesIcon },
    ]
  },
  {
    title: 'PRODUCTS',
    items: [
      { name: 'Oversized Tee', href: '/products?product_type=oversized-tee' },
      { name: 'Shirts', href: '/products?product_type=shirts' },
      { name: 'Crop Shirts', href: '/products?product_type=crop-shirts' },
    ]
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h1>
            <p className="text-lg text-gray-300">Explore our curated collections designed for every style and occasion</p>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Categories Grid */}
        <div className="space-y-16">
          {categories.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                <Link href="/products" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                  View All <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((item) => (
                  <Link key={item.name} href={item.href} className="group">
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/5] mb-3">
                      <img
                        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80"
                        alt={item.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg">{item.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-12 text-white"
        >
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">New Arrivals</h2>
            <p className="text-gray-300 mb-6">
              Discover our latest collection featuring premium quality and contemporary designs
            </p>
            <Link href="/products?featured=true" className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Explore Collection <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-orange-600/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}