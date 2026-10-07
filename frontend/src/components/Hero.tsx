import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden bg-[#181614] text-[#FAF8F5]">
      {/* Background imagery with subtle contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_antique_jewellery.jpg"
          alt="Antique 22K Gold Temple Choker and Heirloom Jewellery by Meghna Jewellery"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          {/* Unboxed editorial kicker - strictly adhering to Zero-Pill rule */}
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4C3A3] mb-4 font-medium">
            <span>Chettinad & Bikaner Lineage</span>
            <span aria-hidden="true" className="text-[#98702B]">·</span>
            <span>22K BIS Hallmarked</span>
            <span aria-hidden="true" className="text-[#98702B]">·</span>
            <span>Hand-Carved Nakshi</span>
          </div>

          {/* Balanced Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#FFFDF9] font-normal leading-[1.12] mb-6 [text-wrap:balance]">
            Antique Elegance Reborn for the Modern Connoisseur.
          </h1>

          <p className="text-base sm:text-lg text-[#D6CEBF] font-light leading-relaxed mb-8 max-w-xl">
            From regal nakshi temple chokers depicting sacred iconography to trending multi-strand emerald Jadau Rani Haars, Meghna Jewellery curates timeless heirloom adornments designed to be passed down through generations.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#141210] bg-[#FAF8F5] hover:bg-[#EADDC5] rounded transition-colors flex items-center gap-2.5 shadow-lg whitespace-nowrap cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectCategory('Chokers & Necklaces')}
              className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#FAF8F5] border border-[#FAF8F5]/30 hover:border-[#FAF8F5] hover:bg-white/5 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              Temple Chokers
            </button>
          </div>

          {/* Quiet Trust Attributes */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">916 BIS</div>
              <div className="text-xs text-[#A89C8A] mt-1 font-light">Certified Pure Gold</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">100%</div>
              <div className="text-xs text-[#A89C8A] mt-1 font-light">Artisan Handcrafted</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">Insured</div>
              <div className="text-xs text-[#A89C8A] mt-1 font-light">Doorstep Delivery</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
