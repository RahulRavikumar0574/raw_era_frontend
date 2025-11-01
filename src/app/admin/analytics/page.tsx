'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';

// Initial empty state for KPIs
const initialKpis = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '₹12,45,680',
    change: 8.2,
    changeType: 'increase',
    icon: CurrencyRupeeIcon,
    color: 'green',
    description: 'vs last month'
  },
  {
    id: 'orders',
    title: 'Total Orders',
    value: '4,320',
    change: -2.1,
    changeType: 'decrease',
    icon: ShoppingBagIcon,
    color: 'red',
    description: 'vs last month'
  },
  {
    id: 'customers',
    title: 'New Customers',
    value: '1,120',
    change: 12.3,
    changeType: 'increase',
    icon: UserGroupIcon,
    color: 'green',
    description: 'vs last month'
  },
  {
    id: 'reviews',
    title: 'Product Reviews',
    value: '890',
    change: 5.7,
    changeType: 'increase',
    icon: StarIcon,
    color: 'green',
    description: 'vs last month'
  }
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [kpis, setKpis] = useState(initialKpis);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
        const response = await fetch(`${backendUrl}/analytics?timeRange=${timeRange}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const data = await response.json();
        setKpis(data.kpis || initialKpis);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [timeRange, toast]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Track store performance and trends</p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="365d">Last year</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start shadow hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 bg-${kpi.color}-100`}>
                  <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="text-sm text-gray-600 mb-2">{kpi.title}</div>
                <div className="flex items-center space-x-2">
                  {kpi.changeType === 'increase' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className={kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                  <span className="text-xs text-gray-400">{kpi.description}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Placeholder for charts and analytics */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-lg">
          <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <div className="mb-2">Sales, traffic, and conversion charts coming soon!</div>
          <div className="text-sm">Integrate with backend for real data.</div>
        </div>
      </div>
    </div>
  );
}
