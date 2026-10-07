import React, { useState } from 'react';
import { Sparkles, Layers, ShieldCheck, Check, ShoppingBag, Eye, RefreshCw, Award, ArrowRight } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface AntiquePairingStudioProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onOpenCheckoutWithEnsemble: (product: Product, quantity: number) => void;
}

export const AntiquePairingStudio: React.FC<AntiquePairingStudioProps> = ({
  products,
  onOpenProductModal,
  onOpenCheckoutWithEnsemble,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Categorize available pieces
  const neckpieces = products.filter(
    (p) => p.category.includes('Choker') || p.category.includes('Necklace') || p.category.includes('Rani')
  );
  const earrings = products.filter(
    (p) => p.category.includes('Earring') || p.category.includes('Jhumka')
  );
  const kadas = products.filter(
    (p) => p.category.includes('Bangle') || p.category.includes('Kada')
  );

  const [selectedNeckId, setSelectedNeckId] = useState<string>(neckpieces[0]?.id || 'mj-101');
  const [selectedEarId, setSelectedEarId] = useState<string>(earrings[0]?.id || 'mj-102');
  const [selectedKadaId, setSelectedKadaId] = useState<string>(kadas[0]?.id || 'mj-103');
  const [ensembleAdded, setEnsembleAdded] = useState(false);

  const selectedNeck = products.find((p) => p.id === selectedNeckId) || neckpieces[0];
  const selectedEar = products.find((p) => p.id === selectedEarId) || earrings[0];
  const selectedKada = products.find((p) => p.id === selectedKadaId) || kadas[0];

  const ensembleItems = [selectedNeck, selectedEar, selectedKada].filter(Boolean) as Product[];

  // Calculations
  const rawSubtotal = ensembleItems.reduce((acc, item) => acc + item.price, 0);
  const ensemblePrivilegePercent = 15;
  const privilegeSavings = Math.round((rawSubtotal * ensemblePrivilegePercent) / 100);
  const finalEnsembleTotal = rawSubtotal - privilegeSavings;

  // Compute total precious weight approximation
  const totalWeightGrams = ensembleItems.reduce((acc, item) => {
    const match = item.weight.match(/([\d.]+)/);
    return acc + (match ? parseFloat(match[1]) : 45);
  }, 0);

  // Harmony score calculation based on matching tags or metals
  const calculateHarmony = () => {
    let score = 88;
    const allTags = ensembleItems.flatMap((i) => i.tags);
    if (allTags.filter((t) => t === 'Victorian' || t === 'Oxidized Silver').length >= 3) score += 6;
    if (allTags.filter((t) => t === 'Emerald' || t === 'Polki').length >= 3) score += 5;
    return Math.min(score, 99);
  };

  const harmonyScore = calculateHarmony();

  const handleAddEnsembleToBag = () => {
    ensembleItems.forEach((item) => {
      addToCart(item, 1);
    });
    setEnsembleAdded(true);
    setTimeout(() => setEnsembleAdded(false), 3000);
  };

  const handleRandomizeEnsemble = () => {
    if (neckpieces.length > 0) {
      const randomNeck = neckpieces[Math.floor(Math.random() * neckpieces.length)];
      setSelectedNeckId(randomNeck.id);
    }
    if (earrings.length > 0) {
      const randomEar = earrings[Math.floor(Math.random() * earrings.length)];
      setSelectedEarId(randomEar.id);
    }
    if (kadas.length > 0) {
      const randomKada = kadas[Math.floor(Math.random() * kadas.length)];
      setSelectedKadaId(randomKada.id);
    }
  };

  return (
    <section id="pairing-studio-session" className="bg-[#12100E] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#29231B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#262018]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
              <Layers className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Interactive Pairing Session</span>
              <span aria-hidden="true" className="text-[#685741]">·</span>
              <span>Antique Ensemble Harmony</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
              The Antique Jewellery Pairing Studio
            </h2>
            <p className="text-xs sm:text-sm text-[#A89C8B] mt-2 max-w-xl leading-relaxed">
              Curate an ensemble of rare non-gold heirlooms. Match antique oxidized collars with hand-chiseled jhumkas and cuffs, verifying their patina coherence and unlocked ensemble privilege.
            </p>
          </div>

          <button
            onClick={handleRandomizeEnsemble}
            className="self-start md:self-end px-4 py-2 text-xs font-medium text-[#C9A24D] border border-[#52432F] hover:border-[#C9A24D] hover:bg-[#201A14] rounded transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Royal Pairing</span>
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3 Category Slot Pickers (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slot 1: Antique Neckpiece */}
            <div className="bg-[#181512] border border-[#2B241C] p-5 rounded-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#C9A24D] font-semibold">
                  1. Royal Neckpiece ({neckpieces.length} Options)
                </span>
                <span className="text-[11px] text-[#8C7E6C] font-mono">
                  {selectedNeck ? selectedNeck.sku : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {neckpieces.map((item) => {
                  const isSelected = item.id === selectedNeckId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNeckId(item.id)}
                      className={`text-left p-2.5 rounded transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] shadow-md ring-1 ring-[#C9A24D]'
                          : 'bg-[#14110E] border-[#29221A] hover:border-[#6B5A42]'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#211B15]">
                        <img
                          src={item.images[0] || '/images/hero_antique_jewellery.jpg'}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-serif text-xs font-medium text-[#FAF8F5] truncate mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums font-semibold">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot 2: Antique Earrings */}
            <div className="bg-[#181512] border border-[#2B241C] p-5 rounded-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#C9A24D] font-semibold">
                  2. Antique Ear Adornments ({earrings.length} Options)
                </span>
                <span className="text-[11px] text-[#8C7E6C] font-mono">
                  {selectedEar ? selectedEar.sku : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {earrings.map((item) => {
                  const isSelected = item.id === selectedEarId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedEarId(item.id)}
                      className={`text-left p-2.5 rounded transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] shadow-md ring-1 ring-[#C9A24D]'
                          : 'bg-[#14110E] border-[#29221A] hover:border-[#6B5A42]'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#211B15]">
                        <img
                          src={item.images[0] || '/images/product_emerald_jhumkas.jpg'}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/product_emerald_jhumkas.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-serif text-xs font-medium text-[#FAF8F5] truncate mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums font-semibold">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot 3: Hand Adornment / Kada */}
            <div className="bg-[#181512] border border-[#2B241C] p-5 rounded-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono tracking-wider text-[#C9A24D] font-semibold">
                  3. Sculpted Kada or Cuff ({kadas.length} Options)
                </span>
                <span className="text-[11px] text-[#8C7E6C] font-mono">
                  {selectedKada ? selectedKada.sku : ''}
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {kadas.map((item) => {
                  const isSelected = item.id === selectedKadaId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedKadaId(item.id)}
                      className={`text-left p-2.5 rounded transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] shadow-md ring-1 ring-[#C9A24D]'
                          : 'bg-[#14110E] border-[#29221A] hover:border-[#6B5A42]'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded overflow-hidden mb-2 bg-[#211B15]">
                        <img
                          src={item.images[0] || '/images/product_heritage_kadas.jpg'}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/product_heritage_kadas.jpg';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-serif text-xs font-medium text-[#FAF8F5] truncate mb-0.5">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#D4AF37] tabular-nums font-semibold">
                        {formatPrice(item.price)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Live Curated Ensemble Canvas & Calculations (5 cols) */}
          <div className="lg:col-span-5 bg-[#171411] border border-[#2E271E] rounded-sm p-6 sm:p-7 sticky top-24 shadow-2xl">
            
            {/* Top Badge & Harmony Metric */}
            <div className="flex items-center justify-between pb-4 border-b border-[#29221A] mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#8C7E6C] block">
                  Curation Ledger
                </span>
                <h3 className="font-serif text-xl font-normal text-[#FAF8F5]">
                  Paired Royal Ensemble
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider font-mono text-[#C9A24D] block">
                  Harmony Index
                </span>
                <span className="font-mono text-lg font-bold text-[#E6CD92] tabular-nums">
                  {harmonyScore}% Coherent
                </span>
              </div>
            </div>

            {/* Visual Ensemble Preview Grid (Side by side) */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {ensembleItems.map((item, idx) => (
                <div key={item.id} className="bg-[#120F0D] border border-[#29221A] rounded p-1.5 flex flex-col justify-between">
                  <div className="aspect-square rounded overflow-hidden mb-1.5 bg-[#201A14]">
                    <img
                      src={item.images[0] || '/images/hero_antique_jewellery.jpg'}
                      alt={item.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] font-serif text-[#E0D8CB] truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[9px] font-mono text-[#A8987E]">
                    {idx === 0 ? 'Collar' : idx === 1 ? 'Earrings' : 'Kada'}
                  </div>
                </div>
              ))}
            </div>

            {/* Assay Details Matrix */}
            <div className="bg-[#12100E] border border-[#262019] rounded p-4 mb-5 space-y-2 text-xs">
              <div className="flex justify-between text-[#B3A591]">
                <span>Metal Purity:</span>
                <span className="font-mono text-[#FAF8F5] text-right">925 Oxidized Silver (Non-Gold)</span>
              </div>
              <div className="flex justify-between text-[#B3A591]">
                <span>Cumulative Weight:</span>
                <span className="font-mono text-[#FAF8F5] tabular-nums">~{totalWeightGrams.toFixed(1)} grams</span>
              </div>
              <div className="flex justify-between text-[#B3A591]">
                <span>Provenance Guarantee:</span>
                <span className="text-[#6EE7B7] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Hallmarked & Insured
                </span>
              </div>
            </div>

            {/* Financial Summary with 15% Privilege Bundle */}
            <div className="space-y-2 pb-5 border-b border-[#29221A] mb-5 text-xs">
              <div className="flex justify-between text-[#8E806D]">
                <span>Combined Individual Pieces:</span>
                <span className="font-mono line-through tabular-nums">{formatPrice(rawSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#C9A24D] font-medium">
                <span>Ensemble Bundle Privilege (15%):</span>
                <span className="font-mono tabular-nums">-{formatPrice(privilegeSavings)}</span>
              </div>
              <div className="flex justify-between text-base font-serif text-[#FFFDF9] pt-2 border-t border-[#262019]">
                <span>Ensemble Acquisition Total:</span>
                <span className="font-mono font-bold text-lg text-[#F5E6C8] tabular-nums">
                  {formatPrice(finalEnsembleTotal)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddEnsembleToBag}
                className="w-full py-3.5 px-4 bg-[#FAF8F5] hover:bg-[#EAE0CD] text-[#141210] font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Acquire Complete Ensemble ({ensembleItems.length} Pieces)</span>
              </button>

              {ensembleAdded && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded text-center font-medium animate-pulse flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Ensemble added to shopping bag with 15% privilege!
                </div>
              )}

              <p className="text-[11px] text-[#786C5A] text-center italic">
                Includes individual signed certificates of authenticity, tamper-proof vault boxes, and velvet travel pouches for each piece.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
