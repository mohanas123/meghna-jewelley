import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    couponError,
    shipping,
    total,
    freeShippingThreshold,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { formatPrice } = useCurrency();
  const [promoInput, setPromoInput] = useState('');
  const [couponSuccessMsg, setCouponSuccessMsg] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const ok = await applyCoupon(promoInput);
    if (ok) {
      setCouponSuccessMsg(true);
      setPromoInput('');
      setTimeout(() => setCouponSuccessMsg(false), 2500);
    }
  };

  const amountRemainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#E2DAD0] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E8E0D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#98702B]" />
            <h3 className="font-serif text-lg font-medium text-[#1E1B18]">Your Shopping Bag</h3>
            <span className="font-mono text-xs text-[#8A7D6B] tabular-nums">({items.length} items)</span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#F4EFE6] border-b border-[#E8E0D2] text-xs">
          {amountRemainingForFreeShipping === 0 ? (
            <div className="flex items-center gap-1.5 text-[#276E43] font-medium">
              <Check className="w-4 h-4" />
              <span>Complimentary Armored & Insured Transit Unlocked!</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[#6B5F4F]">
                <span>Add {formatPrice(amountRemainingForFreeShipping)} for free insured courier</span>
                <span className="font-mono tabular-nums">{freeShippingPercentage}%</span>
              </div>
              <div className="w-full bg-[#E5DDCF] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#98702B] h-full transition-all duration-300"
                  style={{ width: `${freeShippingPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#EFE8DD]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-14 h-14 bg-[#F2EDE2] rounded-full flex items-center justify-center text-[#9E907B] mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="font-serif text-lg text-[#2E2822]">Your bag is empty</p>
              <p className="text-xs text-[#7A6E5E] mt-1 max-w-xs">
                Explore our hallmarked temple chokers, jadau rani haars, and antique jhumkas.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] rounded hover:bg-[#383129] transition-colors"
              >
                Browse Heirlooms
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedSize || ''}-${idx}`} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-20 bg-[#F5F1E9] rounded overflow-hidden shrink-0 border border-[#E5DDD0]">
                  <img
                    src={item.product.images[0] || '/images/hero_antique_jewellery.jpg'}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-medium text-[#1E1B18] line-clamp-1 leading-snug">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-[#9E9280] hover:text-[#912D2D] p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#7A6E5E] mt-0.5">
                      {item.product.weight} · {item.selectedSize ? `Size: ${item.selectedSize}` : item.product.purity.split(' ')[0]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#DDD5C7] rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-[#52493D] hover:bg-[#F4EFE6]"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                        className="px-2 py-0.5 text-xs text-[#52493D] hover:bg-[#F4EFE6]"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-mono tabular-nums text-xs font-semibold text-[#1E1B18]">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Totals and Coupon */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E0D2] bg-white space-y-3">
            {/* Promo Code section */}
            {!couponCode ? (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. MEGHNA10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD5C7] rounded text-[#1E1B18] placeholder-[#9C8F7E] focus:outline-none focus:border-[#98702B]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#F2EDE2] hover:bg-[#E5DDCF] text-[#4A4033] rounded transition-colors"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-[#F4EFE6] px-3 py-1.5 rounded text-xs">
                <div className="flex items-center gap-1.5 text-[#8B6523] font-medium">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Promo {couponCode} applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-[#9E907B] hover:text-[#1E1B18] underline"
                >
                  Remove
                </button>
              </div>
            )}

            {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
            {couponSuccessMsg && <p className="text-[11px] text-[#2B6E45]">Promotion code applied!</p>}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5C5243] pt-2 border-t border-[#F2ECE1]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono tabular-nums text-[#1E1B18]">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#2B6E45]">
                  <span>Privilege Discount</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Insured Doorstep Transit</span>
                <span className="font-mono tabular-nums">
                  {shipping === 0 ? <span className="text-[#2B6E45] font-medium">FREE</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1E1B18] pt-2 border-t border-[#F2ECE1]">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base text-[#98702B]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342D25] rounded transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8A7D6C] text-center pt-1">
              <ShieldCheck className="w-3 h-3 text-[#98702B]" />
              <span>Full Insurance & BIS Purity Assurance Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
