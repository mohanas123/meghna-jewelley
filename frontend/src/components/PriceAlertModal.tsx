import React, { useState, useEffect } from 'react';
import {
  X, Bell, TrendingDown, Check, ShieldCheck, Mail, AlertCircle,
  Tag, ArrowRight, Trash2, Sparkles, Clock
} from 'lucide-react';
import type { Product, PriceAlert } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { createPriceAlert, fetchPriceAlerts, deletePriceAlert } from '../services/api.ts';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAlertSet?: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  product,
  onAlertSet,
}) => {
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [selectedPercentage, setSelectedPercentage] = useState<number>(10);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [customPriceInput, setCustomPriceInput] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [notifyOnWhatsApp, setNotifyOnWhatsApp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active alert tracking for this product
  const [existingAlert, setExistingAlert] = useState<PriceAlert | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  // Initialize email & calculated target price
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      const savedEmail = localStorage.getItem('meghna_patron_email');
      if (savedEmail) setEmail(savedEmail);
    }
  }, [user]);

  useEffect(() => {
    if (!product) return;
    const calc = Math.round(product.price * (1 - selectedPercentage / 100));
    setTargetPrice(calc);
    setCustomPriceInput(calc.toString());
  }, [product, selectedPercentage]);

  // Check if this user already has an alert for this product
  useEffect(() => {
    if (!isOpen || !product) return;
    const emailToCheck = user?.email || email || localStorage.getItem('meghna_patron_email');
    if (!emailToCheck) return;

    setIsLoadingExisting(true);
    fetchPriceAlerts(emailToCheck, product.id)
      .then((alerts) => {
        const found = alerts.find((a) => a.productId === product.id && a.status === 'active');
        if (found) {
          setExistingAlert(found);
          setTargetPrice(found.targetPrice);
          setCustomPriceInput(found.targetPrice.toString());
          setIsCustom(true);
        } else {
          setExistingAlert(null);
        }
      })
      .catch((err) => console.warn('Could not load existing alert:', err))
      .finally(() => setIsLoadingExisting(false));
  }, [isOpen, product, email, user]);

  if (!isOpen || !product) return null;

  const currentPrice = product.price;

  const handleSelectPreset = (percent: number) => {
    setIsCustom(false);
    setSelectedPercentage(percent);
    const calculated = Math.round(currentPrice * (1 - percent / 100));
    setTargetPrice(calculated);
    setCustomPriceInput(calculated.toString());
    setError(null);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustom(true);
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomPriceInput(val);
    const num = Number(val);
    setTargetPrice(num);

    if (num >= currentPrice) {
      setError(`Target price must be lower than the current price (${formatPrice(currentPrice)})`);
    } else if (num < 1000) {
      setError('Please specify a reasonable target price.');
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailToUse = email.trim();
    if (!emailToUse || !emailToUse.includes('@')) {
      setError('Please provide a valid email address to receive price drop notifications.');
      return;
    }

    if (targetPrice >= currentPrice) {
      setError(`Target price must be lower than current price (${formatPrice(currentPrice)}).`);
      return;
    }

    setIsSubmitting(true);
    try {
      localStorage.setItem('meghna_patron_email', emailToUse);
      const savedAlert = await createPriceAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        currentPrice: product.price,
        targetPrice,
        email: emailToUse,
        userId: user?.id,
      });

      setExistingAlert(savedAlert);
      onAlertSet?.(savedAlert);

      const savings = currentPrice - targetPrice;
      showToast({
        title: 'Price Alert Confirmed',
        message: `We will email ${emailToUse} the instant ${product.name} reaches ${formatPrice(targetPrice)} (saving you ${formatPrice(savings)})!`,
        type: 'success',
        thumbnailUrl: product.images[0],
        duration: 5500,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register price alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAlert = async () => {
    if (!existingAlert) return;
    setIsSubmitting(true);
    try {
      await deletePriceAlert(existingAlert.id);
      setExistingAlert(null);
      showToast({
        title: 'Price Alert Removed',
        message: `Alert for ${product.name} has been cancelled.`,
        type: 'info',
        duration: 3500,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to remove price alert.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatedSavings = Math.max(0, currentPrice - targetPrice);
  const calculatedSavingsPercent = Math.round((calculatedSavings / currentPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-full border border-[#E0D8CB] flex items-center justify-center text-[#98702B] shadow-2xs">
              <Bell className="w-5 h-5 fill-[#98702B]/20 text-[#98702B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium text-[#1E1B18]">
                  Set Heirloom Price Alert
                </h3>
                {existingAlert && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#EAF5EC] text-[#256B3E] px-2 py-0.5 rounded border border-[#C5E8CF]">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#7A6E5E] mt-0.5">
                Receive an immediate email notification when this piece reaches your target price
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Active Alert Banner if present */}
        {existingAlert && (
          <div className="bg-[#FAF5EB] px-6 py-3 border-b border-[#EADBBD] flex items-center justify-between text-xs text-[#8A6D2B]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#98702B]" />
              <span>
                Active alert monitoring threshold:{' '}
                <strong className="font-mono text-[#1E1B18]">{formatPrice(existingAlert.targetPrice)}</strong>
              </span>
            </div>
            <button
              onClick={handleCancelAlert}
              disabled={isSubmitting}
              className="text-red-700 hover:text-red-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Cancel Alert</span>
            </button>
          </div>
        )}

        {/* Product Preview Card */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3.5 bg-white p-3.5 rounded border border-[#E5DDD0] shadow-2xs">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 object-cover rounded border border-[#E8E0D2] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#7A6E5E] font-medium">
                {product.category} · {product.purity.split(' ')[0]}
              </div>
              <h4 className="font-serif text-base font-medium text-[#1E1B18] truncate mt-0.5">
                {product.name}
              </h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xs text-[#7A6E5E]">Current Atelier Price:</span>
                <span className="font-mono tabular-nums font-bold text-sm text-[#1E1B18]">
                  {formatPrice(currentPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Price Alert Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Threshold Presets */}
            <div>
              <label className="block text-xs font-semibold text-[#3E372E] mb-2 flex items-center justify-between">
                <span>Select Desired Discount Threshold</span>
                <span className="text-[11px] font-normal text-[#7A6E5E]">
                  Trigger alert when price drops by:
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {[5, 10, 15].map((pct) => {
                  const targetVal = Math.round(currentPrice * (1 - pct / 100));
                  const isSelected = !isCustom && selectedPercentage === pct;

                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectPreset(pct)}
                      className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                          : 'bg-white border-[#E0D8CB] text-[#3D352B] hover:border-[#98702B]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono">{pct}% Off</span>
                        {isSelected && <Check className="w-3 h-3 text-[#C9A24D]" />}
                      </div>
                      <div
                        className={`text-[11px] font-mono tabular-nums mt-1 ${
                          isSelected ? 'text-[#D6C7A8]' : 'text-[#7D705E]'
                        }`}
                      >
                        {formatPrice(targetVal)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Target Price Input */}
            <div>
              <label className="block text-xs font-semibold text-[#3E372E] mb-1.5 flex items-center justify-between">
                <span>Or Enter Custom Target Price (₹ INR)</span>
                {calculatedSavings > 0 && (
                  <span className="text-[11px] font-mono font-medium text-[#256B3E] bg-[#EAF5EC] px-1.5 py-0.2 rounded">
                    Saves {formatPrice(calculatedSavings)} ({calculatedSavingsPercent}%)
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-sm font-semibold text-[#8C7D6B]">
                  ₹
                </span>
                <input
                  type="text"
                  value={customPriceInput}
                  onChange={handleCustomInputChange}
                  placeholder={`e.g. ${Math.round(currentPrice * 0.9)}`}
                  className={`w-full pl-8 pr-3 py-2 bg-white border rounded text-sm font-mono font-semibold text-[#1E1B18] focus:outline-none ${
                    error
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-[#DDD5C7] focus:border-[#98702B]'
                  }`}
                />
              </div>
            </div>

            {/* Email Notification Address */}
            <div>
              <label className="block text-xs font-semibold text-[#3E372E] mb-1.5">
                Send Notification To Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD5C7] rounded text-xs text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
              </div>
              <p className="text-[10px] text-[#7A6E5E] mt-1">
                We respect your privacy. No spam — only genuine celebratory offer & price drop alerts.
              </p>
            </div>

            {/* Optional WhatsApp check */}
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#52493D] select-none pt-1">
              <input
                type="checkbox"
                checked={notifyOnWhatsApp}
                onChange={(e) => setNotifyOnWhatsApp(e.target.checked)}
                className="accent-[#98702B] rounded"
              />
              <span>Also send priority dispatch alert via WhatsApp concierge</span>
            </label>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-[#6B5E4D] hover:text-[#1E1B18] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !!error}
                className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#342D25] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Alert...</span>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-[#C9A24D]" />
                    <span>{existingAlert ? 'Update Price Alert' : 'Set Price Alert'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Trust Footer */}
        <div className="p-4 bg-[#F2EDE2] border-t border-[#E5DDD0] text-[11px] text-[#6E6353] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#98702B]" />
            <span>BIS 916 Guaranteed Authenticity & Private Client Privilege</span>
          </div>
          <span className="font-mono text-[10px] text-[#8C7D6B] hidden sm:inline">
            Meghna Atelier Vault
          </span>
        </div>
      </div>
    </div>
  );
};
