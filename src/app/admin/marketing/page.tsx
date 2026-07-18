'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  usedCount: number;
  usageLimit?: number;
  isActive: boolean;
  validUntil: string;
}

const mockCoupons: Coupon[] = [
  {
    id: '1',
    code: 'SUMMER50',
    name: 'Summer Super Sale',
    type: 'percentage',
    value: 50,
    usedCount: 120,
    usageLimit: 500,
    isActive: true,
    validUntil: '2026-08-31'
  },
  {
    id: '2',
    code: 'FREESHIP',
    name: 'Free Delivery Offer',
    type: 'free_shipping',
    value: 0,
    usedCount: 450,
    isActive: true,
    validUntil: '2026-12-31'
  },
  {
    id: '3',
    code: 'RAW200',
    name: 'Flat Discount',
    type: 'fixed_amount',
    value: 200,
    usedCount: 85,
    usageLimit: 200,
    isActive: false,
    validUntil: '2026-06-30'
  }
];

export default function AdminMarketingPage() {
  const [activeTab, setActiveTab] = useState<'coupons' | 'campaigns' | 'seo'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    type: 'percentage' as 'percentage' | 'fixed_amount' | 'free_shipping',
    value: 0,
    usageLimit: undefined as number | undefined,
    validUntil: ''
  });
  const toast = useToast();
  
  // Fetch real coupon data from backend
  useEffect(() => {
    let active = true;
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        let response = await fetch(`${backendUrl}/coupons/admin`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          // Fallback to active public coupons list if unauthorized
          response = await fetch(`${backendUrl}/coupons`, {
            credentials: 'include'
          });
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        
        const data = await response.json();
        const mappedCoupons = (data.coupons || []).map((c: any) => ({
          ...c,
          type: c.type?.toLowerCase() || 'percentage',
          isActive: c.isActive ?? true,
          usedCount: c.usedCount ?? 0,
          usageLimit: c.usageLimit ?? undefined,
        }));
        if (active) {
          setCoupons(mappedCoupons);
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        if (active) {
          toast.error('Failed to load coupon data');
          setCoupons(mockCoupons);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    
    if (activeTab === 'coupons') {
      fetchCoupons();
    }
    return () => {
      active = false;
    };
  }, [activeTab]);

  const getCouponTypeColor = (type: string) => {
    const colors = {
      percentage: 'bg-blue-100 text-blue-800',
      fixed_amount: 'bg-green-100 text-green-800',
      free_shipping: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCoupon = () => {
    if (!newCoupon.code || !newCoupon.name || !newCoupon.validUntil) {
      toast.error('Please fill all required fields');
      return;
    }

    const coupon: Coupon = {
      id: Date.now().toString(),
      code: newCoupon.code.toUpperCase(),
      name: newCoupon.name,
      type: newCoupon.type,
      value: newCoupon.value,
      usedCount: 0,
      usageLimit: newCoupon.usageLimit,
      isActive: true,
      validUntil: newCoupon.validUntil
    };

    setCoupons([...coupons, coupon]);
    setShowCouponModal(false);
    setNewCoupon({
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      usageLimit: undefined,
      validUntil: ''
    });
    toast.success('Coupon created successfully!');
  };

  const handleCreateCampaign = () => {
    toast.success('Campaign created successfully!');
    setShowCampaignModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing & Promotions</h1>
            <p className="text-gray-600 mt-1">Manage coupons, email campaigns, and SEO</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'coupons', name: 'Coupons & Discounts', icon: TagIcon },
                { id: 'campaigns', name: 'Email Campaigns', icon: EnvelopeIcon },
                { id: 'seo', name: 'SEO Tools', icon: GlobeAltIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search coupons..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <button 
                    onClick={() => setShowCouponModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{coupon.name}</h3>
                        </div>
                        <div className={cn('w-3 h-3 rounded-full', coupon.isActive ? 'bg-green-500' : 'bg-red-500')} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Code:</span>
                          <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                            {coupon.code}
                          </code>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getCouponTypeColor(coupon.type))}>
                            {coupon.type === 'percentage' ? 'Percentage' :
                             coupon.type === 'fixed_amount' ? 'Fixed Amount' : 'Free Shipping'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Value:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {coupon.type === 'percentage' ? `${coupon.value}%` :
                             coupon.type === 'fixed_amount' ? `₹${coupon.value}` : 'Free'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Usage:</span>
                          <span className="text-sm text-gray-900">
                            {coupon.usedCount}/{coupon.usageLimit || '∞'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <button className={cn(
                          'px-3 py-1 text-xs font-medium rounded-full transition-colors',
                          coupon.isActive
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        )}>
                          {coupon.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div className="text-center py-12">
                <EnvelopeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Email Campaigns</h3>
                <p className="text-gray-600">Create and manage email marketing campaigns</p>
                <button 
                  onClick={() => setShowCampaignModal(true)}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  Create Campaign
                </button>
              </div>
            )}

            {/* SEO Tools Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Overview</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Pages Indexed:</span>
                        <span className="text-sm font-medium text-gray-900">1,245</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Page Speed:</span>
                        <span className="text-sm font-medium text-green-600">92/100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Mobile Friendly:</span>
                        <span className="text-sm font-medium text-green-600">Yes</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Keywords</h3>
                    <div className="space-y-3">
                      {[
                        { keyword: 'graphic t-shirts', position: 3 },
                        { keyword: 'denim jackets', position: 7 },
                        { keyword: 'casual wear', position: 12 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.keyword}</span>
                          <span className="text-xs text-gray-500">#{item.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Coupon</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                  placeholder="e.g., SUMMER20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Name *</label>
                <input
                  type="text"
                  value={newCoupon.name}
                  onChange={(e) => setNewCoupon({...newCoupon, name: e.target.value})}
                  placeholder="e.g., Summer Sale"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select
                  value={newCoupon.type}
                  onChange={(e) => setNewCoupon({...newCoupon, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              {newCoupon.type !== 'free_shipping' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value * {newCoupon.type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    value={newCoupon.value}
                    onChange={(e) => setNewCoupon({...newCoupon, value: Number(e.target.value)})}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={newCoupon.usageLimit || ''}
                  onChange={(e) => setNewCoupon({...newCoupon, usageLimit: e.target.value ? Number(e.target.value) : undefined})}
                  placeholder="Unlimited"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until *</label>
                <input
                  type="date"
                  value={newCoupon.validUntil}
                  onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCouponModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateCoupon}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Create Coupon
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Email Campaign</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g., Summer Sale 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g., Get 20% Off This Summer!"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>All Customers</option>
                  <option>VIP Customers</option>
                  <option>New Customers</option>
                  <option>Inactive Customers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Send Now</option>
                  <option>Schedule for Later</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  placeholder="Enter your email message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCampaignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Create Campaign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
