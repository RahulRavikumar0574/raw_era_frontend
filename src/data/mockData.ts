import { Product, Category, User } from '@/types';
import { additionalProducts } from './additionalProducts';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Men\'s Clothing',
    slug: 'mens',
    description: 'Trendy clothing for men',
    image: '/categories/mens.jpg',
    isActive: true,
    order: 1,
  },
  {
    id: '2',
    name: 'Women\'s Clothing',
    slug: 'womens',
    description: 'Stylish clothing for women',
    image: '/categories/womens.jpg',
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Kids Clothing',
    slug: 'kids',
    description: 'Comfortable clothing for kids',
    image: '/categories/kids.jpg',
    isActive: true,
    order: 3,
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Oversized T-Shirt',
    description: 'Premium quality oversized t-shirt made from 100% cotton. Perfect for casual wear with a comfortable fit.',
    shortDescription: 'Premium oversized cotton t-shirt',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    sku: 'TSH-001',
    category: mockCategories[0],
    brand: 'The Raw Era',
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        alt: 'Classic Oversized T-Shirt - Front View',
        isPrimary: true,
        order: 1,
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        alt: 'Classic Oversized T-Shirt - Back View',
        isPrimary: false,
        order: 2,
      },
    ],
    variants: [
      {
        id: 'v1',
        name: 'Size',
        type: 'size',
        value: 'S',
        stock: 10,
        sku: 'TSH-001-S',
      },
      {
        id: 'v2',
        name: 'Size',
        type: 'size',
        value: 'M',
        stock: 15,
        sku: 'TSH-001-M',
      },
      {
        id: 'v3',
        name: 'Size',
        type: 'size',
        value: 'L',
        stock: 20,
        sku: 'TSH-001-L',
      },
      {
        id: 'v4',
        name: 'Size',
        type: 'size',
        value: 'XL',
        stock: 12,
        sku: 'TSH-001-XL',
      },
      {
        id: 'v5',
        name: 'Color',
        type: 'color',
        value: 'Black',
        stock: 25,
        image: '/products/tshirt-1-black.jpg',
      },
      {
        id: 'v6',
        name: 'Color',
        type: 'color',
        value: 'White',
        stock: 20,
        image: '/products/tshirt-1-white.jpg',
      },
    ],
    specifications: [
      {
        id: 's1',
        name: 'Material',
        value: '100% Cotton',
        group: 'Fabric',
      },
      {
        id: 's2',
        name: 'Fit',
        value: 'Oversized',
        group: 'Style',
      },
      {
        id: 's3',
        name: 'Care Instructions',
        value: 'Machine wash cold',
        group: 'Care',
      },
    ],
    tags: ['oversized', 'cotton', 'casual', 'trending'],
    rating: 4.5,
    reviewCount: 128,
    stock: 57,
    isActive: true,
    isFeatured: true,
    isNew: false,
    seoTitle: 'Classic Oversized T-Shirt - Premium Cotton | The Raw Era',
    seoDescription: 'Shop the classic oversized t-shirt made from premium cotton. Comfortable fit, trendy design.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'Vintage Graphic Hoodie',
    description: 'Cozy hoodie with vintage-inspired graphics. Made from soft cotton blend for ultimate comfort.',
    shortDescription: 'Vintage graphic cotton blend hoodie',
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    sku: 'HOD-001',
    category: mockCategories[0],
    brand: 'The Raw Era',
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
        alt: 'Vintage Graphic Hoodie - Front View',
        isPrimary: true,
        order: 1,
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
        alt: 'Vintage Graphic Hoodie - Back View',
        isPrimary: false,
        order: 2,
      },
    ],
    variants: [
      {
        id: 'v7',
        name: 'Size',
        type: 'size',
        value: 'S',
        stock: 8,
        sku: 'HOD-001-S',
      },
      {
        id: 'v8',
        name: 'Size',
        type: 'size',
        value: 'M',
        stock: 12,
        sku: 'HOD-001-M',
      },
      {
        id: 'v9',
        name: 'Size',
        type: 'size',
        value: 'L',
        stock: 15,
        sku: 'HOD-001-L',
      },
      {
        id: 'v10',
        name: 'Size',
        type: 'size',
        value: 'XL',
        stock: 10,
        sku: 'HOD-001-XL',
      },
    ],
    specifications: [
      {
        id: 's4',
        name: 'Material',
        value: '80% Cotton, 20% Polyester',
        group: 'Fabric',
      },
      {
        id: 's5',
        name: 'Fit',
        value: 'Regular',
        group: 'Style',
      },
    ],
    tags: ['hoodie', 'vintage', 'graphic', 'winter'],
    rating: 4.7,
    reviewCount: 89,
    stock: 45,
    isActive: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T15:30:00Z',
  },
  {
    id: '3',
    name: 'Floral Print Dress',
    description: 'Beautiful floral print dress perfect for summer occasions. Lightweight and breathable fabric.',
    shortDescription: 'Lightweight floral print summer dress',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    sku: 'DRS-001',
    category: mockCategories[1],
    brand: 'The Raw Era',
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        alt: 'Floral Print Dress - Front View',
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: 'v11',
        name: 'Size',
        type: 'size',
        value: 'XS',
        stock: 5,
        sku: 'DRS-001-XS',
      },
      {
        id: 'v12',
        name: 'Size',
        type: 'size',
        value: 'S',
        stock: 10,
        sku: 'DRS-001-S',
      },
      {
        id: 'v13',
        name: 'Size',
        type: 'size',
        value: 'M',
        stock: 15,
        sku: 'DRS-001-M',
      },
      {
        id: 'v14',
        name: 'Size',
        type: 'size',
        value: 'L',
        stock: 8,
        sku: 'DRS-001-L',
      },
    ],
    specifications: [
      {
        id: 's6',
        name: 'Material',
        value: '100% Viscose',
        group: 'Fabric',
      },
      {
        id: 's7',
        name: 'Length',
        value: 'Midi',
        group: 'Style',
      },
    ],
    tags: ['dress', 'floral', 'summer', 'casual'],
    rating: 4.3,
    reviewCount: 67,
    stock: 38,
    isActive: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T15:30:00Z',
  },
  {
    id: '4',
    name: 'Kids Superhero T-Shirt',
    description: 'Fun superhero themed t-shirt for kids. Soft cotton material that\'s gentle on sensitive skin.',
    shortDescription: 'Soft cotton superhero t-shirt for kids',
    price: 599,
    originalPrice: 799,
    discount: 25,
    sku: 'KTS-001',
    category: mockCategories[2],
    brand: 'The Raw Era',
    images: [
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
        alt: 'Kids Superhero T-Shirt - Front View',
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: 'v15',
        name: 'Size',
        type: 'size',
        value: '2-3Y',
        stock: 12,
        sku: 'KTS-001-2-3Y',
      },
      {
        id: 'v16',
        name: 'Size',
        type: 'size',
        value: '4-5Y',
        stock: 15,
        sku: 'KTS-001-4-5Y',
      },
      {
        id: 'v17',
        name: 'Size',
        type: 'size',
        value: '6-7Y',
        stock: 18,
        sku: 'KTS-001-6-7Y',
      },
    ],
    specifications: [
      {
        id: 's8',
        name: 'Material',
        value: '100% Cotton',
        group: 'Fabric',
      },
      {
        id: 's9',
        name: 'Print Type',
        value: 'Screen Print',
        group: 'Design',
      },
    ],
    tags: ['kids', 'superhero', 'cotton', 'fun'],
    rating: 4.6,
    reviewCount: 45,
    stock: 45,
    isActive: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-30T15:30:00Z',
  },
  {
    id: '5',
    name: 'Premium Denim Jacket',
    description: 'Classic denim jacket with modern fit. Perfect layering piece for any season.',
    shortDescription: 'Classic modern fit denim jacket',
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    sku: 'JKT-001',
    category: mockCategories[0],
    brand: 'The Raw Era',
    images: [
      {
        id: '7',
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
        alt: 'Premium Denim Jacket - Front View',
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: 'v18',
        name: 'Size',
        type: 'size',
        value: 'S',
        stock: 6,
        sku: 'JKT-001-S',
      },
      {
        id: 'v19',
        name: 'Size',
        type: 'size',
        value: 'M',
        stock: 8,
        sku: 'JKT-001-M',
      },
      {
        id: 'v20',
        name: 'Size',
        type: 'size',
        value: 'L',
        stock: 10,
        sku: 'JKT-001-L',
      },
    ],
    specifications: [
      {
        id: 's10',
        name: 'Material',
        value: '100% Cotton Denim',
        group: 'Fabric',
      },
      {
        id: 's11',
        name: 'Weight',
        value: '12oz',
        group: 'Fabric',
      },
    ],
    tags: ['denim', 'jacket', 'premium', 'layering'],
    rating: 4.8,
    reviewCount: 156,
    stock: 24,
    isActive: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
  },
  ...additionalProducts,
];

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+91 9876543210',
  avatar: '/avatars/john-doe.jpg',
  addresses: [
    {
      id: '1',
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main Street',
      address2: 'Apartment 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
      phone: '+91 9876543210',
      isDefault: true,
    },
  ],
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-30T15:30:00Z',
};

// Helper functions for filtering and sorting
export const filterProducts = (products: Product[], filters: any) => {
  let filtered = [...products];

  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  if (filters.category) {
    filtered = filtered.filter(product => product.category.slug === filters.category);
  }

  if (filters.brand && filters.brand.length > 0) {
    filtered = filtered.filter(product => filters.brand.includes(product.brand));
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  if (filters.rating) {
    filtered = filtered.filter(product => product.rating >= filters.rating);
  }

  if (filters.inStock) {
    filtered = filtered.filter(product => product.stock > 0);
  }

  if (filters.isNew) {
    filtered = filtered.filter(product => product.isNew);
  }

  if (filters.isFeatured) {
    filtered = filtered.filter(product => product.isFeatured);
  }

  return filtered;
};

export const sortProducts = (products: Product[], sortBy: string) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low-high':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popularity':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};