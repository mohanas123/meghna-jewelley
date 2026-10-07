import React, { useState, useRef } from 'react';
import {
  X, Heart, ShoppingBag, ShieldCheck, Check, MessageCircle, Ruler,
  Sparkles, Scale, Award, ZoomIn, ZoomOut, Camera, Bell
} from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { VirtualTryOnModal } from './VirtualTryOnModal.tsx';
import { PriceAlertModal } from './PriceAlertModal.tsx';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCheckoutWithItem: (product: Product, quantity: number, size?: string) => void;
  onOpenWishlist?: () => void;
  allProducts?: Product[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOpenCheckoutWithItem,
  onOpenWishlist,
  allProducts = [],
}) => {
  if (!product) return null;

  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.category.includes('Bangle') ? '2.6 (Standard)' : ''
  );
  const [addedNotice, setAddedNotice] = useState(false);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isPriceAlertOpen, setIsPriceAlertOpen] = useState(false);

  // Hover-to-Zoom inspection state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zoomScale, setZoomScale] = useState(2.25);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    setIsZoomed(true);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || undefined);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleDirectBuy = () => {
    onOpenCheckoutWithItem(product, quantity, selectedSize || undefined);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello Meghna Jewellery Concierge, I am inquiring about the ${product.name} (SKU: ${product.sku}, ${formatPrice(product.price)}). Can you provide more details regarding hallmarking and custom sizing?`
    );
    window.open(`https://wa.me/919840122890?text=${text}`, '_blank');
  };

  const isBangleOrRing = product.category.includes('Bangle') || product.category.includes('Ring');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white text-[#2B2620] rounded-full transition-colors cursor-pointer shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Gallery Column (Sticky left on desktop) */}
          <div className="p-6 sm:p-8 bg-[#F5F1E9] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E0D2]">
            <div>
              {/* Main Image Frame with Smooth Hover-to-Zoom */}
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="aspect-[4/3] bg-white rounded overflow-hidden shadow-xs border border-[#E5DDD0] relative cursor-crosshair select-none group"
              >
                <img
                  src={product.images[activeImageIndex] || product.images[0] || '/images/hero_antique_jewellery.jpg'}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                  }}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)',
                    transition: isZoomed
                      ? 'transform 0.15s ease-out, transform-origin 0.04s ease-out'
                      : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.2s ease-out',
                  }}
                  className="w-full h-full object-cover object-center pointer-events-none will-change-transform"
                />

                {/* Trending Heirloom Tag */}
                {product.isTrending && !isZoomed && (
                  <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-[#98702B] bg-[#FAF8F5]/95 px-2.5 py-0.5 rounded shadow-2xs border border-[#E5DDD0] pointer-events-none">
                    Trending Heirloom
                  </span>
                )}

                {/* Macro Inspection Overlay & Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-200 backdrop-blur-xs ${
                      isZoomed
                        ? 'bg-[#1E1B18]/90 text-white shadow-md'
                        : 'bg-white/90 text-[#6B5E4D] shadow-2xs border border-[#E5DDD0]'
                    }`}
                  >
                    <ZoomIn className={`w-3.5 h-3.5 ${isZoomed ? 'text-[#C9A24D]' : 'text-[#98702B]'}`} />
                    <span>
                      {isZoomed
                        ? `Macro Inspection (${zoomScale}x)`
                        : 'Hover or touch to inspect antique details'}
                    </span>
                  </div>

                  {/* Zoom Magnification Preset Switcher */}
                  <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-xs rounded border border-[#DDD5C7] p-0.5 shadow-2xs">
                    {[2, 2.5, 3].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={(e) => {
                          e.stopPropagation();
                          setZoomScale(lvl);
                          setIsZoomed(true);
                        }}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded font-semibold transition-colors cursor-pointer ${
                          zoomScale === lvl
                            ? 'bg-[#1E1B18] text-[#FAF8F5]'
                            : 'text-[#6D6253] hover:text-[#1E1B18] hover:bg-[#F2ECE1]'
                        }`}
                        title={`${lvl}x Zoom Level`}
                        aria-label={`Set zoom to ${lvl}x`}
                      >
                        {lvl}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtle Lens Focus Indicator Ring */}
                {isZoomed && (
                  <div
                    className="absolute pointer-events-none w-24 h-24 border border-[#98702B]/45 rounded-full shadow-inner transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
                    style={{
                      left: `${zoomPos.x}%`,
                      top: `${zoomPos.y}%`,
                    }}
                  />
                )}
              </div>

              {/* Thumbnails if multiple images exist */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5 mt-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`w-16 h-14 rounded overflow-hidden border-2 transition-colors cursor-pointer ${
                        activeImageIndex === idx ? 'border-[#98702B]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      aria-label={`View angle ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hallmarking Proof Box */}
            <div className="mt-6 pt-5 border-t border-[#E2D8C7] space-y-2 text-xs text-[#6B5F4F]">
              <div className="flex items-center gap-2 font-medium text-[#2E2822]">
                <ShieldCheck className="w-4 h-4 text-[#98702B]" />
                <span>Certified 925 Silver & Platinum Assay (Non-Gold)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#7C705F]">
                Includes an archival physical assay certificate stamped with 925 sterling silver fineness, individual gross weight, and certified gemstone caratage report.
              </p>
            </div>
          </div>

          {/* Contiguous Purchase Module (Right) */}
          <div className="p-6 sm:p-8 flex flex-col justify-between bg-[#FAF8F5]">
            <div>
              {/* Unboxed Metadata Header */}
              <div className="flex items-center justify-between text-xs text-[#7F7464] mb-2 font-medium">
                <div className="flex items-center gap-2">
                  <span>{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{product.sku}</span>
                </div>
                <button
                  onClick={() => toggleWishlist(product, () => {
                    onClose();
                    onOpenWishlist?.();
                  })}
                  className="flex items-center gap-1.5 text-xs text-[#6B5E4D] hover:text-[#98702B] transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#98702B] text-[#98702B]' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Save'}</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] font-medium leading-tight">
                {product.name}
              </h2>

              {/* Pricing Section */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono tabular-nums text-2xl font-bold text-[#1E1B18]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-mono tabular-nums text-sm text-[#998D7B] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-[#2A6E45] font-medium">
                    Complimentary Insured Transit
                  </span>
                </div>

                {/* Set Price Alert Button */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsPriceAlertOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-[#8B6523] bg-[#FAF5EB] border border-[#DDCBB0] hover:bg-[#F2ECE1] transition-colors cursor-pointer shadow-2xs group"
                    title="Set price threshold alert"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#98702B] group-hover:scale-110 transition-transform" />
                    <span>Set Price Alert</span>
                  </button>
                  <span className="text-[11px] text-[#7A6E5E]">
                    Get email alerts when this piece drops in price
                  </span>
                </div>
              </div>

              {/* Authentic Specifications Matrix */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs bg-[#F4EFE6] p-3.5 rounded border border-[#E5DDCF]">
                <div>
                  <span className="text-[#847665] block text-[10px] uppercase font-semibold">Net Precious Weight</span>
                  <span className="font-mono font-medium text-[#29241E]">{product.weight}</span>
                </div>
                <div>
                  <span className="text-[#847665] block text-[10px] uppercase font-semibold">Precious Metal Formulation</span>
                  <span className="font-medium text-[#29241E]">{product.purity}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#847665] block text-[10px] uppercase font-semibold">Gemstones</span>
                  <span className="font-medium text-[#29241E]">{product.gemstones}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-5 text-xs text-[#524B40] leading-relaxed space-y-2">
                <p>{product.description}</p>
                <div className="text-[11px] italic text-[#706453]">
                  <strong>Craftsmanship note:</strong> {product.craftsmanship}
                </div>
              </div>

              {/* Size Selector if Bangle/Kada */}
              {isBangleOrRing && (
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-medium text-[#2E2822]">Select Bangle Size</span>
                    <span className="text-[11px] text-[#7A6D5C] flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> Standard Indian sizing
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {['2.4 (Small)', '2.6 (Standard)', '2.8 (Broad)'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#1E1B18] text-white'
                            : 'bg-white border border-[#DDD5C7] text-[#4A4339] hover:border-[#98702B]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-medium text-[#2E2822]">Quantity:</span>
                <div className="flex items-center border border-[#DDD5C7] rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm text-[#4A4339] hover:bg-[#F2ECE1] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-mono tabular-nums font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount || 5, quantity + 1))}
                    className="px-2.5 py-1 text-sm text-[#4A4339] hover:bg-[#F2ECE1] cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#7D705E]">
                  ({product.stockCount} handcrafted pieces available)
                </span>
              </div>
            </div>

            {/* Virtual Try-On AR Button */}
            <div className="mt-5 pt-4 border-t border-[#E8E0D2]">
              <button
                onClick={() => setIsTryOnOpen(true)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FAF6EE] to-[#F5ECE0] hover:from-[#F4EBD7] hover:to-[#EEE0CE] text-[#846123] border border-[#D8C7A5] rounded-sm text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs group"
              >
                <Camera className="w-4 h-4 text-[#C9A24D] group-hover:scale-110 transition-transform" />
                <span>See how it looks (Virtual Try-On)</span>
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24D]" />
              </button>
              <p className="text-[11px] text-center text-[#8C7D6C] mt-1.5">
                Preview necklace collar drape or earrings on your face in real-time
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-5 pt-4 border-t border-[#E8E0D2] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342E28] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-[#C9A24D]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectBuy}
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-[#1E1B18] bg-[#E8DCBF] hover:bg-[#DDD0B0] rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Direct Checkout</span>
                </button>
              </div>

              {/* Direct Concierge WhatsApp button */}
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-2.5 text-xs font-medium text-[#2B5E39] bg-[#EAF5EC] hover:bg-[#DEEFE1] border border-[#C5E3CA] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#2B5E39]" />
                <span>Consult Goldsmith on WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Virtual Try-On AR Modal */}
      {isTryOnOpen && (
        <VirtualTryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
          product={product}
          allProducts={allProducts}
          onOpenCheckoutWithItem={(prod, qty) => {
            setIsTryOnOpen(false);
            onClose();
            onOpenCheckoutWithItem(prod, qty, selectedSize || undefined);
          }}
        />
      )}

      {/* Set Price Alert Modal */}
      {isPriceAlertOpen && (
        <PriceAlertModal
          isOpen={isPriceAlertOpen}
          onClose={() => setIsPriceAlertOpen(false)}
          product={product}
        />
      )}
    </div>
  );
};
