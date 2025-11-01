import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cart, CartItem, User, Wishlist, WishlistItem, Product, SearchFilters, ThemeConfig, Notification } from '@/types';
import { mockProducts } from '@/data/mockData';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Cart Store
interface CartState {
  cart: Cart;
  isLoading: boolean;
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  addToCart: (product: Product, variantId?: string, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (couponCode: string) => void;
  removeCoupon: () => void;
  calculateTotals: () => void;
  setLoading: (loading: boolean) => void;
}

const initialCart: Cart = {
  id: '',
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  updatedAt: new Date().toISOString(),
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialCart,
      isLoading: false,
      addItem: async (product, variantId, quantity = 1) => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
        try {
          const response = await fetch(`${backendUrl}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ productId: product.id, variantId, quantity }),
          });
          
          if (!response.ok) {
            if (response.status === 401) {
              // User not authenticated, redirect to login
              window.location.href = '/auth/login';
              return;
            }
            throw new Error(`Failed to add item: ${response.statusText}`);
          }
          
          // Refresh cart from backend
          const res = await fetch(`${backendUrl}/cart`, { credentials: 'include' });
          if (!res.ok) {
            throw new Error(`Failed to fetch cart: ${res.statusText}`);
          }
          
          const data = await res.json();
          const items = (data.items || []).map((i: any): CartItem => ({
            id: i.id,
            productId: i.productId,
            product: i.product,
            variantId: i.variantId,
            variant: i.variantId ? product.variants?.find(v => v.id === i.variantId) : undefined,
            quantity: i.quantity,
            price: i.product?.price,
            addedAt: i.createdAt,
          }));
          set({ cart: { ...get().cart, items, updatedAt: new Date().toISOString() } });
          get().calculateTotals();
        } catch (error) {
          console.error('Error adding item to cart:', error);
          // You might want to show a toast error here
        }
      },
      addToCart: (product, variantId, quantity = 1) => {
        // Alias for addItem for consistency
        get().addItem(product, variantId, quantity);
      },
      removeItem: async (itemId) => {
        const { cart } = get();
        const target = cart.items.find(i => i.id === itemId);
        if (!target) return;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4001';
        await fetch(`${backendUrl}/cart`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId: target.productId, variantId: target.variantId }),
        });
        const res = await fetch(`${backendUrl}/cart`, { credentials: 'include' });
        const data = await res.json();
        const items = (data.items || []).map((i: any): CartItem => ({
          id: i.id,
          productId: i.productId,
          product: i.product,
          variantId: i.variantId,
          variant: undefined,
          quantity: i.quantity,
          price: i.product?.price,
          addedAt: i.createdAt,
        }));
        set({ cart: { ...get().cart, items, updatedAt: new Date().toISOString() } });
        get().calculateTotals();
      },
      updateQuantity: async (itemId, quantity) => {
        const { cart } = get();
        const target = cart.items.find(i => i.id === itemId);
        if (!target) return;
        if (quantity <= 0) return get().removeItem(itemId);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        await fetch(`${backendUrl}/cart`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ productId: target.productId, variantId: target.variantId, quantity }),
        });
        const res = await fetch(`${backendUrl}/cart`, { credentials: 'include' });
        const data = await res.json();
        const items = (data.items || []).map((i: any): CartItem => ({
          id: i.id,
          productId: i.productId,
          product: i.product,
          variantId: i.variantId,
          variant: undefined,
          quantity: i.quantity,
          price: i.product?.price,
          addedAt: i.createdAt,
        }));
        set({ cart: { ...get().cart, items, updatedAt: new Date().toISOString() } });
        get().calculateTotals();
      },
      clearCart: async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        await fetch(`${backendUrl}/cart/clear`, { method: 'DELETE', credentials: 'include' });
        set({ cart: { ...initialCart, updatedAt: new Date().toISOString() } });
      },
      applyCoupon: (couponCode) => {
        const { cart } = get();
        // This would typically make an API call to validate the coupon
        // For now, we'll just set it
        set({
          cart: {
            ...cart,
            couponCode,
            updatedAt: new Date().toISOString(),
          }
        });
        get().calculateTotals();
      },
      removeCoupon: () => {
        const { cart } = get();
        set({
          cart: {
            ...cart,
            couponCode: undefined,
            discount: 0,
            updatedAt: new Date().toISOString(),
          }
        });
        get().calculateTotals();
      },
      calculateTotals: () => {
        const { cart } = get();
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.18; // 18% GST
        const shipping = subtotal > 500 ? 0 : 50; // Free shipping above ₹500
        let discount = 0;

        // Apply coupon discount (simplified logic)
        if (cart.couponCode) {
          discount = subtotal * 0.1; // 10% discount
        }

        const total = subtotal + tax + shipping - discount;

        set({
          cart: {
            ...cart,
            subtotal,
            tax,
            shipping,
            discount,
            total,
            updatedAt: new Date().toISOString(),
          }
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Wishlist Store
interface WishlistState {
  wishlist: Wishlist;
  isLoading: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  setLoading: (loading: boolean) => void;
}

const initialWishlist: Wishlist = {
  id: '',
  items: [],
  updatedAt: new Date().toISOString(),
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: initialWishlist,
      isLoading: false,
      addItem: async (product) => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        await fetch(`${backendUrl}/wishlist/${product.id}`, { method: 'POST', credentials: 'include' });
        const res = await fetch(`${backendUrl}/wishlist`, { credentials: 'include' });
        const data = await res.json();
        const items = (data.items || []).map((i: any): WishlistItem => ({
          id: i.id,
          productId: i.productId,
          product: i.product,
          addedAt: i.addedAt,
        }));
        set({ wishlist: { ...get().wishlist, items, updatedAt: new Date().toISOString() } });
      },
      removeItem: async (productId) => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        await fetch(`${backendUrl}/wishlist/${productId}`, { method: 'DELETE', credentials: 'include' });
        const res = await fetch(`${backendUrl}/wishlist`, { credentials: 'include' });
        const data = await res.json();
        const items = (data.items || []).map((i: any): WishlistItem => ({
          id: i.id,
          productId: i.productId,
          product: i.product,
          addedAt: i.addedAt,
        }));
        set({ wishlist: { ...get().wishlist, items, updatedAt: new Date().toISOString() } });
      },
      clearWishlist: () => {
        set({ wishlist: { ...initialWishlist, updatedAt: new Date().toISOString() } });
      },
      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.items.some(item => item.productId === productId);
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Search Store
interface SearchState {
  filters: SearchFilters;
  recentSearches: string[];
  isLoading: boolean;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      filters: {},
      recentSearches: [],
      isLoading: false,
      updateFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },
      clearFilters: () => set({ filters: {} }),
      addRecentSearch: (query) => {
        const { recentSearches } = get();
        const filtered = recentSearches.filter(search => search !== query);
        const updated = [query, ...filtered].slice(0, 10); // Keep only 10 recent searches
        set({ recentSearches: updated });
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);

// Theme Store
interface ThemeState {
  theme: ThemeConfig;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
}

const initialTheme: ThemeConfig = {
  mode: 'light',
  primaryColor: '#dc2626', // red-600
  secondaryColor: '#374151', // gray-700
  accentColor: '#3b82f6', // blue-500
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      updateTheme: (themeUpdates) => {
        const { theme } = get();
        set({ theme: { ...theme, ...themeUpdates } });
      },
      toggleMode: () => {
        const { theme } = get();
        set({ theme: { ...theme, mode: theme.mode === 'light' ? 'dark' : 'light' } });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Notification Store
interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50) // Keep only 50 notifications
    }));
  },
  markAsRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    }));
  },
  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }));
  },
  clearAll: () => set({ notifications: [] }),
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter(notification => !notification.isRead).length;
  },
}));

// Product Store
interface ProductState {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  getProduct: (productId: string) => Product | undefined;
  setLoading: (loading: boolean) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: mockProducts, // Initialize with mock products
      isLoading: false,
      addProduct: (product) => {
        set(state => {
          // Check if product with this ID already exists
          const exists = state.products.some(p => p.id === product.id);
          if (exists) {
            return state; // Don't add duplicate products
          }
          return { products: [product, ...state.products] };
        });
      },
      updateProduct: (productId, updates) => {
        set(state => ({
          products: state.products.map(product => 
            product.id === productId ? { ...product, ...updates } : product
          )
        }));
      },
      removeProduct: (productId) => {
        set(state => ({
          products: state.products.filter(product => product.id !== productId)
        }));
      },
      getProduct: (productId) => {
        return get().products.find(product => product.id === productId);
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Comparison Store
interface ComparisonState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product) => {
        const { products } = get();
        if (products.length >= 4) {
          // Remove the first product if we have 4 already
          const newProducts = [product, ...products.slice(0, 3)];
          set({ products: newProducts });
        } else if (!products.find(p => p.id === product.id)) {
          set({ products: [product, ...products] });
        }
      },
      removeProduct: (productId) => {
        set(state => ({
          products: state.products.filter(product => product.id !== productId)
        }));
      },
      clearComparison: () => set({ products: [] }),
      isInComparison: (productId) => {
        const { products } = get();
        return products.some(product => product.id === productId);
      },
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);