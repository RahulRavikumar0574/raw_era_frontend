'use client';

import { motion } from 'framer-motion';
import { TruckIcon, ClockIcon, MapPinIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <TruckIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Information</h1>
          <p className="text-gray-600">Fast and reliable delivery across India</p>
        </motion.div>

        <div className="space-y-6">
          {/* Shipping Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Methods</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <TruckIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Standard Delivery</h3>
                    <p className="text-sm text-gray-600 mb-2">5-7 business days</p>
                    <p className="text-sm text-gray-600">Free shipping on orders above ₹500</p>
                    <p className="text-sm text-orange-600 font-medium">₹50 for orders below ₹500</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Express Delivery</h3>
                    <p className="text-sm text-gray-600 mb-2">2-3 business days</p>
                    <p className="text-sm text-gray-600">Available in major cities</p>
                    <p className="text-sm text-orange-600 font-medium">₹150 flat rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    Orders are processed within 1-2 business days. You'll receive a confirmation email once your order is shipped.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">In Transit</h3>
                  <p className="text-sm text-gray-600">
                    Track your order in real-time using the tracking number provided in your shipping confirmation email.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Out for Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your order is out for delivery. Our delivery partner will contact you before delivery.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Delivered</h3>
                  <p className="text-sm text-gray-600">
                    Your order has been delivered. Please inspect the package and contact us if there are any issues.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Locations</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Domestic Shipping</p>
                  <p className="text-sm">We ship to all states and union territories across India including remote areas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">International Shipping</p>
                  <p className="text-sm">We offer international shipping to select countries. Visit our <a href="/international-order" className="text-orange-600 hover:underline">International Orders</a> page for more details.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Delivery times may vary during peak seasons and holidays</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Please ensure someone is available to receive the package</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Signature may be required for high-value orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>We're not responsible for delays caused by incorrect addresses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Track your order anytime on our <a href="/track-order" className="text-orange-600 hover:underline">Track Order</a> page</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
