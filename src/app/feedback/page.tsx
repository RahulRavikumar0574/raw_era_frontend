'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BugAntIcon,
  LightBulbIcon,
  HeartIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { FeedbackForm, FeedbackType } from '@/types';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

const feedbackTypes = [
  {
    type: 'general' as FeedbackType,
    label: 'General Feedback',
    description: 'Share your thoughts about our store',
    icon: ChatBubbleLeftRightIcon,
    color: 'blue'
  },
  {
    type: 'product' as FeedbackType,
    label: 'Product Feedback',
    description: 'Tell us about a specific product',
    icon: StarIcon,
    color: 'yellow'
  },
  {
    type: 'service' as FeedbackType,
    label: 'Service Feedback',
    description: 'How was your shopping experience?',
    icon: FaceSmileIcon,
    color: 'green'
  },
  {
    type: 'bug' as FeedbackType,
    label: 'Report a Bug',
    description: 'Found something that\'s not working?',
    icon: BugAntIcon,
    color: 'red'
  },
  {
    type: 'feature' as FeedbackType,
    label: 'Feature Request',
    description: 'Suggest new features or improvements',
    icon: LightBulbIcon,
    color: 'purple'
  },
  {
    type: 'complaint' as FeedbackType,
    label: 'Complaint',
    description: 'Report an issue or problem',
    icon: ExclamationTriangleIcon,
    color: 'orange'
  },
  {
    type: 'compliment' as FeedbackType,
    label: 'Compliment',
    description: 'Share what you loved about us',
    icon: HeartIcon,
    color: 'pink'
  }
];

export default function FeedbackPage() {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    type: 'general',
    subject: '',
    message: '',
    rating: undefined,
    productId: undefined,
    orderId: undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof FeedbackForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast.success('Feedback Submitted', 'Thank you for your feedback! We\'ll get back to you soon.');
    } catch (error) {
      toast.error('Submission Failed', 'Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = feedbackTypes.find(type => type.type === formData.type);
  const showRating = ['product', 'service', 'general'].includes(formData.type);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-8">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    type: 'general',
                    subject: '',
                    message: '',
                    rating: undefined,
                    productId: undefined,
                    orderId: undefined
                  });
                }}
                className="px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                Submit Another Feedback
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-orange-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            We'd Love Your Feedback
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Your feedback helps us improve our products and services. Tell us what you think!
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What type of feedback?
              </h2>
              <div className="space-y-3">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.type === type.type;
                  
                  return (
                    <button
                      key={type.type}
                      onClick={() => handleInputChange('type', type.type)}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 transition-all text-left',
                        isSelected
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          isSelected ? 'bg-orange-100' : 'bg-gray-100'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            isSelected ? 'text-orange-600' : 'text-gray-600'
                          )} />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            'font-medium',
                            isSelected ? 'text-orange-900' : 'text-gray-900'
                          )}>
                            {type.label}
                          </h3>
                          <p className={cn(
                            'text-sm mt-1',
                            isSelected ? 'text-orange-700' : 'text-gray-600'
                          )}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                {selectedType && (
                  <>
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <selectedType.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {selectedType.label}
                      </h2>
                      <p className="text-gray-600">{selectedType.description}</p>
                    </div>
                  </>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Rating (for applicable types) */}
                {showRating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          {formData.rating && star <= formData.rating ? (
                            <StarSolid className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <StarIcon className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                          )}
                        </button>
                      ))}
                      {formData.rating && (
                        <span className="ml-2 text-sm text-gray-600">
                          {formData.rating} out of 5 stars
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Brief summary of your feedback"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                    placeholder="Please provide detailed feedback..."
                  />
                </div>

                {/* Optional Fields */}
                {(formData.type === 'product' || formData.type === 'complaint') && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.productId || ''}
                        onChange={(e) => handleInputChange('productId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Enter product ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.orderId || ''}
                        onChange={(e) => handleInputChange('orderId', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Enter order ID"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium transition-all',
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}