import React, { useState } from 'react';
import {
  X, Heart, ShoppingBag, Trash2, ArrowRight, Sparkles, Check,
  ExternalLink, Eye, ShieldCheck, Tag
} from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onExploreCatalog: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  products,
  onOpenProductModal,
  onExploreCatalog,
}) => {
  const { wishlistIds, removeFromWishlist, clearWishlist, simulatePriceDrop } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [movedAnimationId, setMovedAnimationId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Resolve full product models for wishlistIds
  const wishlistItems: Product[] = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    setMovedAnimationId(product.id);
    setTimeout(() => {
      removeFromWishlist(product);
      setMovedAnimationId(null);
    }, 700);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item, 1);
    });
    clearWishlist();
    onClose();
    setIsCartOpen(true);
  };

  const handleSimulatePriceDropClick = () => {
    const target = wishlistItems[0] || products[0];
    if (target) {
      simulatePriceDrop(target, 20000, onOpenProductModal);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-full border border-[#E0D8CB] flex items-center justify-center text-[#98702B] shadow-2xs">
              <Heart className="w-5 h-5 fill-[#98702B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium text-[#1E1B18]">
                  Saved Heirloom Collection
                </h3>
                <span className="font-mono text-xs text-[#8A7D6B] bg-[#F4EFE6] px-2 py-0.5 rounded">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'piece' : 'pieces'}
                </span>
              </div>
              <p className="text-xs text-[#7A6E5E] mt-0.5">
                Curated jewelry pieces reserved for upcoming celebratory occasions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {wishlistItems.length > 0 && (
              <button
                onClick={handleSimulatePriceDropClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#8B6523] bg-[#FAF6EE] border border-[#D6C4A6] hover:bg-[#F2ECE1] rounded transition-colors cursor-pointer"
                title="Test Price Drop Toast Alert on saved piece"
              >
                <Sparkles className="w-3 h-3 text-[#C9A24D]" />
                <span>Test Price Drop</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wishlist Items List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 divide-y divide-[#EFE8DD]">
          {wishlistItems.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-[#F4EFE6] rounded-full flex items-center justify-center text-[#9E907B] mx-auto mb-3">
                <Heart className="w-7 h-7 text-[#98702B]/60" />
              </div>
              <h4 className="font-serif text-xl font-medium text-[#1E1B18]">
                Your Saved Collection is Empty
              </h4>
              <p className="text-xs text-[#7A6E5E] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Save temple chokers, jadau rani haars, and heritage kadas as you browse to track prices, receive discount alerts, and purchase when ready.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExploreCatalog();
                }}
                className="mt-6 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342D25] rounded transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Browse Antique Heirlooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            wishlistItems.map((item) => {
              const isMoving = movedAnimationId === item.id;

              return (
                <div
                  key={item.id}
                  className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                    isMoving ? 'opacity-40 translate-x-3' : 'opacity-100'
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <div
                      onClick={() => {
                        onClose();
                        onOpenProductModal(item);
                      }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F4EFE6] rounded overflow-hidden shrink-0 border border-[#E5DDD0] cursor-pointer group relative shadow-2xs"
                    >
                      <img
                        src={item.images[0] || '/images/hero_antique_jewellery.jpg'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-[#7E7465] font-medium">
                        <span>{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{item.weight}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.purity.split(' ')[0]}</span>
                      </div>

                      <h4
                        onClick={() => {
                          onClose();
                          onOpenProductModal(item);
                        }}
                        className="font-serif text-base font-medium text-[#1E1B18] hover:text-[#98702B] transition-colors leading-snug cursor-pointer truncate mt-0.5"
                      >
                        {item.name}
                      </h4>

                      {/* Pricing row with discount badge */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-mono tabular-nums text-sm font-bold text-[#1E1B18]">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-mono tabular-nums text-xs text-[#9B9080] line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                        {item.offerBadge && (
                          <span className="text-[10px] text-[#2E6B47] font-semibold bg-[#EAF5EC] px-1.5 py-0.2 rounded">
                            {item.offerBadge}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-[#8A7D6C] mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#98702B]" />
                        <span>BIS 916 Hallmarked & Insured Courier</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F5EFE6]">
                    <button
                      onClick={() => removeFromWishlist(item)}
                      className="p-2 text-[#9E907B] hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer text-xs flex items-center gap-1"
                      title="Remove from saved collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="sm:hidden text-[11px]">Remove</span>
                    </button>

                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={isMoving}
                      className="px-4 py-2 bg-[#1E1B18] hover:bg-[#342D25] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      {isMoving ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#C9A24D]" />
                          <span>Moving to Bag...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer (when items exist) */}
        {wishlistItems.length > 0 && (
          <div className="p-5 sm:p-6 bg-white border-t border-[#E8E0D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="text-[#7A6E5E]">
                Total Collection Value:{' '}
                <strong className="font-mono tabular-nums text-base text-[#1E1B18] font-bold">
                  {formatPrice(totalValue)}
                </strong>
              </div>
              <div className="text-[11px] text-[#2E6B47] mt-0.5">
                Eligible for Complimentary Insured Armored Delivery
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="px-3 py-2 text-xs font-medium text-[#7A6E5E] hover:text-red-700 transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#383129] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>Move All to Bag ({wishlistItems.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
