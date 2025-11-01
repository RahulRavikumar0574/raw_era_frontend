'use client';

import { motion } from 'framer-motion';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <ArrowPathIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Returns & Refunds</h1>
          <p className="text-gray-600">Easy returns within 30 days of purchase</p>
        </motion.div>

        <div className="space-y-6">
          {/* Return Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Return Policy</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                you can return it within 30 days of delivery for a full refund or exchange.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Eligible for Return:</h3>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li>• Unused items with original tags</li>
                      <li>• Items in original packaging</li>
                      <li>• Defective or damaged products</li>
                      <li>• Wrong item received</li>
                      <li>• Size or fit issues</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-2">Not Eligible for Return:</h3>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li>• Used or worn items</li>
                      <li>• Items without original tags</li>
                      <li>• Innerwear and swimwear</li>
                      <li>• Sale items (unless defective)</li>
                      <li>• Gift cards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* How to Return */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Return</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Initiate Return</h3>
                  <p className="text-sm text-gray-600">
                    Go to My Orders and select the item you want to return. Click on "Return Item" button.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Select Reason</h3>
                  <p className="text-sm text-gray-600">
                    Choose the reason for return and provide any additional details if needed.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Schedule Pickup</h3>
                  <p className="text-sm text-gray-600">
                    We'll arrange a free pickup from your address. Pack the item securely with all tags.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Refund</h3>
                  <p className="text-sm text-gray-600">
                    Once we receive and inspect the item, your refund will be processed within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Refund Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Information</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                <strong>Refund Timeline:</strong> Refunds are processed within 5-7 business days after we receive 
                and inspect your returned item.
              </p>
              <p>
                <strong>Refund Method:</strong> Refunds will be credited to your original payment method. 
                For COD orders, we'll process a bank transfer.
              </p>
              <p>
                <strong>Exchange:</strong> If you prefer an exchange instead of a refund, we'll ship the replacement 
                item once we receive your return.
              </p>
              <p>
                <strong>Shipping Costs:</strong> Return shipping is free for defective or wrong items. 
                For other returns, shipping charges may apply.
              </p>
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about returns or refunds, our customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:+911234567890" className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors">
                <span>📞 Call Us</span>
              </a>
              <a href="mailto:support@souledstore.com" className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 rounded-lg hover:bg-orange-100 transition-colors">
                <span>✉️ Email Us</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
