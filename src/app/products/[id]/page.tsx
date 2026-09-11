'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import SizeSelector from '@/components/product/SizeSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store';
import { useToast } from '@/hooks/useToast';
import { FireIcon, ExclamationCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

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
  const toast = useToast();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    fetch(`${backendUrl}/products/${id}`, { credentials: 'include', signal: controller.signal })
      .then(async r => {
        if (!r.ok) throw new Error('Not found');
        const data = await r.json();
        setProduct(data);
        setSelectedVariant(null);
        setSelectedImageIdx(0);
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">This product may have been removed or is no longer available.</p>
        <button
          onClick={() => router.push('/products')}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Products
        </button>
      </div>
    );
  }

  const effectiveStock = selectedVariant?.stock ?? product.stock ?? 0;
  const lowStockThreshold = (product as any).lowStockThreshold ?? 10;
  const images = product.images || [];
  const primaryImage = images[selectedImageIdx]?.url || images[0]?.url || '/raw_era.png';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb / back */}
        <button
          className="flex items-center gap-2 mb-8 text-gray-500 hover:text-orange-600 transition-colors text-sm font-medium"
          onClick={() => router.push('/products')}
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={primaryImage}
                alt={images[selectedImageIdx]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${idx === selectedImageIdx ? 'border-orange-500' : 'border-gray-200 hover:border-orange-300'}`}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.category?.name && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{product.category.name}</span>
              )}
              {product.isNew && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">New</span>
              )}
              {product.isFeatured && (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">Featured</span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-1">{product.name}</h1>
            {product.brand && <p className="text-gray-500 text-sm mb-4">by {product.brand}</p>}

            {/* Price Row */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-orange-600">₹{product.price?.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full">{product.discount}% OFF</span>
              )}
            </div>

            {product.shortDescription && (
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
            )}

            {/* Stock Alert */}
            <AnimatePresence mode="wait">
              <div className="mb-4" key={effectiveStock}>
                <StockBadge stock={effectiveStock} threshold={lowStockThreshold} />
              </div>
            </AnimatePresence>

            {/* Variants / Size selector */}
            <div className="mb-5">
              <SizeSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onVariantSelect={setSelectedVariant}
                showStock={true}
                gender={product.category?.name?.toLowerCase().includes('women') ? 'women' : 'men'}
              />
            </div>

            {/* Add to Cart */}
            <button
              disabled={effectiveStock === 0}
              className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all ${
                effectiveStock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg active:scale-95'
              }`}
              onClick={() => {
                if (product.variants && product.variants.length > 0 && !selectedVariant) {
                  toast.info('Select Size', 'Please select a size before adding to cart');
                  return;
                }
                addToCart(product, selectedVariant?.id, 1);
                const variantText = selectedVariant ? ` (${selectedVariant.value})` : '';
                toast.success('Added to Cart', `${product.name}${variantText} added to your cart`);
              }}
            >
              {effectiveStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Description */}
            {product.description && (
              <div className="mt-6 prose prose-sm max-w-none text-gray-700">
                <p>{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Specifications</h2>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  {product.specifications.map((spec: any, idx: number) => (
                    <div key={idx} className="flex text-sm">
                      <span className="w-1/3 bg-gray-50 px-4 py-2.5 font-medium text-gray-700">{spec.name}</span>
                      <span className="flex-1 px-4 py-2.5 text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {product.tags.map((tag: any) => (
                  <span key={typeof tag === 'string' ? tag : tag.name} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
