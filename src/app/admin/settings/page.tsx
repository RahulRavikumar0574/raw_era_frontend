'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  TruckIcon,
  ReceiptPercentIcon,
  GlobeAltIcon,
  UserCircleIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/useToast';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const tabs = [
  { id: 'homepage', name: 'Homepage Banner', icon: PhotoIcon },
  { id: 'general', name: 'General', icon: GlobeAltIcon },
  { id: 'payment', name: 'Payment', icon: CurrencyRupeeIcon },
  { id: 'shipping', name: 'Shipping', icon: TruckIcon },
  { id: 'tax', name: 'Tax', icon: ReceiptPercentIcon },
  { id: 'account', name: 'Account', icon: UserCircleIcon },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('homepage');
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [heroImage, setHeroImage] = useState<string>('/IMG_4997.PNG');
  const [inputUrl, setInputUrl] = useState<string>('/IMG_4997.PNG');
  const [isSavingHero, setIsSavingHero] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Load current homepage setting
  useEffect(() => {
    fetch(`${backendUrl}/settings/public`)
      .then(r => r.json())
      .then(data => {
        if (data?.settings?.['homepage.hero_image']) {
          const url = data.settings['homepage.hero_image'];
          setHeroImage(url);
          setInputUrl(url);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please select an image file (PNG, JPG, WEBP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', 'Image size should be under 10MB');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setInputUrl(dataUrl);
      setHeroImage(dataUrl);
      setIsUploading(false);
      toast.success('Image loaded', 'Click "Save Homepage Banner" to apply your changes.');
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Read error', 'Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveHeroImage = async () => {
    if (!inputUrl.trim()) {
      toast.error('Empty Image', 'Please provide an image URL or upload a file.');
      return;
    }

    setIsSavingHero(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${backendUrl}/settings/homepage.hero_image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token || '',
        },
        body: JSON.stringify({ value: inputUrl.trim() }),
      });

      if (!res.ok) {
        throw new Error('Failed to update setting');
      }

      setHeroImage(inputUrl.trim());
      toast.success('Homepage Banner Updated!', 'The new hero image is now live on the homepage.');
    } catch (err: any) {
      toast.error('Failed to save', err?.message || 'Please check admin login.');
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleResetDefault = () => {
    const defaultUrl = '/IMG_4997.PNG';
    setInputUrl(defaultUrl);
    setHeroImage(defaultUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure homepage appearance and store settings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <nav className="flex space-x-4 sm:space-x-8 px-6 pt-4 border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? 'flex items-center space-x-2 py-3 border-b-2 border-orange-500 text-orange-600 font-medium whitespace-nowrap text-sm'
                    : 'flex items-center space-x-2 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 whitespace-nowrap text-sm'
                }
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
          <div className="p-6">
            {activeTab === 'homepage' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Homepage Hero Banner</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload or paste an image URL to customize the main header banner on the homepage. Changes take effect immediately.
                  </p>
                </div>

                {/* Live Preview Box */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Live Preview</label>
                  <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-black max-h-[400px] flex items-center justify-center group shadow-inner">
                    <img
                      src={inputUrl || heroImage}
                      alt="Homepage Banner Preview"
                      className="w-full h-auto max-h-[400px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/IMG_4997.PNG';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      Hero Banner
                    </div>
                  </div>
                </div>

                {/* Upload & Link Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
                  {/* File Upload Box */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Option 1: Upload Image File</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                      className="border-2 border-dashed border-orange-300 hover:border-orange-500 bg-white hover:bg-orange-50/50 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
                    >
                      <ArrowUpTrayIcon className="w-8 h-8 text-orange-500" />
                      <p className="text-sm font-medium text-gray-800">
                        Click to upload or drag & drop image
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP, GIF up to 10MB</p>
                    </div>
                  </div>

                  {/* Direct URL Box */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option 2: Direct Image URL</label>
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1.5">
                        Paste any hosted image URL (Cloudinary, Imgbb, CDN, etc.).
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetDefault}
                      className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-600 font-medium transition-colors w-fit"
                    >
                      <ArrowPathIcon className="w-3.5 h-3.5" /> Reset to Original Default Banner
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveHeroImage}
                    disabled={isSavingHero || isUploading}
                    className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {isSavingHero ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Banner...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        Save Homepage Banner
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

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
