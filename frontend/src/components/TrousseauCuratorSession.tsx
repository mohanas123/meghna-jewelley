import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, ArrowRight, ShieldCheck, Heart, RotateCcw } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface TrousseauCuratorSessionProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onOpenCheckoutWithItem: (product: Product, quantity: number) => void;
}

export const TrousseauCuratorSession: React.FC<TrousseauCuratorSessionProps> = ({
  products,
  onOpenProductModal,
  onOpenCheckoutWithItem,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Filter items by type for the 3 curation slots
  const neckpieces = products.filter(
    (p) => p.category.includes('Choker') || p.category.includes('Necklace') || p.category.includes('Rani')
  );
  const earrings = products.filter(
    (p) => p.category.includes('Earring') || p.category.includes('Jhumka')
  );
  const handpieces = products.filter(
    (p) => p.category.includes('Bangle') || p.category.includes('Kada')
  );

  // Selected indices
  const [selectedNeckId, setSelectedNeckId] = useState<string>(
    neckpieces[0]?.id || 'mj-101'
  );
  const [selectedEarId, setSelectedEarId] = useState<string>(
    earrings[0]?.id || 'mj-102'
  );
  const [selectedHandId, setSelectedHandId] = useState<string>(
    handpieces[0]?.id || 'mj-103'
  );

  const [suiteAddedNotice, setSuiteAddedNotice] = useState(false);

  const selectedNeck = products.find((p) => p.id === selectedNeckId) || neckpieces[0];
  const selectedEar = products.find((p) => p.id === selectedEarId) || earrings[0];
  const selectedHand = products.find((p) => p.id === selectedHandId) || handpieces[0];

  const suiteItems = [selectedNeck, selectedEar, selectedHand].filter(Boolean) as Product[];

  const rawSubtotal = suiteItems.reduce((acc, it) => acc + it.price, 0);
  const suiteDiscountPercent = 15; // 15% Royal Suite privilege
  const privilegeDiscount = Math.round((rawSubtotal * suiteDiscountPercent) / 100);
  const suiteTotal = rawSubtotal - privilegeDiscount;

  const handleAddSuiteToBag = () => {
    suiteItems.forEach((item) => {
      addToCart(item, 1);
    });
    setSuiteAddedNotice(true);
    setTimeout(() => setSuiteAddedNotice(false), 3000);
  };

  return (
    <section id="trousseau-session" className="bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#8C7449] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span>Interactive Styling Session</span>
            <span aria-hidden="true" className="text-[#B39E79]">·</span>
            <span>Bespoke Suite Builder</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1816] [text-wrap:balance]">
            Curate Your Royal Antique Suite
          </h2>
          <p className="text-xs sm:text-sm text-[#736756] mt-2.5 leading-relaxed">
            Mix and match antique non-gold neckwear, ear adornments, and hand cuffs. Bundle any three pieces to unlock the complimentary 15% Royal Suite Privilege.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3 Slot Selectors */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slot 1: Neckwear */}
            <div className="bg-white p-5 rounded-sm border border-[#E5DDD0] shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="uppercase tracking-widest font-mono text-[#8C7449] font-semibold">
                  Step 1 · Select Antique Neckpiece
                </span>
                <span className="text-[#6D6253]">
                  {neckpieces.length} heirloom styles
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {neckpieces.map((item) => {
                  const isSelected = item.id === selectedNeckId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNeckId(item.id)}
                      className={`text-left p-2.5 rounded transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                          : 'border-[#E8E2D5] bg-[#FAF8F5] hover:border-[#BAA993]'
                      }`}
                    >
                      <div className="aspect-square bg-white rounded overflow-hidden mb-2 relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#98702B] text-white p-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-serif font-medium text-[#1E1B18] line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#8A6A2C] font-semibold mt-0.5">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot 2: Ear Adornments */}
            <div className="bg-white p-5 rounded-sm border border-[#E5DDD0] shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="uppercase tracking-widest font-mono text-[#8C7449] font-semibold">
                  Step 2 · Select Blackened Earring Pair
                </span>
                <span className="text-[#6D6253]">
                  {earrings.length} styles available
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earrings.map((item) => {
                  const isSelected = item.id === selectedEarId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedEarId(item.id)}
                      className={`text-left p-2.5 rounded transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                          : 'border-[#E8E2D5] bg-[#FAF8F5] hover:border-[#BAA993]'
                      }`}
                    >
                      <div className="aspect-square bg-white rounded overflow-hidden mb-2 relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#98702B] text-white p-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-serif font-medium text-[#1E1B18] line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#8A6A2C] font-semibold mt-0.5">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot 3: Hand / Wrist Cuff */}
            <div className="bg-white p-5 rounded-sm border border-[#E5DDD0] shadow-xs">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="uppercase tracking-widest font-mono text-[#8C7449] font-semibold">
                  Step 3 · Select Oxidized Silver Kada
                </span>
                <span className="text-[#6D6253]">
                  Solid 925 cuff pieces
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {handpieces.map((item) => {
                  const isSelected = item.id === selectedHandId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedHandId(item.id)}
                      className={`text-left p-2.5 rounded transition-all cursor-pointer border flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                          : 'border-[#E8E2D5] bg-[#FAF8F5] hover:border-[#BAA993]'
                      }`}
                    >
                      <div className="aspect-square bg-white rounded overflow-hidden mb-2 relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-[#98702B] text-white p-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-serif font-medium text-[#1E1B18] line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-[#8A6A2C] font-semibold mt-0.5">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Suite Showcase & Pricing Summary */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-sm border border-[#E0D7C7] shadow-lg sticky top-24 space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#8A7149]">
                Suite Preview & Assay Breakdown
              </div>
              <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-1">
                Your Bespoke Antique Ensemble
              </h3>
            </div>

            {/* Visual Ensemble Array */}
            <div className="grid grid-cols-3 gap-2.5 bg-[#F7F4EE] p-3 rounded border border-[#E5DDCF]">
              {suiteItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onOpenProductModal(item)}
                  className="bg-white p-1.5 rounded border border-[#E8E0D2] cursor-pointer group hover:border-[#98702B] transition-colors"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="aspect-square w-full object-cover rounded-xs"
                  />
                  <div className="text-[10px] font-serif font-medium text-[#1E1B18] line-clamp-1 mt-1 group-hover:text-[#98702B]">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Suite Specifications */}
            <div className="space-y-2 text-xs divide-y divide-[#F0EAE0]">
              <div className="flex justify-between items-center pt-1.5 text-[#6B5E4E]">
                <span>Ensemble Metal Alloy:</span>
                <span className="font-medium text-[#1E1B18]">925 Solid Oxidized Silver (Non-Gold)</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 text-[#6B5E4E]">
                <span>Artisan Finish:</span>
                <span className="font-medium text-[#1E1B18]">Chiaroscuro Antique Patina</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 text-[#6B5E4E]">
                <span>Gift Packaging:</span>
                <span className="font-medium text-[#2E6B47]">Royal Teakwood Velvet Box Included</span>
              </div>
            </div>

            {/* Pricing Calculation with Bundle Privilege */}
            <div className="pt-3 border-t border-[#E5DDCF] space-y-2 text-xs">
              <div className="flex justify-between text-[#736553]">
                <span>Individual Pieces Total:</span>
                <span className="font-mono tabular-nums">{formatPrice(rawSubtotal)}</span>
              </div>

              <div className="flex justify-between text-[#2E6B47] font-semibold">
                <span>15% Royal Suite Privilege:</span>
                <span className="font-mono tabular-nums">-{formatPrice(privilegeDiscount)}</span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#F0EAE0]">
                <div>
                  <span className="font-serif text-base text-[#1E1B18] font-medium">Curated Suite Total:</span>
                  <span className="block text-[10px] text-[#7A6E5E]">All 3 pieces bundled with assay card</span>
                </div>
                <span className="font-mono tabular-nums text-2xl font-bold text-[#8C6524]">
                  {formatPrice(suiteTotal)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddSuiteToBag}
                className="w-full py-3.5 px-4 bg-[#1E1B18] hover:bg-[#342D25] text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {suiteAddedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-[#C9A24D]" />
                    <span>Complete Suite Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#C9A24D]" />
                    <span>Add Curated Suite to Bag (Save {formatPrice(privilegeDiscount)})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-[#7A6D5B]">
                Includes complimentary insured armored transit & handwritten royal parchment card
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
