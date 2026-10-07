import type { Product, Category, Order, Review, User, Coupon, StoreSettings, PriceAlert } from '../types/index.ts';

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

// Authentication
export async function loginUser(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid email or password');
  }
  return res.json();
}

export async function registerUser(name: string, email: string, phone: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Registration failed');
  }
  return res.json();
}

export async function addSavedAddress(userId: string, address: Omit<User['savedAddresses'][0], 'id'>): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, address }),
  });
  if (!res.ok) throw new Error('Failed to save address');
  return res.json();
}

// Products
export async function fetchProducts(params?: { category?: string; search?: string; isAntique?: boolean; isTrending?: boolean }): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.append('category', params.category);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.isAntique !== undefined) searchParams.append('isAntique', String(params.isAntique));
  if (params?.isTrending !== undefined) searchParams.append('isTrending', String(params.isTrending));

  const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const res = await fetch(`${API_BASE}/products${query}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product details');
  return res.json();
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// Orders
export async function fetchOrders(userId?: string): Promise<Order[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${API_BASE}/orders${query}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to place order');
  }
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

// Coupons
export async function fetchCoupons(): Promise<Coupon[]> {
  const res = await fetch(`${API_BASE}/coupons`);
  if (!res.ok) throw new Error('Failed to fetch coupons');
  return res.json();
}

export async function validateCouponCode(code: string, subtotal: number): Promise<{ valid: boolean; discountPercent: number; message: string }> {
  const res = await fetch(`${API_BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal }),
  });
  if (!res.ok) throw new Error('Failed to validate coupon');
  return res.json();
}

export async function createCoupon(coupon: Omit<Coupon, 'id'>): Promise<Coupon> {
  const res = await fetch(`${API_BASE}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coupon),
  });
  if (!res.ok) throw new Error('Failed to create coupon');
  return res.json();
}

export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update coupon');
  return res.json();
}

export async function deleteCoupon(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/coupons/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete coupon');
}

// Reviews
export async function fetchReviews(productId?: string): Promise<Review[]> {
  const query = productId ? `?productId=${encodeURIComponent(productId)}` : '';
  const res = await fetch(`${API_BASE}/reviews${query}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function submitReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error('Failed to submit review');
  return res.json();
}

// Store Settings
export async function fetchSettings(): Promise<StoreSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

// Price Alerts
export async function fetchPriceAlerts(emailOrUserId?: string, productId?: string): Promise<PriceAlert[]> {
  const params = new URLSearchParams();
  if (emailOrUserId) params.set('email', emailOrUserId);
  if (productId) params.set('productId', productId);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/price-alerts${qs}`);
  if (!res.ok) throw new Error('Failed to fetch price alerts');
  return res.json();
}

export async function createPriceAlert(data: {
  productId: string;
  productName: string;
  productImage: string;
  currentPrice: number;
  targetPrice: number;
  email: string;
  userId?: string;
}): Promise<PriceAlert> {
  const res = await fetch(`${API_BASE}/price-alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to set price alert');
  }
  return res.json();
}

export async function deletePriceAlert(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/price-alerts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete price alert');
}
