import { mockProducts } from './mockData';

// Admin Orders Data
export interface AdminOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    variant?: string;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export const adminOrders: AdminOrder[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 9876543210'
    },
    status: 'delivered',
    paymentStatus: 'completed',
    paymentMethod: 'Credit Card',
    items: [
      {
        id: '1',
        productName: mockProducts[0].name,
        quantity: 2,
        price: mockProducts[0].price,
        variant: 'Size: L, Color: Black'
      }
    ],
    subtotal: mockProducts[0].price * 2,
    tax: Math.round(mockProducts[0].price * 2 * 0.18),
    shipping: 0,
    discount: 100,
    total: Math.round(mockProducts[0].price * 2 * 1.18) - 100,
    shippingAddress: {
      name: 'Rajesh Kumar',
      address: '123 MG Road, Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    trackingNumber: 'TRK123456789',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-20T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 9876543211'
    },
    status: 'shipped',
    paymentStatus: 'completed',
    paymentMethod: 'UPI',
    items: [
      {
        id: '2',
        productName: mockProducts[1].name,
        quantity: 1,
        price: mockProducts[1].price,
        variant: 'Size: M'
      },
      {
        id: '3',
        productName: mockProducts[2].name,
        quantity: 1,
        price: mockProducts[2].price,
        variant: 'Size: L'
      }
    ],
    subtotal: mockProducts[1].price + mockProducts[2].price,
    tax: Math.round((mockProducts[1].price + mockProducts[2].price) * 0.18),
    shipping: 50,
    discount: 200,
    total: Math.round((mockProducts[1].price + mockProducts[2].price) * 1.18) + 50 - 200,
    shippingAddress: {
      name: 'Priya Sharma',
      address: '456 Park Street',
      city: 'Delhi',
      state: 'Delhi',
      postalCode: '110001',
      country: 'India'
    },
    trackingNumber: 'TRK987654321',
    createdAt: '2024-12-18T15:45:00Z',
    updatedAt: '2024-12-19T09:30:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: '3',
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 9876543212'
    },
    status: 'processing',
    paymentStatus: 'completed',
    paymentMethod: 'Net Banking',
    items: [
      {
        id: '4',
        productName: mockProducts[3].name,
        quantity: 1,
        price: mockProducts[3].price,
        variant: 'Size: 32'
      }
    ],
    subtotal: mockProducts[3].price,
    tax: Math.round(mockProducts[3].price * 0.18),
    shipping: 0,
    discount: 0,
    total: Math.round(mockProducts[3].price * 1.18),
    shippingAddress: {
      name: 'Amit Patel',
      address: '789 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India'
    },
    createdAt: '2024-12-19T11:20:00Z',
    updatedAt: '2024-12-19T11:20:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      id: '4',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 9876543213'
    },
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        id: '5',
        productName: mockProducts[4].name,
        quantity: 2,
        price: mockProducts[4].price,
        variant: 'Size: M'
      }
    ],
    subtotal: mockProducts[4].price * 2,
    tax: Math.round(mockProducts[4].price * 2 * 0.18),
    shipping: 50,
    discount: 150,
    total: Math.round(mockProducts[4].price * 2 * 1.18) + 50 - 150,
    shippingAddress: {
      name: 'Sneha Reddy',
      address: '321 Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India'
    },
    createdAt: '2024-12-20T08:15:00Z',
    updatedAt: '2024-12-20T08:15:00Z'
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      id: '5',
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 9876543214'
    },
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'Credit Card',
    items: [
      {
        id: '6',
        productName: mockProducts[5].name,
        quantity: 1,
        price: mockProducts[5].price,
        variant: 'Size: L'
      }
    ],
    subtotal: mockProducts[5].price,
    tax: Math.round(mockProducts[5].price * 0.18),
    shipping: 0,
    discount: 500,
    total: Math.round(mockProducts[5].price * 1.18) - 500,
    shippingAddress: {
      name: 'Vikram Singh',
      address: '654 Sector 17',
      city: 'Chandigarh',
      state: 'Chandigarh',
      postalCode: '160017',
      country: 'India'
    },
    createdAt: '2024-12-17T14:30:00Z',
    updatedAt: '2024-12-18T10:00:00Z'
  }
];

// Admin Customers Data
export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  joinedDate: string;
  lastOrderDate?: string;
  address?: {
    city: string;
    state: string;
    country: string;
  };
}

export const adminCustomers: AdminCustomer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+91 9876543210',
    totalOrders: 12,
    totalSpent: 24580,
    status: 'active',
    joinedDate: '2024-06-15T00:00:00Z',
    lastOrderDate: '2024-12-20T00:00:00Z',
    address: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    }
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 9876543211',
    totalOrders: 8,
    totalSpent: 18750,
    status: 'active',
    joinedDate: '2024-07-22T00:00:00Z',
    lastOrderDate: '2024-12-19T00:00:00Z',
    address: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    }
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '+91 9876543212',
    totalOrders: 5,
    totalSpent: 12340,
    status: 'active',
    joinedDate: '2024-08-10T00:00:00Z',
    lastOrderDate: '2024-12-19T00:00:00Z',
    address: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    }
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 9876543213',
    totalOrders: 3,
    totalSpent: 8900,
    status: 'active',
    joinedDate: '2024-09-05T00:00:00Z',
    lastOrderDate: '2024-12-20T00:00:00Z',
    address: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    }
  },
  {
    id: '5',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    phone: '+91 9876543214',
    totalOrders: 1,
    totalSpent: 4500,
    status: 'inactive',
    joinedDate: '2024-10-12T00:00:00Z',
    lastOrderDate: '2024-12-17T00:00:00Z',
    address: {
      city: 'Chandigarh',
      state: 'Chandigarh',
      country: 'India'
    }
  },
  {
    id: '6',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@example.com',
    phone: '+91 9876543215',
    totalOrders: 15,
    totalSpent: 32100,
    status: 'active',
    joinedDate: '2024-05-20T00:00:00Z',
    lastOrderDate: '2024-12-18T00:00:00Z',
    address: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India'
    }
  }
];

// Dashboard Analytics Data
export const dashboardStats = {
  totalRevenue: 125000,
  totalOrders: 342,
  totalCustomers: 156,
  averageOrderValue: 3654,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  conversionRate: 3.2
};

export const recentOrders = adminOrders.slice(0, 5);
export const topCustomers = adminCustomers.slice(0, 5).sort((a, b) => b.totalSpent - a.totalSpent);
