import React, { useState } from 'react';
import { BookOpen, Sparkles, Check, X, ShieldCheck, Compass, Gem, Layers } from 'lucide-react';

export const GoldVsAntiquePhilosophy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patina' | 'gemstones' | 'craft' | 'versatility'>('patina');

  const comparisonData = {
    patina: {
      title: 'Chiaroscuro Depth vs. Flat Mirror Glare',
      antiqueHeadline: 'Deep Herbal Oxidation & Three-Dimensional Shadows',
      antiqueBody:
        'Antique non-gold jewellery uses proprietary herbal and charcoal washes to oxidize the micro-crevices of 925 sterling silver. This creates the Renaissance chiaroscuro effect — where dark receding shadows make the raised relief figures and floral scrolls dramatically pop forward in three dimensions.',
      goldHeadline: 'Monolithic Reflective High-Noon Glare',
      goldBody:
        'Standard yellow gold reflects light uniformly across all surfaces. Fine hand-carved details, repoussé textures, and subtle artisan chisel marks are frequently washed out by the yellow glare, resulting in a flat visual presence in photos and dim evening light.',
      metricAntique: 'High-contrast 3D sculptural relief',
      metricGold: 'Flat uniform metallic glare',
    },
    gemstones: {
      title: 'Gemstone Luminescence: Green, Blue & Polki Brilliance',
      antiqueHeadline: 'Blackened Mounts Magnify Saturated Color Saturation',
      antiqueBody:
        'When deep green Colombian emerald cabochons or velvety royal Ceylon blue sapphires are set in darkened antique silver prongs, the optical contrast is breathtaking. The dark border functions like an artist’s frame, making emeralds appear 3x more vibrant and glowing with interior fire.',
      goldHeadline: 'Yellow Undertones Bleed into Cold Gemstones',
      goldBody:
        'Yellow gold bezels cast a warm yellowish reflection into cool green emeralds and blue sapphires, altering their genuine color grading. Polki diamonds can appear yellowish when set in plain yellow gold without silver foil backing.',
      metricAntique: 'True color gem fidelity & candleglow fire',
      metricGold: 'Yellow tint contamination on cool gems',
    },
    craft: {
      title: 'Repoussé Artisan Mastery vs. Industrial Die-Casting',
      antiqueHeadline: '50+ Hours of Single-Artisan Chisel Strokes',
      antiqueBody:
        'Antique jewellery is forged through the ancient art of Nakshi and Repoussé — hand-hammering malleable 925 sterling sheets over tree resin beds with tiny chasing tools. No two pieces are ever identical; each carries the rhythm and breath of a master metalsmith.',
      goldHeadline: 'Computerised Moulds & Fast-Fashion Bullion',
      goldBody:
        'Much of modern commercial yellow gold is produced via centrifugal machine casting and CAD 3D waxes designed for rapid mass manufacturing and bullion resale value rather than museum-level sculptural poetry.',
      metricAntique: 'One-of-a-kind heritage provenance',
      metricGold: 'Standardized mass-replicated designs',
    },
    versatility: {
      title: 'Haute Couture Versatility: Western Gowns & Imperial Silks',
      antiqueHeadline: 'Effortless Fusion: Black-Tie Gala to Royal Sangeet',
      antiqueBody:
        'Fancy antique oxidized silver and platinum-finish jewels possess an understated, worldly neutrality. A Victorian emerald choker looks equally stunning with a tailored black velvet tuxedo or Saint Laurent gown as it does with a 200-year-old heirloom Banarasi saree.',
      goldHeadline: 'Restricted Primarily to Traditional Ceremony',
      goldBody:
        'Heavy bright yellow gold sets are notoriously difficult to style with modern western formalwear, cocktail dresses, or contemporary minimalist aesthetics, often remaining locked away in bank vaults between family weddings.',
      metricAntique: '365-day gala and cocktail versatility',
      metricGold: 'Infrequent ritual-only wearability',
    },
  };

  const current = comparisonData[activeTab];

  return (
    <section id="philosophy-session" className="bg-[#0C0A09] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#241E18]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span>The Connoisseur Manifesto</span>
            <span aria-hidden="true" className="text-[#685741]">·</span>
            <span>Patina Over Bullion</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
            Why True Connoisseurs Choose Fancy Antique Jewellery Over Gold
          </h2>
          <p className="text-xs sm:text-sm text-[#A89C8B] mt-3 leading-relaxed">
            In royal European courts and princely Indian estates, yellow bullion was melted for currency, while the greatest master silversmiths crafted high jewelry in oxidized precious silver and platinum for sovereign collections.
          </p>
        </div>

        {/* Tab Controls - Zero-Pill Compliant */}
        <div className="flex justify-center mb-10 overflow-x-auto">
          <div className="inline-flex items-center p-1 bg-[#171411] border border-[#2B231B] rounded-md">
            {[
              { id: 'patina', label: '1. Chiaroscuro Patina' },
              { id: 'gemstones', label: '2. Gemstone Luminescence' },
              { id: 'craft', label: '3. Hand-Chiseled Artistry' },
              { id: 'versatility', label: '4. Couture Versatility' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 sm:px-5 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#29221A] text-[#FAF8F5] border border-[#524430] shadow-sm'
                      : 'text-[#8E806D] hover:text-[#FAF8F5]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Grid (Side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card A: Meghna Antique & Fancy Jewellery (Featured) */}
          <div className="bg-gradient-to-b from-[#1A1612] to-[#14110E] border-2 border-[#8C7449]/70 rounded-sm p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A24D] font-bold">
                  Meghna Antique & Fancy Heirlooms (925 Non-Gold)
                </span>
                <span className="w-6 h-6 rounded-full bg-[#29221A] border border-[#C9A24D] flex items-center justify-center text-[#C9A24D]">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-serif text-2xl font-normal text-[#FFFDF9] mb-3 leading-snug">
                {current.antiqueHeadline}
              </h3>

              <p className="text-xs sm:text-sm text-[#C4B7A4] font-light leading-relaxed mb-6">
                {current.antiqueBody}
              </p>
            </div>

            <div className="pt-4 border-t border-[#332A20] relative z-10 flex items-center justify-between">
              <span className="text-[11px] text-[#A8987E]">Hallmark Characteristic:</span>
              <span className="text-xs font-serif font-medium text-[#F2E5C8]">{current.metricAntique}</span>
            </div>

            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A24D]/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Card B: Standard Yellow Gold Bullion */}
          <div className="bg-[#12100E] border border-[#262019] rounded-sm p-6 sm:p-8 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#786C5A] font-medium">
                  Conventional Yellow Gold Bullion
                </span>
                <span className="w-6 h-6 rounded-full bg-[#1A1714] border border-[#332B22] flex items-center justify-center text-[#8C7E6C]">
                  <X className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-serif text-2xl font-normal text-[#D4C8B8] mb-3 leading-snug">
                {current.goldHeadline}
              </h3>

              <p className="text-xs sm:text-sm text-[#8E8272] font-light leading-relaxed mb-6">
                {current.goldBody}
              </p>
            </div>

            <div className="pt-4 border-t border-[#262019] flex items-center justify-between">
              <span className="text-[11px] text-[#6E6353]">Conventional Limitation:</span>
              <span className="text-xs font-serif text-[#A89C8B]">{current.metricGold}</span>
            </div>
          </div>

        </div>

        {/* Connoisseur Seal of Assay */}
        <div className="mt-12 p-6 bg-[#171411] border border-[#2B231B] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A89C8B]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C9A24D] shrink-0" />
            <span>
              All pieces hallmarked under international assay protocols for 925 sterling silver purity, platinum-rhodium finish, and natural gemstone certification. Zero commercial gold alloys utilized.
            </span>
          </div>
          <div className="font-mono text-[11px] text-[#C9A24D] whitespace-nowrap">
            Assay Reg: MJ-ATELIER-2026
          </div>
        </div>

      </div>
    </section>
  );
};
