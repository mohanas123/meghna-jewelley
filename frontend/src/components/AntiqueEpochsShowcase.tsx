import React, { useState } from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Eye } from 'lucide-react';
import type { Product } from '../types/index.ts';

interface AntiqueEpochsShowcaseProps {
  onSelectCategory: (cat: string) => void;
  onOpenProductModal: (prod: Product) => void;
  products: Product[];
}

export const AntiqueEpochsShowcase: React.FC<AntiqueEpochsShowcaseProps> = ({
  onSelectCategory,
  onOpenProductModal,
  products,
}) => {
  const [activeEpochIndex, setActiveEpochIndex] = useState(0);

  const epochs = [
    {
      id: 'victorian',
      name: 'Victorian Romanticism',
      years: '1837 – 1901',
      tagline: 'Chiaroscuro Darkened Silver & Luminous Emeralds',
      description:
        'Characterized by deeply oxidized 925 sterling silver, dramatic floral repoussé carvings, and radiant cabochon Colombian emeralds encased in hand-chiseled bezels. A dark, moody romance that modern bullion cannot replicate.',
      keyMetals: '925 Solid Sterling Silver with Herbal Charcoal Oxidation',
      signatureGem: 'Natural Colombian Emeralds & Syndicate Polki',
      image: '/images/emerald_antique_choker.jpg',
      category: 'Chokers & Necklaces',
      productId: 'mj-101',
      badge: 'Dark Silver Patina',
    },
    {
      id: 'art-deco',
      name: 'Art Deco High Glamour',
      years: '1920 – 1939',
      tagline: 'Platinum-Finish Rhodium & Royal Ceylon Sapphires',
      description:
        'Sharp rectilinear geometry inspired by Parisian architecture. Brilliant baguette diamond simulants contrast against velvety Ceylon blue sapphires and mirror-polished rhodium platinum-dipped silver for gala sophistication.',
      keyMetals: 'Platinum & Blackened Rhodium Dipped Precious Alloy',
      signatureGem: 'Royal Ceylon Sapphires & Baguette Crystal Prisms',
      image: '/images/sapphire_artdeco_necklace.jpg',
      category: 'Chokers & Necklaces',
      productId: 'mj-104',
      badge: 'Platinum & Rhodium',
    },
    {
      id: 'edwardian',
      name: 'Edwardian Belle Époque',
      years: '1901 – 1915',
      tagline: 'Natural Keshi Baroque Pearls & Foil-Backed Polki',
      description:
        'Lustrous, organic textures celebrated over rigid uniform stones. Cascading multi-tier natural freshwater baroque keshi pearls converge upon hand-engraved antique silver medallions with hand-knotted zardozi cords.',
      keyMetals: 'Fine Silver Filigree with Pure Silk Threading',
      signatureGem: 'Natural Keshi Baroque Pearls & Open Polki Collets',
      image: '/images/baroque_pearl_haar.jpg',
      category: 'Rani Haars',
      productId: 'mj-105',
      badge: 'Baroque Pearls',
    },
    {
      id: 'mughal-antique',
      name: 'Heritage Sculpted Nakshi',
      years: 'Classical Lineage',
      tagline: 'Solid Oxidized Cuffs with Sculpted Peacocks',
      description:
        'Ancient temple sculptural traditions rendered in heavy 925 sterling silver cuffs. Twin peacocks face each other with ruby eyes, emerging from intricate botanical vines chiseled entirely by hand without machine moulds.',
      keyMetals: 'Solid 925 Sterling Core with Vintage Acid Wash',
      signatureGem: 'Cabochon Rubies & Dark Silver Relief',
      image: '/images/vintage_oxidized_cuff.jpg',
      category: 'Bangles & Kadas',
      productId: 'mj-103',
      badge: 'Hand-Chiseled Cuffs',
    },
  ];

  const activeEpoch = epochs[activeEpochIndex];
  const matchingProduct = products.find((p) => p.id === activeEpoch.productId);

  return (
    <section id="epochs-session" className="bg-[#151311] text-[#FAF8F5] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-[#2B2621]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#2B2621]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Historical Provenance</span>
              <span aria-hidden="true" className="text-[#6B5E4A]">·</span>
              <span>Antique Epochs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
              Four Eras of Rare Non-Gold Jewellery
            </h2>
            <p className="text-xs sm:text-sm text-[#A89C8B] mt-2 max-w-xl leading-relaxed">
              Explore the distinct architectural movements that defined antique heirloom adornments — from moody Victorian oxidized silver to the platinum geometry of Art Deco.
            </p>
          </div>

          {/* Epoch Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#201D19] rounded border border-[#383127] overflow-x-auto scrollbar-none max-w-full">
            {epochs.map((ep, idx) => (
              <button
                key={ep.id}
                onClick={() => setActiveEpochIndex(idx)}
                className={`px-3.5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  activeEpochIndex === idx
                    ? 'bg-[#362F24] text-[#F5EFE6] border border-[#594B35] shadow-xs font-semibold'
                    : 'text-[#8A7D69] hover:text-[#FAF8F5]'
                }`}
              >
                {ep.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Epoch Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Epoch Artwork Frame */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-square bg-[#221E19] rounded-sm overflow-hidden border border-[#3E362A] shadow-2xl relative cursor-pointer"
              onClick={() => {
                if (matchingProduct) onOpenProductModal(matchingProduct);
              }}
            >
              <img
                src={activeEpoch.image}
                alt={activeEpoch.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

              {/* Float badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-widest text-[#C9A24D]">
                    {activeEpoch.years}
                  </div>
                  <div className="font-serif text-lg text-white font-medium">
                    {activeEpoch.badge}
                  </div>
                </div>

                <span className="px-3 py-1.5 bg-black/60 backdrop-blur-xs rounded text-[11px] text-[#F0EAE1] border border-white/15 flex items-center gap-1.5 group-hover:border-[#C9A24D]">
                  <Eye className="w-3.5 h-3.5 text-[#C9A24D]" />
                  <span>Inspect Piece</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Curatorial Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-[#C9A24D]">
                Epoch Provenance · {activeEpoch.years}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFFDF9] font-normal leading-tight">
                {activeEpoch.name}
              </h3>
              <p className="text-sm font-medium text-[#D1C3A5]">
                {activeEpoch.tagline}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#A89B88] leading-relaxed">
              {activeEpoch.description}
            </p>

            {/* Curatorial Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#1F1B16] border border-[#332B20] rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7D68] block">
                  Precious Metal Formulation
                </span>
                <span className="text-xs font-medium text-[#EBE3D5]">
                  {activeEpoch.keyMetals}
                </span>
              </div>

              <div className="p-4 bg-[#1F1B16] border border-[#332B20] rounded-sm space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C7D68] block">
                  Signature Gemstone Setting
                </span>
                <span className="text-xs font-medium text-[#EBE3D5]">
                  {activeEpoch.signatureGem}
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              {matchingProduct && (
                <button
                  onClick={() => onOpenProductModal(matchingProduct)}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#141210] bg-[#FAF8F5] hover:bg-[#E8DCBF] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>View Epoch Masterpiece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => onSelectCategory(activeEpoch.category)}
                className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#D1C5B0] border border-[#443829] hover:border-[#8C754D] hover:text-white rounded transition-colors cursor-pointer"
              >
                Browse All {activeEpoch.category}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
