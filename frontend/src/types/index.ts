export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  savedAddresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    isDefault: boolean;
  }>;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number; // Current selling price (offer price if on sale) in INR
  originalPrice?: number; // Regular/Original MRP
  offerBadge?: string; // e.g. "Festive Offer: 12% Off"
  isDealOfTheDay?: boolean;
  weight: string; // e.g. "42.8g"
  purity: string; // e.g. "22K Antique Gold"
  gemstones: string; // e.g. "Uncut Polki & Zambian Emeralds"
  craftsmanship: string;
  dimensions?: string;
  inStock: boolean;
  stockCount: number;
  isAntique: boolean;
  isTrending: boolean;
  isFeatured: boolean;
  images: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  sku: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod: 'COD' | 'UPI' | 'CARD' | 'NETBANKING';
  status: 'Received' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  freeShippingThreshold: number;
  hallmarkId: string;
  announcementText: string;
  offerBannerActive: boolean;
  activeOfferTitle: string;
  activeOfferDiscount: number;
}

export type CurrencyCode = 'INR' | 'USD' | 'AED' | 'GBP' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  email: string;
  userId?: string;
  createdAt: string;
  status: 'active' | 'triggered' | 'cancelled';
}
