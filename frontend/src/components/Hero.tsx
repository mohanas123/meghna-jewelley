import React from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: string) => void;
  onSelectEra?: (era: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onSelectCategory, onSelectEra }) => {
  return (
    <section className="relative overflow-hidden bg-[#12100E] text-[#FAF8F5]">
      {/* Background imagery with subtle contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_fancy_antique.jpg"
          alt="Fancy and Antique Non-Gold Jewellery, Victorian 925 Oxidized Silver and Colombian Emeralds by Meghna Jewellery"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
          }}
          className="w-full h-full object-cover object-center opacity-70 scale-102 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E0C0B] via-[#0E0C0B]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B] via-transparent to-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
        <div className="max-w-2xl">
          {/* Unboxed editorial kicker - strictly adhering to Zero-Pill rule */}
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#D8CEBC] mb-4 font-medium">
            <span>Haute Joaillerie & Antique Salon</span>
            <span aria-hidden="true" className="text-[#C9A24D]">·</span>
            <span>925 Oxidized Silver & Platinum Finish</span>
            <span aria-hidden="true" className="text-[#C9A24D]">·</span>
            <span>Non-Gold Precious Heirlooms</span>
          </div>

          {/* Balanced Display Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#FFFDF9] font-normal leading-[1.12] mb-6 [text-wrap:balance]">
            Fancy & Antique Heirlooms. The Poetry of Rare Non-Gold Adornments.
          </h1>

          <p className="text-base sm:text-lg text-[#DDD5C5] font-light leading-relaxed mb-8 max-w-xl">
            Step beyond conventional yellow gold. Meghna Jewellery curates museum-grade Victorian oxidized 925 silver collars, Art Deco platinum-finish Ceylon sapphires, and royal Colombian emerald chokers hand-forged with enduring vintage chiaroscuro patina.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#141210] bg-[#FAF8F5] hover:bg-[#EAE0CD] rounded transition-colors flex items-center gap-2.5 shadow-lg whitespace-nowrap cursor-pointer"
            >
              <span>Explore Antique Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectCategory('Chokers & Necklaces')}
              className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#FAF8F5] border border-[#FAF8F5]/30 hover:border-[#FAF8F5] hover:bg-white/5 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              Victorian Collars
            </button>
            <button
              onClick={() => onSelectCategory('Earrings & Jhumkas')}
              className="px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-[#D4C3A3] border border-[#D4C3A3]/30 hover:border-[#D4C3A3] hover:bg-white/5 rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              Blackened Jhumkas
            </button>
          </div>

          {/* Quiet Trust Attributes */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">925 Silver</div>
              <div className="text-xs text-[#B3A591] mt-1 font-light">Assay Certified Metal</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">Antique</div>
              <div className="text-xs text-[#B3A591] mt-1 font-light">Chiaroscuro Dark Patina</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-serif text-[#FFFDF9] font-medium font-mono tabular-nums">Armored</div>
              <div className="text-xs text-[#B3A591] mt-1 font-light">Insured Doorstep Courier</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
