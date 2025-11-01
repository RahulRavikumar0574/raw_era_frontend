'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCartIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  TruckIcon,
  TagIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';

interface BulkOrderForm {
  // Contact Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  
  // Order Details
  productCategory: string;
  productDescription: string;
  quantity: number;
  estimatedBudget: string;
  
  // Additional Information
  deliveryDate: string;
  deliveryAddress: string;
  customizationRequired: boolean;
  customizationDetails: string;
  additionalNotes: string;
}

const quantityTiers = [
  { min: 50, max: 99, discount: 10 },
  { min: 100, max: 249, discount: 15 },
  { min: 250, max: 499, discount: 20 },
  { min: 500, max: 999, discount: 25 },
  { min: 1000, max: Infinity, discount: 30 },
];

const productCategories = [
  'T-Shirts',
  'Shirts',
  'Hoodies & Sweatshirts',
  'Jackets',
  'Pants & Jeans',
  'Accessories',
  'Custom Merchandise',
  'Corporate Uniforms',
  'Other'
];

export default function BulkOrderPage() {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BulkOrderForm>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productCategory: '',
    productDescription: '',
    quantity: 50,
    estimatedBudget: '',
    deliveryDate: '',
    deliveryAddress: '',
    customizationRequired: false,
    customizationDetails: '',
    additionalNotes: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getDiscountForQuantity = (quantity: number): number => {
    const tier = quantityTiers.find(t => quantity >= t.min && quantity <= t.max);
    return tier ? tier.discount : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.companyName || !formData.contactPerson || !formData.email || !formData.phone) {
      toast.error('Required Fields', 'Please fill in all required contact information');
      return;
    }

    if (!formData.productCategory || !formData.quantity) {
      toast.error('Required Fields', 'Please provide product category and quantity');
      return;
    }

    if (formData.quantity < 50) {
      toast.error('Minimum Quantity', 'Bulk orders require a minimum quantity of 50 items');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Bulk Order Submitted:', formData);
      toast.success(
        'Bulk Order Request Submitted!',
        'Our team will contact you within 24-48 hours with a detailed quote.'
      );
      
      // Reset form
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        productCategory: '',
        productDescription: '',
        quantity: 50,
        estimatedBudget: '',
        deliveryDate: '',
        deliveryAddress: '',
        customizationRequired: false,
        customizationDetails: '',
        additionalNotes: ''
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  const currentDiscount = getDiscountForQuantity(formData.quantity);

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <UserGroupIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bulk Order Request</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get special pricing for bulk orders. Perfect for corporate events, uniforms, promotional merchandise, and more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Full Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="email@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingCartIcon className="w-6 h-6 text-orange-600" />
                  Order Details
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select a category</option>
                      {productCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Description
                    </label>
                    <textarea
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Describe the products you need (colors, sizes, designs, etc.)"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="50"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {currentDiscount > 0 && (
                        <p className="mt-2 text-sm text-green-600 font-medium">
                          🎉 You qualify for {currentDiscount}% bulk discount!
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Budget
                      </label>
                      <select
                        name="estimatedBudget"
                        value={formData.estimatedBudget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-50k">Under ₹50,000</option>
                        <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                        <option value="1l-2l">₹1,00,000 - ₹2,00,000</option>
                        <option value="2l-5l">₹2,00,000 - ₹5,00,000</option>
                        <option value="above-5l">Above ₹5,00,000</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TruckIcon className="w-6 h-6 text-orange-600" />
                  Delivery Information
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Delivery Date
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Complete delivery address"
                    />
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="w-6 h-6 text-orange-600" />
                  Customization
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="customizationRequired"
                      checked={formData.customizationRequired}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I need customization (logo printing, embroidery, etc.)
                    </label>
                  </div>

                  {formData.customizationRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customization Details
                      </label>
                      <textarea
                        name="customizationDetails"
                        value={formData.customizationDetails}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Describe your customization requirements (logo placement, colors, text, etc.)"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any other requirements or questions?"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Submit Bulk Order Request
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Discount Tiers */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-orange-600" />
                Bulk Discounts
              </h3>
              <div className="space-y-3">
                {quantityTiers.map((tier, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.quantity >= tier.min && formData.quantity <= tier.max
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {tier.min} - {tier.max === Infinity ? '∞' : tier.max} units
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {tier.discount}% OFF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  'Competitive bulk pricing',
                  'High-quality products',
                  'Custom branding options',
                  'Fast turnaround time',
                  'Dedicated account manager',
                  'Flexible payment terms',
                  'Free shipping on large orders',
                  'Quality guarantee'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="mailto:bulk@souledstore.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="text-sm">bulk@souledstore.com</span>
                </a>
                <a
                  href="tel:+911234567890"
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" />
                  <span className="text-sm">+91 123 456 7890</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
