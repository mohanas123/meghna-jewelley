import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '../types/index.ts';
import { useToast } from './ToastContext.tsx';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (product: Product, onViewWishlist?: () => void) => void;
  removeFromWishlist: (product: Product) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  checkPriceDrops: (currentProducts: Product[], onViewProduct?: (prod: Product) => void) => void;
  simulatePriceDrop: (product: Product, discountAmount?: number, onViewProduct?: (prod: Product) => void) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showWishlistAdd, showWishlistRemove, showPriceDrop } = useToast();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meghna_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track recorded prices for wishlist items: { [productId]: number }
  const [recordedPrices, setRecordedPrices] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('meghna_wishlist_prices');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('meghna_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('meghna_wishlist_prices', JSON.stringify(recordedPrices));
  }, [recordedPrices]);

  const toggleWishlist = useCallback(
    (product: Product, onViewWishlist?: () => void) => {
      setWishlistIds((prev) => {
        const isAlreadyIn = prev.includes(product.id);
        if (isAlreadyIn) {
          showWishlistRemove(product);
          return prev.filter((id) => id !== product.id);
        } else {
          // Record current price as baseline for future price drop alerts
          setRecordedPrices((prevPrices) => ({
            ...prevPrices,
            [product.id]: product.originalPrice || product.price,
          }));
          showWishlistAdd(product, onViewWishlist);
          return [...prev, product.id];
        }
      });
    },
    [showWishlistAdd, showWishlistRemove]
  );

  const removeFromWishlist = useCallback(
    (product: Product) => {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showWishlistRemove(product);
    },
    [showWishlistRemove]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  // Check for genuine price drops against recorded baseline
  const checkPriceDrops = useCallback(
    (currentProducts: Product[], onViewProduct?: (prod: Product) => void) => {
      currentProducts.forEach((product) => {
        if (wishlistIds.includes(product.id)) {
          const baseline = recordedPrices[product.id];
          if (baseline && product.price < baseline) {
            showPriceDrop(product, baseline, product.price, () => onViewProduct?.(product));
            // Update recorded price so alert is not repeated indefinitely
            setRecordedPrices((prev) => ({
              ...prev,
              [product.id]: product.price,
            }));
          }
        }
      });
    },
    [wishlistIds, recordedPrices, showPriceDrop]
  );

  // Simulation tool for testing price drop alert
  const simulatePriceDrop = useCallback(
    (product: Product, discountAmount = 15000, onViewProduct?: (prod: Product) => void) => {
      const oldPrice = product.price;
      const newPrice = Math.max(1000, oldPrice - discountAmount);

      // Ensure product is in wishlist
      setWishlistIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));
      setRecordedPrices((prev) => ({
        ...prev,
        [product.id]: newPrice,
      }));

      showPriceDrop(product, oldPrice, newPrice, () => onViewProduct?.(product));
    },
    [showPriceDrop]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount: wishlistIds.length,
        checkPriceDrops,
        simulatePriceDrop,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
