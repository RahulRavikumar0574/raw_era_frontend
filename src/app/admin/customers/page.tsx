'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CalendarIcon,
  MapPinIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { type AdminCustomer, adminCustomers } from '@/data/adminMockData';
import { useAuthStore } from '@/store';

interface Customer extends AdminCustomer {
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  isActive: boolean;
  avatar?: string;
  dateJoined: string;
  lastLogin?: string;
  averageOrderValue: number;
  addresses: {
    id: string;
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  preferences: {
    emailMarketing: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
  };
  tags: string[];
}

// Convert AdminCustomer to Customer format
const convertToCustomer = (adminCustomer: AdminCustomer): Customer => {
  const nameParts = adminCustomer.name.split(' ');
  const tags: string[] = [];
  if (adminCustomer.totalOrders > 10) tags.push('VIP');
  if (adminCustomer.totalSpent > 20000) tags.push('High Spender');
  if (adminCustomer.status === 'active') tags.push('Active');
  
  return {
    ...adminCustomer,
    firstName: nameParts[0],
    lastName: nameParts.slice(1).join(' ') || nameParts[0],
    role: 'customer',
    isActive: adminCustomer.status === 'active',
    dateJoined: adminCustomer.joinedDate,
    lastLogin: adminCustomer.lastOrderDate,
    averageOrderValue: adminCustomer.totalOrders > 0 ? Math.round(adminCustomer.totalSpent / adminCustomer.totalOrders) : 0,
    addresses: adminCustomer.address ? [{
      id: '1',
      type: 'home' as const,
      address: '',
      city: adminCustomer.address.city,
      state: adminCustomer.address.state,
      postalCode: '',
      country: adminCustomer.address.country,
      isDefault: true
    }] : [],
    preferences: {
      emailMarketing: true,
      smsMarketing: false,
      pushNotifications: true
    },
    tags
  };
};

interface OldCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'manager' | 'staff';
  isActive: boolean;
  avatar?: string;
  dateJoined: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  addresses: {
    id: string;
    type: 'home' | 'work' | 'other';
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  preferences: {
    emailMarketing: boolean;
    smsMarketing: boolean;
    pushNotifications: boolean;
  };
  tags: string[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  // Fetch real customer data from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoadingData(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const response = await fetch(`${backendUrl}/users`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        
        const data = await response.json();
        const realCustomers = data.map(convertToCustomer);
        setCustomers(realCustomers);
        setFilteredCustomers(realCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customer data');
        const fallback = adminCustomers.map(convertToCustomer);
        setCustomers(fallback);
        setFilteredCustomers(fallback);
      } finally {
        setIsLoadingData(false);
      }
    };
    
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [searchQuery, selectedRole, selectedStatus]);

