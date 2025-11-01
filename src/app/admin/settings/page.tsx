'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  ReceiptPercentIcon,
  GlobeAltIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const tabs = [
  { id: 'general', name: 'General', icon: GlobeAltIcon },
  { id: 'payment', name: 'Payment', icon: CurrencyRupeeIcon },
  { id: 'shipping', name: 'Shipping', icon: TruckIcon },
  { id: 'tax', name: 'Tax', icon: ReceiptPercentIcon },
  { id: 'account', name: 'Account', icon: UserCircleIcon }
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your store settings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-8 px-6 pt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? 'flex items-center space-x-2 py-2 border-b-2 border-orange-500 text-orange-600 font-medium'
                    : 'flex items-center space-x-2 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700'
                }
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
          <div className="p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Store Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="SouledStore" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="support@souledstore.com" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'payment' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Razorpay</option>
                      <option>Stripe</option>
                      <option>PayPal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="XXXX-XXXX-XXXX" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Shipping Provider</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                      <option>Delhivery</option>
                      <option>Blue Dart</option>
                      <option>DTDC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flat Shipping Rate (₹)</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="50" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tax' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Tax Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="27AAECS1234F1Z5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="18" />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'account' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                    <input className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Admin User" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                    <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="New Password" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
