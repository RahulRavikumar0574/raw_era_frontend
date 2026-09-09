'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import SizeSelector from '@/components/product/SizeSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProducts } from '@/data/mockData';
import { useCartStore, useProductStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { FireIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

function StockBadge({ stock, threshold = 10 }: { stock: number; threshold?: number }) {
  if (stock === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-100 border border-red-300 w-fit"
      >
        <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
        <span className="text-red-700 font-semibold text-sm">Out of Stock</span>
      </motion.div>
    );
  }

  if (stock <= threshold) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 w-fit shadow-sm"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
        >
          <FireIcon className="w-5 h-5 text-orange-500" />
        </motion.div>
        <div>
          <span className="text-orange-700 font-bold text-sm">Only {stock} left!</span>
          <span className="text-orange-500 text-xs ml-1.5 font-normal">— selling fast</span>
        </div>
      </motion.div>
    );
  }

  return null;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  const storeProducts = useProductStore(state => state.products);
  const toast = useToast();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    fetch(`${backendUrl}/products/${id}`, { credentials: 'include', signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed');
        const data = await r.json();
        setProduct(data);
        setSelectedVariant(null);
      })
      .catch(() => {
        // Check store first (for admin-created products), then fallback to mock data
        const storeProduct = storeProducts.find(p => p.id === id);
        const found = storeProduct || mockProducts.find(p => p.id === id);
        setProduct(found || null);
      });
    return () => controller.abort();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find that product.</p>
      </div>
    );
  }

  // Determine effective stock (use selected variant stock if available)
  const effectiveStock = selectedVariant?.stock ?? product.stock ?? 0;
  const lowStockThreshold = (product as any).lowStockThreshold ?? 10;

  return (
    <div className="min-h-screen bg-white p-6">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
        onClick={() => router.push('/products')}
      >
        ← Go Back to Products
      </button>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images?.[0]?.url || '/images/placeholder.png'}
            alt={product.images?.[0]?.alt || product.name}
            className="rounded-xl w-full h-auto object-cover mb-4"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <div className="text-lg text-gray-600 mb-3">{product.shortDescription}</div>

          {/* Price Row */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl font-bold text-orange-600">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* ── Stock Alert Badge ── */}
          <AnimatePresence mode="wait">
            <div className="mb-4" key={effectiveStock}>
              <StockBadge stock={effectiveStock} threshold={lowStockThreshold} />
            </div>
          </AnimatePresence>

          <div className="mb-4">
            <SizeSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
              showStock={true}
              gender={product.category?.name.toLowerCase().includes('women') ? 'women' : 'men'}
            />
          </div>

          <div className="mb-4">
            <button
              disabled={effectiveStock === 0}
              className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                effectiveStock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
              onClick={() => {
                if (product.variants && product.variants.length > 0 && !selectedVariant) {
                  toast.info('Select Size', 'Please select a size before adding to cart');
                  return;
                }
                addToCart(product, selectedVariant?.id, 1);
                const variantText = selectedVariant ? ` (${selectedVariant.value})` : '';
                toast.success('Added to Cart', `${product.name}${variantText} has been added to your cart`);
              }}
            >
              {effectiveStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="text-gray-700 mb-4">{product.description}</div>

          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-orange-600">Specifications</h2>
            <ul className="list-disc ml-6 text-gray-600 space-y-1">
              {product.specifications?.map((spec, idx) => (
                <li key={idx}><span className="font-medium">{spec.name}:</span> {spec.value}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags?.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
