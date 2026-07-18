'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ViewOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  items: Array<{ id: string; name: string; image: string; price: number; quantity: number; size?: string; color?: string }>;
  shippingAddress: any;
  paymentMethod: string;
  trackingNumber?: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const [order, setOrder] = useState<ViewOrder | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    fetch(`${backendUrl}/orders/${params.id}`, { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        const o = data.order;
        const mapped: ViewOrder = {
          id: o.id,
          orderNumber: o.orderNumber,
          createdAt: o.createdAt,
          status: String(o.status || 'pending'),
          total: o.total,
          subtotal: o.subtotal,
          shipping: o.shipping,
          tax: o.tax,
          items: (o.items || []).map((it: any) => ({
            id: it.id,
            name: it.product?.name || 'Product',
            image: it.product?.images?.[0]?.url || '/images/placeholder.png',
            price: it.price,
            quantity: it.quantity,
          })),
          shippingAddress: o.shippingAddress,
          paymentMethod: o.paymentMethod || 'COD',
          trackingNumber: o.trackingNumber || undefined,
        };
        setOrder(mapped);
      })
      .catch(() => {});
  }, [params.id]);

  const handleReturnItem = (itemId: string) => {
    setSelectedItem(itemId);
    setShowReturnModal(true);
  };

  const submitReturn = () => {
    if (!returnReason) {
      alert('Please select a reason for return');
      return;
    }
    // Here you would submit the return request
    alert('Return request submitted successfully! We will contact you shortly.');
    setShowReturnModal(false);
    setSelectedItem(null);
    setReturnReason('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Orders</span>
        </button>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order #{order?.orderNumber}</p>
              <p className="text-sm text-gray-500">Placed on {order ? new Date(order.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="w-5 h-5" />
                {order?.status}
              </span>
              <Link
                href="/track-order"
                className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                Track Order →
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order?.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-orange-600 font-semibold mt-2">₹{item.price.toLocaleString()}</p>
                    </div>
                    {order?.status === 'delivered' && (
                      <button
                        onClick={() => handleReturnItem(item.id)}
                        className="px-4 py-2 text-sm border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors h-fit">
                        Return Item
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-gray-600">
                <p className="font-semibold text-gray-900">{order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}</p>
                <p className="mt-1">{order?.shippingAddress?.address1}</p>
                <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}</p>
                <p className="mt-2">Phone: {order?.shippingAddress?.phone}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{order?.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">{(order?.shipping || 0) === 0 ? 'Free' : `₹${order?.shipping}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹{order?.tax?.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>Total</span>
                  <span>₹{order?.total?.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCardIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>
              <p className="text-gray-600">{order?.paymentMethod}</p>
              <p className="text-sm text-green-600 mt-2">✓ Payment Confirmed</p>
            </motion.div>

            {/* Tracking */}
            {order?.trackingNumber && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TruckIcon className="w-5 h-5 text-orange-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
                </div>
                <p className="text-sm text-gray-600 mb-2">Tracking Number:</p>
                <p className="font-mono text-gray-900 font-semibold">{order?.trackingNumber}</p>
                <Link
                  href="/track-order"
                  className="mt-4 block text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Track Package
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <ArrowPathIcon className="w-6 h-6 text-orange-600" />
              <h3 className="text-xl font-semibold text-gray-900">Return Item</h3>
            </div>
            <p className="text-gray-600 mb-4">Please select a reason for returning this item:</p>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4">
              <option value="">Select a reason</option>
              <option value="size">Wrong Size</option>
              <option value="defective">Defective Product</option>
              <option value="different">Different from Description</option>
              <option value="quality">Quality Issues</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowReturnModal(false);
                  setSelectedItem(null);
                  setReturnReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={submitReturn}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Submit Return
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
