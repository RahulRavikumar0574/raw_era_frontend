'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface KPI {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
  description?: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

interface OrderStatus {
  status: string;
  count: number;
  color: string;
  icon: any;
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const kpis: KPI[] = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: 12.5,
      changeType: 'increase',
      icon: CurrencyDollarIcon,
      color: 'green',
      description: 'vs last period'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: '1,247',
      change: 8.2,
      changeType: 'increase',
      icon: ShoppingBagIcon,
      color: 'blue',
      description: 'vs last period'
    },
    {
      id: 'customers',
      title: 'New Customers',
      value: '89',
      change: -3.1,
      changeType: 'decrease',
      icon: UsersIcon,
      color: 'purple',
      description: 'vs last period'
    },
    {
      id: 'pageviews',
      title: 'Page Views',
      value: '12,456',
      change: 15.8,
      changeType: 'increase',
      icon: EyeIcon,
      color: 'orange',
      description: 'vs last period'
    }
  ];

  const salesData: ChartData[] = [
    { name: 'Mon', value: 2400, color: '#f97316' },
    { name: 'Tue', value: 1398, color: '#f97316' },
    { name: 'Wed', value: 9800, color: '#f97316' },
    { name: 'Thu', value: 3908, color: '#f97316' },
    { name: 'Fri', value: 4800, color: '#f97316' },
    { name: 'Sat', value: 3800, color: '#f97316' },
    { name: 'Sun', value: 4300, color: '#f97316' }
  ];

  const topProducts: TopProduct[] = [
    {
      id: '1',
      name: 'Oversized Graphic T-Shirt',
      sales: 156,
      revenue: 23400,
      image: '/products/tshirt-1.jpg'
    },
    {
      id: '2',
      name: 'Premium Denim Jacket',
      sales: 89,
      revenue: 22231,
      image: '/products/jacket-1.jpg'
    },
    {
      id: '3',
      name: 'Vintage Hoodie',
      sales: 67,
      revenue: 16750,
      image: '/products/hoodie-1.jpg'
    },
    {
      id: '4',
      name: 'Floral Print Dress',
      sales: 45,
      revenue: 13455,
      image: '/products/dress-1.jpg'
    }
  ];

  const orderStatuses: OrderStatus[] = [
    {
      status: 'Pending',
      count: 23,
      color: 'yellow',
      icon: ClockIcon
    },
    {
      status: 'Processing',
      count: 45,
      color: 'blue',
      icon: ChartBarIcon
    },
    {
      status: 'Shipped',
      count: 67,
      color: 'purple',
      icon: TruckIcon
    },
    {
      status: 'Delivered',
      count: 189,
      color: 'green',
      icon: CheckCircleIcon
    },
    {
      status: 'Cancelled',
      count: 8,
      color: 'red',
      icon: XCircleIcon
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    timeRange === range
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-3 rounded-lg',
                    kpi.color === 'green' && 'bg-green-100 text-green-600',
                    kpi.color === 'blue' && 'bg-blue-100 text-blue-600',
                    kpi.color === 'purple' && 'bg-purple-100 text-purple-600',
                    kpi.color === 'orange' && 'bg-orange-100 text-orange-600'
                  )}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                </div>
                <div className={cn(
                  'flex items-center space-x-1 text-sm font-medium',
                  kpi.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                )}>
                  {kpi.changeType === 'increase' ? (
                    <ArrowUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4" />
                  )}
                  <span>{Math.abs(kpi.change)}%</span>
                </div>
              </div>
              {kpi.description && (
                <p className="text-xs text-gray-500 mt-2">{kpi.description}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
              <div className="flex space-x-2">
                <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View Details
                </button>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="space-y-4">
              {salesData.map((data, index) => (
                <div key={data.name} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-600">{data.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.value / Math.max(...salesData.map(d => d.value))) * 100}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-orange-500 rounded-full"
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-right">₹{data.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Order Status Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>
            <div className="space-y-4">
              {orderStatuses.map((status, index) => (
                <motion.div
                  key={status.status}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      status.color === 'yellow' && 'bg-yellow-100 text-yellow-600',
                      status.color === 'blue' && 'bg-blue-100 text-blue-600',
                      status.color === 'purple' && 'bg-purple-100 text-purple-600',
                      status.color === 'green' && 'bg-green-100 text-green-600',
                      status.color === 'red' && 'bg-red-100 text-red-600'
                    )}>
                      <status.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{status.status}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{status.count}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All Products
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/200x200?text=${product.name.split(' ')[0]}`;
                    }}
                  />
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{product.name}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Sales:</span>
                    <span className="font-medium">{product.sales}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Revenue:</span>
                    <span className="font-medium">₹{product.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}