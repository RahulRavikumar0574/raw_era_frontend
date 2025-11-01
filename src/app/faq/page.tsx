'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    category: 'Orders & Payment',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our products, select your desired items, choose size/color, and click "Add to Cart". Once you\'re done shopping, go to your cart and click "Checkout" to complete your purchase.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Credit/Debit Cards, UPI, Net Banking, Wallets, and Cash on Delivery (COD). All payments are processed securely.'
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can modify or cancel your order within 24 hours of placing it. Contact our customer service team immediately for assistance.'
      },
      {
        q: 'Do you offer Cash on Delivery?',
        a: 'Yes, COD is available for orders across India. A small COD handling fee may apply for certain orders.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard delivery takes 5-7 business days. Express delivery (2-3 days) is available in major cities for an additional charge.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to select countries. Visit our International Orders page for more details on shipping rates and delivery times.'
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you\'ll receive a tracking number via email. You can also track your order on our Track Order page.'
      },
      {
        q: 'What if I\'m not available for delivery?',
        a: 'Our delivery partner will attempt delivery 2-3 times. If unsuccessful, the package will be returned. Please ensure someone is available to receive it.'
      }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer 30-day returns on most items. Products must be unused, with original tags, and in original packaging. Visit our Returns page for complete details.'
      },
      {
        q: 'How do I return an item?',
        a: 'Go to My Orders, select the item, and click "Return Item". We\'ll arrange a free pickup from your address.'
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive and inspect your returned item. The amount will be credited to your original payment method.'
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes, you can exchange items for a different size or color. Select the exchange option when initiating a return.'
      }
    ]
  },
  {
    category: 'Products & Sizing',
    questions: [
      {
        q: 'How do I choose the right size?',
        a: 'Refer to our Size Guide available on each product page. If you\'re between sizes, we recommend sizing up for a comfortable fit.'
      },
      {
        q: 'Are the product images accurate?',
        a: 'We strive to display accurate product images. However, colors may vary slightly due to screen settings and lighting conditions.'
      },
      {
        q: 'Do you restock sold-out items?',
        a: 'Popular items are usually restocked. Sign up for notifications on the product page to be alerted when it\'s back in stock.'
      },
      {
        q: 'Are your products authentic?',
        a: 'Yes, all our products are 100% authentic and sourced directly from authorized suppliers and manufacturers.'
      }
    ]
  },
  {
    category: 'Account & Security',
    questions: [
      {
        q: 'Do I need an account to place an order?',
        a: 'You can checkout as a guest, but creating an account helps you track orders, save addresses, and access exclusive offers.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page. Enter your email, and we\'ll send you a password reset link.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, we use industry-standard encryption and secure payment gateways. We never store your complete card details.'
      },
      {
        q: 'How do I update my account information?',
        a: 'Log in to your account and go to Settings. You can update your personal information, addresses, and preferences there.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <QuestionMarkCircleIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about our products and services</p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{category.category}</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {category.questions.map((faq, faqIndex) => {
                  const itemId = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openItems.includes(itemId);
                  
                  return (
                    <div key={itemId}>
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                        <ChevronDownIcon
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-4">
                          <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still Have Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Can't find the answer you're looking for? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/feedback" className="inline-flex items-center justify-center px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
              Contact Support
            </a>
            <a href="tel:+911234567890" className="inline-flex items-center justify-center px-6 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