  const filterCustomers = () => {
    let filtered = [...customers];

    if (searchQuery) {
      filtered = filtered.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery)
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(customer => customer.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active';
      filtered = filtered.filter(customer => customer.isActive === isActive);
    }

    setFilteredCustomers(filtered);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      customer: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      staff: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const updateCustomerStatus = async (customerId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCustomers(prev => prev.map(customer =>
        customer.id === customerId
          ? { ...customer, isActive }
          : customer
      ));
      
      toast.success(`Customer ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update customer status');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const recipientCount = selectedCustomers.length || (selectedCustomer ? 1 : 0);
      toast.success(`Email sent to ${recipientCount} customer(s) successfully`);
      
      setShowEmailModal(false);
      setEmailSubject('');
      setEmailMessage('');
      setSelectedCustomers([]);
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const selectAllCustomers = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage customer profiles and communications</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {selectedCustomers.length > 0 && (
              <button
                onClick={() => setShowEmailModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <EnvelopeIcon className="w-4 h-4" />
                <span>Email Selected ({selectedCustomers.length})</span>
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors',
                showFilters
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              )}
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                onChange={selectAllCustomers}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600">
                {selectedCustomers.length > 0 ? `${selectedCustomers.length} selected` : 'Select all'}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Orders</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Total Spent</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Joined</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleCustomerSelection(customer.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={`${customer.firstName} ${customer.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                            {customer.phone && (
                              <div className="text-sm text-gray-500">{customer.phone}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getRoleColor(customer.role)
                      )}>
                        {customer.role.charAt(0).toUpperCase() + customer.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          customer.isActive ? 'bg-green-500' : 'bg-red-500'
                        )} />
                        <span className="text-sm text-gray-600">
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">₹{customer.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Avg: ₹{customer.averageOrderValue.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {new Date(customer.dateJoined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowCustomerModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setShowEmailModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateCustomerStatus(customer.id, !customer.isActive)}
                          disabled={isLoading}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title={customer.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No customers found</div>
              <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>

        {/* Customer Details Modal */}
        <AnimatePresence>
          {showCustomerModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Customer Profile - {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </h2>
                    <button
                      onClick={() => setShowCustomerModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">Total Orders</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 mt-1">{selectedCustomer.totalOrders}</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600">Total Spent</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900 mt-1">₹{selectedCustomer.totalSpent.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-purple-600">Avg Order Value</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900 mt-1">₹{selectedCustomer.averageOrderValue.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Member Since</span>
                      </div>
                      <div className="text-sm font-bold text-orange-900 mt-1">
                        {new Date(selectedCustomer.dateJoined).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        {selectedCustomer.phone && (
                          <div className="flex items-center space-x-3">
                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                            <span>{selectedCustomer.phone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            getRoleColor(selectedCustomer.role)
                          )}>
                            {selectedCustomer.role.charAt(0).toUpperCase() + selectedCustomer.role.slice(1)}
                          </span>
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            selectedCustomer.isActive ? 'bg-green-500' : 'bg-red-500'
                          )} />
                          <span className="text-sm text-gray-600">
                            {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {selectedCustomer.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {selectedCustomer.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h3>
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((address) => (
                        <div key={address.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">
                                    {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                                  </span>
                                  {address.isDefault && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mt-1">
                                  {address.address}<br />
                                  {address.city}, {address.state} {address.postalCode}<br />
                                  {address.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomer.preferences.emailMarketing}
                          readOnly
                          className="rounded border-gray-300 text-orange-600"
                        />
                        <span className="text-sm text-gray-700">Email Marketing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomer.preferences.smsMarketing}
                          readOnly
                          className="rounded border-gray-300 text-orange-600"
                        />
                        <span className="text-sm text-gray-700">SMS Marketing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCustomer.preferences.pushNotifications}
                          readOnly
                          className="rounded border-gray-300 text-orange-600"
                        />
                        <span className="text-sm text-gray-700">Push Notifications</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowEmailModal(true);
                      setShowCustomerModal(false);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Send Email
                  </button>
                  <button
                    onClick={() => updateCustomerStatus(selectedCustomer.id, !selectedCustomer.isActive)}
                    className={cn(
                      'px-4 py-2 rounded-lg transition-colors',
                      selectedCustomer.isActive
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    )}
                  >
                    {selectedCustomer.isActive ? 'Deactivate' : 'Activate'} Customer
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Email Modal */}
        <AnimatePresence>
          {showEmailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Send Email</h2>
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        setEmailSubject('');
                        setEmailMessage('');
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipients
                    </label>
                    <div className="text-sm text-gray-600">
                      {selectedCustomers.length > 0
                        ? `${selectedCustomers.length} selected customers`
                        : selectedCustomer
                        ? `${selectedCustomer.firstName} ${selectedCustomer.lastName} (${selectedCustomer.email})`
                        : 'No recipients selected'
                      }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter email subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your message"
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowEmailModal(false);
                      setEmailSubject('');
                      setEmailMessage('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmail}
                    disabled={isLoading || !emailSubject.trim() || !emailMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
