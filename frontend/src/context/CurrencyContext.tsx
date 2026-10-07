import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CurrencyCode, CurrencyConfig } from '../types/index.ts';

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.012 },
  AED: { code: 'AED', symbol: 'AED ', rate: 0.044 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0095 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.011 },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInInr: number) => string;
  availableCurrencies: CurrencyConfig[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');

  useEffect(() => {
    const saved = localStorage.getItem('meghna_currency') as CurrencyCode | null;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('meghna_currency', code);
  };

  const formatPrice = (amountInInr: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.INR;
    const converted = amountInInr * config.rate;

    if (currency === 'INR') {
      return `₹${Math.round(amountInInr).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        availableCurrencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
