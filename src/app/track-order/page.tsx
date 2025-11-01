'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';

interface TrackingStatus {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export default function TrackOrderPage() {
  const toast = useToast();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber || !email) {
      toast.error('Required Fields', 'Please enter both order number and email');
      return;
    }

    setIsTracking(true);

    // Simulate API call
    setTimeout(() => {
      setTrackingData({
        orderNumber: orderNumber,
        status: 'In Transit',
        estimatedDelivery: 'Dec 25, 2024',
        carrier: 'FedEx',
        trackingNumber: 'FDX' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        currentLocation: 'Mumbai Distribution Center',
        timeline: [
          {
            status: 'Order Placed',
            location: 'Online',
            timestamp: 'Dec 18, 2024 10:30 AM',
            description: 'Your order has been confirmed',
            completed: true
          },
          {
            status: 'Processing',
            location: 'Warehouse - Delhi',
            timestamp: 'Dec 19, 2024 2:15 PM',
            description: 'Order is being prepared for shipment',
            completed: true
          },
          {
            status: 'Shipped',
            location: 'Delhi Hub',
            timestamp: 'Dec 20, 2024 9:00 AM',
            description: 'Package has been dispatched',
            completed: true
          },
          {
            status: 'In Transit',
            location: 'Mumbai Distribution Center',
            timestamp: 'Dec 22, 2024 4:30 PM',
            description: 'Package is on the way to your location',
            completed: true
          },
          {
            status: 'Out for Delivery',
            location: 'Local Delivery Hub',
            timestamp: 'Pending',
            description: 'Package will be delivered soon',
            completed: false
          },
          {
            status: 'Delivered',
            location: 'Your Address',
            timestamp: 'Pending',
            description: 'Package has been delivered',
            completed: false
          }
        ]
      });
      setIsTracking(false);
      toast.success('Order Found', 'Your order tracking information is displayed below');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <TruckIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order details to get real-time tracking updates</p>
        </motion.div>

        {/* Tracking Form */}
        {!trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., ORD-123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isTracking}
                className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isTracking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <TruckIcon className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setTrackingData(null)}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  Track Another Order
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold text-gray-900">{trackingData.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-orange-600">{trackingData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-semibold text-gray-900">{trackingData.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900">{trackingData.estimatedDelivery}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Tracking Timeline</h2>
              <div className="space-y-6">
                {trackingData.timeline.map((item: TrackingStatus, index: number) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Timeline Line */}
                    {index < trackingData.timeline.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    
                    {/* Icon */}
                    <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {item.completed ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${
                            item.completed ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {item.status}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            item.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {item.location}
                            </span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <a href="tel:+911234567890" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <PhoneIcon className="w-5 h-5" />
                  <span>+91 123 456 7890</span>
                </a>
                <a href="mailto:support@souledstore.com" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
                  <EnvelopeIcon className="w-5 h-5" />
                  <span>support@souledstore.com</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}