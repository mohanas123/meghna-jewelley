import React, { useState } from 'react';
import { Award, ShieldCheck, Eye, Lock, ShoppingBag, Check, Compass, Sparkles } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface CollectorVaultSectionProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onOpenSalonModal?: () => void;
}

export const CollectorVaultSection: React.FC<CollectorVaultSectionProps> = ({
  products,
  onOpenProductModal,
  onOpenSalonModal,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [selectedVaultIndex, setSelectedVaultIndex] = useState(0);
  const [acquiredNotice, setAcquiredNotice] = useState<string | null>(null);

  const vaultEditions = [
    {
      id: 'vault-1',
      editionNumber: 'ARCHIVE PIECE 01 OF 03',
      title: 'The Imperial Kapurthala Emerald & Dark Silver Collar',
      era: 'Victorian Sovereign Lineage',
      productId: 'mj-101',
      provenance:
        'Commissioned in homage to the Kapurthala state treasury. Hand-repoussé 925 sterling silver washed in charcoal brine, featuring 14.2 carats of untreated Colombian emerald cabochons and syndicate polki.',
      craftHours: '64 Handcraft Hours',
      assayedWeight: '68.4 grams 925 Silver',
      status: 'Available in Vault',
      image: '/images/emerald_antique_choker.jpg',
    },
    {
      id: 'vault-2',
      editionNumber: 'ARCHIVE PIECE 02 OF 05',
      title: 'The St. Petersburg Art Deco Sapphire Plaque Collar',
      era: 'Parisienne Belle Époque 1925',
      productId: 'mj-104',
      provenance:
        'Inspired by the 1925 Exposition Internationale des Arts Décoratifs in Paris. Geometric baguettes with velvety Ceylon sapphires mounted in mirror-rhodium platinum finish.',
      craftHours: '52 Handcraft Hours',
      assayedWeight: '59.2 grams Precious Alloy',
      status: 'Available in Vault',
      image: '/images/sapphire_artdeco_necklace.jpg',
    },
    {
      id: 'vault-3',
      editionNumber: 'ARCHIVE PIECE 01 OF 01 (SOLITARY)',
      title: 'The Tanjore Peacocks Heritage Nakshi Torc & Cuffs',
      era: 'Classical Temple Masterpiece',
      productId: 'mj-103',
      provenance:
        'A solitary masterpiece chiseled from a single ingot of 925 solid sterling silver. Twin peacocks with cabochon ruby eyes arch across intertwined botanical creepers.',
      craftHours: '78 Handcraft Hours',
      assayedWeight: '88.5 grams 925 Silver',
      status: 'Vault Reserved (1 Remaining)',
      image: '/images/vintage_oxidized_cuff.jpg',
    },
  ];

  const activeVault = vaultEditions[selectedVaultIndex];
  const matchedProduct = products.find((p) => p.id === activeVault.productId);

  const handleAcquire = () => {
    if (matchedProduct) {
      addToCart(matchedProduct, 1);
      setAcquiredNotice(activeVault.title);
      setTimeout(() => setAcquiredNotice(null), 3000);
    }
  };

  return (
    <section id="vault-session" className="bg-[#0B0908] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#241E18]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#241E18]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Numbered Archives Session</span>
              <span aria-hidden="true" className="text-[#65553E]">·</span>
              <span>The Collector's Vault</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
              Rare Numbered One-Of-A-Kind Editions
            </h2>
            <p className="text-xs sm:text-sm text-[#A89C8B] mt-2 max-w-xl leading-relaxed">
              Strictly limited non-gold antique heirlooms with individual archive registration numbers, master silversmith signatures, and velvet presentation cases.
            </p>
          </div>

          {/* Edition Selectors - Zero-Pill compliant */}
          <div className="flex items-center gap-1.5 p-1 bg-[#171411] border border-[#2B231B] rounded-md overflow-x-auto">
            {vaultEditions.map((ed, idx) => {
              const isActive = idx === selectedVaultIndex;
              return (
                <button
                  key={ed.id}
                  onClick={() => setSelectedVaultIndex(idx)}
                  className={`px-3 py-2 text-xs font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#29221A] text-[#FAF8F5] border border-[#524430] shadow-sm font-semibold'
                      : 'text-[#8E806D] hover:text-[#FAF8F5]'
                  }`}
                >
                  {ed.editionNumber.split(' ')[0]} {ed.editionNumber.split(' ')[2]}/{ed.editionNumber.split(' ')[4]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Display Card */}
        <div className="bg-[#14110E] border border-[#2B231B] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
          
          {/* Left: Macro Imagery (6 cols) */}
          <div className="lg:col-span-6 relative aspect-[4/3] lg:aspect-auto min-h-[340px] bg-[#1E1914] overflow-hidden group">
            <img
              src={activeVault.image}
              alt={activeVault.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14110E] via-transparent to-transparent opacity-70" />

            {/* Edition Seal Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-[#8C7449]/50 px-3 py-1.5 rounded-sm">
              <span className="font-mono text-[10px] tracking-widest text-[#E8D9B8] uppercase font-bold">
                {activeVault.editionNumber}
              </span>
            </div>

            {matchedProduct && (
              <button
                onClick={() => onOpenProductModal(matchedProduct)}
                className="absolute bottom-4 right-4 px-3.5 py-2 bg-black/85 hover:bg-black text-[#FAF8F5] text-xs rounded backdrop-blur-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Examine Macro Craftsmanship</span>
              </button>
            )}
          </div>

          {/* Right: Archival Provenance & Acquisition (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A24D] mb-3">
                <span>{activeVault.era}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#6EE7B7]">{activeVault.status}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFDF9] font-normal mb-4 leading-snug">
                {activeVault.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#C4B7A4] font-light leading-relaxed mb-6">
                {activeVault.provenance}
              </p>

              {/* Provenance Metrics Table */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#262019] mb-6 text-xs">
                <div>
                  <span className="text-[#8C7E6C] font-mono text-[10px] uppercase block">
                    Labor Dedication
                  </span>
                  <span className="font-mono text-sm text-[#FAF8F5] font-medium">
                    {activeVault.craftHours}
                  </span>
                </div>
                <div>
                  <span className="text-[#8C7E6C] font-mono text-[10px] uppercase block">
                    Certified Alloy Mass
                  </span>
                  <span className="font-mono text-sm text-[#FAF8F5] font-medium">
                    {activeVault.assayedWeight}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Investment & CTAs */}
            <div>
              {matchedProduct && (
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-xs text-[#8C7E6C] uppercase font-mono tracking-wider">
                    Acquisition Price:
                  </span>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-[#F5E6C8] tabular-nums">
                    {formatPrice(matchedProduct.price)}
                  </span>
                  {matchedProduct.originalPrice && (
                    <span className="font-mono text-xs text-[#6B5E4A] line-through tabular-nums">
                      {formatPrice(matchedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleAcquire}
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#EAE0CD] text-[#141210] font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#141210]" />
                  <span>Acquire Archive Piece</span>
                </button>

                {onOpenSalonModal && (
                  <button
                    onClick={onOpenSalonModal}
                    className="px-5 py-3.5 border border-[#524430] hover:border-[#C9A24D] text-[#D8CEBC] hover:text-[#FAF8F5] font-medium text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Schedule White-Glove Viewing</span>
                  </button>
                )}
              </div>

              {acquiredNotice && (
                <div className="mt-3 p-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded text-center animate-pulse flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Added to your shopping bag!
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
