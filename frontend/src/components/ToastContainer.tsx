import React from 'react';
import { Heart, TrendingDown, Sparkles, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isPriceDrop = toast.type === 'price-drop';
        const isWishlistAdd = toast.type === 'wishlist-add';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full bg-[#FAF8F5] border rounded-sm shadow-xl p-4 transition-all duration-300 transform translate-y-0 opacity-100 flex gap-3.5 items-start ${
              isPriceDrop
                ? 'border-[#C9A24D] bg-gradient-to-r from-[#FCF9F2] to-[#FAF6EE] ring-1 ring-[#C9A24D]/30'
                : 'border-[#E0D7C9] bg-[#FAF8F5]'
            }`}
          >
            {/* Thumbnail or Badge */}
            {toast.thumbnailUrl ? (
              <div className="relative w-12 h-12 bg-[#F2EDE2] rounded overflow-hidden shrink-0 border border-[#E5DDD0] shadow-2xs">
                <img
                  src={toast.thumbnailUrl}
                  alt={toast.title}
                  className="w-full h-full object-cover"
                />
                {isWishlistAdd && (
                  <div className="absolute bottom-0 right-0 p-0.5 bg-white/95 rounded-tl">
                    <Heart className="w-2.5 h-2.5 fill-[#98702B] text-[#98702B]" />
                  </div>
                )}
                {isPriceDrop && (
                  <div className="absolute bottom-0 right-0 p-0.5 bg-[#98702B] rounded-tl text-white">
                    <TrendingDown className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isPriceDrop ? 'bg-[#F6EED8] text-[#8B6523]' : 'bg-[#F2ECE1] text-[#98702B]'
                }`}
              >
                {isPriceDrop ? <TrendingDown className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
              </div>
            )}

            {/* Message Body */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-serif text-sm font-semibold text-[#1E1B18] tracking-tight leading-snug truncate">
                  {toast.title}
                </h5>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="text-[#9E907B] hover:text-[#1E1B18] p-0.5 rounded transition-colors cursor-pointer shrink-0"
                  aria-label="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-[#5C5243] mt-1 leading-relaxed line-clamp-2">
                {toast.message}
              </p>

              {/* Price Drop Callout */}
              {isPriceDrop && toast.oldPrice && toast.newPrice && (
                <div className="mt-2 flex items-center gap-2 text-xs font-mono tabular-nums">
                  <span className="text-[#998D7B] line-through">
                    ₹{toast.oldPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[#98702B] font-bold text-sm">
                    ₹{toast.newPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] bg-[#EAF5EC] text-[#276E43] font-sans font-semibold px-1.5 py-0.2 rounded">
                    Price Drop
                  </span>
                </div>
              )}

              {/* Action Button */}
              {toast.actionLabel && toast.onAction && (
                <div className="mt-2.5 pt-2 border-t border-[#EFE8DD]/70">
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      dismissToast(toast.id);
                    }}
                    className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18] hover:text-[#98702B] flex items-center gap-1 transition-colors cursor-pointer group"
                  >
                    <span>{toast.actionLabel}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
