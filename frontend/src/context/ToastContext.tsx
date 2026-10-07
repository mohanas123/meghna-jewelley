import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '../types/index.ts';

export type ToastType = 'wishlist-add' | 'wishlist-remove' | 'price-drop' | 'success' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  thumbnailUrl?: string;
  oldPrice?: number;
  newPrice?: number;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  showWishlistAdd: (product: Product, onViewWishlist?: () => void) => void;
  showWishlistRemove: (product: Product) => void;
  showPriceDrop: (product: Product, oldPrice: number, newPrice: number, onViewProduct?: () => void) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const duration = toast.duration ?? (toast.type === 'price-drop' ? 6500 : 4500);

      const newToast: ToastItem = {
        ...toast,
        id,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // Keep maximum 4 concurrent toasts

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const showWishlistAdd = useCallback(
    (product: Product, onViewWishlist?: () => void) => {
      showToast({
        title: 'Saved to Heirloom Wishlist',
        message: `${product.name} has been added to your private collection.`,
        type: 'wishlist-add',
        thumbnailUrl: product.images[0],
        actionLabel: 'View Wishlist',
        onAction: onViewWishlist,
        duration: 4500,
      });
    },
    [showToast]
  );

  const showWishlistRemove = useCallback(
    (product: Product) => {
      showToast({
        title: 'Removed from Wishlist',
        message: `${product.name} was removed from your saved pieces.`,
        type: 'wishlist-remove',
        thumbnailUrl: product.images[0],
        duration: 3500,
      });
    },
    [showToast]
  );

  const showPriceDrop = useCallback(
    (product: Product, oldPrice: number, newPrice: number, onViewProduct?: () => void) => {
      const savings = oldPrice - newPrice;
      showToast({
        title: 'Heirloom Price Drop Alert',
        message: `${product.name} is now reduced to ${newPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })} (Save ₹${savings.toLocaleString('en-IN')})!`,
        type: 'price-drop',
        thumbnailUrl: product.images[0],
        oldPrice,
        newPrice,
        actionLabel: 'Inspect Piece',
        onAction: onViewProduct,
        duration: 7000,
      });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        showWishlistAdd,
        showWishlistRemove,
        showPriceDrop,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
