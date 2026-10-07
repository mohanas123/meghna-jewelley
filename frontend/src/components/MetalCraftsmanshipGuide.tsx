import React from 'react';
import { ShieldCheck, Gem, Sparkles, Award, Layers, Feather, Droplets, CheckCircle2 } from 'lucide-react';

export const MetalCraftsmanshipGuide: React.FC = () => {
  const pillars = [
    {
      icon: Layers,
      title: 'Chiaroscuro Antique Patina',
      desc: 'Unlike yellow gold that reflects flat high-noon glare, our antique 925 sterling silver is treated with an organic herbal oxidation wash. This darkens recessed engravings to create dramatic three-dimensional relief shadows.',
      badge: 'Visual Depth',
    },
    {
      icon: Gem,
      title: 'Silver-Foil Daak Polki Setting',
      desc: 'Each syndicate polki diamond slice is set over micro-hammered silver foil (daak) within pure collets. The reflective foil magnifies natural candlelight, giving each uncut diamond an ethereal moonlight glow.',
      badge: 'Royal Mughal Heritage',
    },
    {
      icon: Feather,
      title: 'Sculptural Grandeur Without Weight',
      desc: 'Bold, multi-tier Victorian collars and heavy peacock kadas can be sculpted with architectural density in 925 sterling silver while maintaining balanced neck and wrist ergonomics for whole-evening celebrations.',
      badge: 'Ergonomic Luxury',
    },
    {
      icon: Droplets,
      title: 'Hypoallergenic Platinum Protection',
      desc: 'All non-gold alloys and silver components undergo a pure platinum-group rhodium dip. This barrier ensures 100% nickel-free hypoallergenic skin comfort and guards against atmospheric tarnishing.',
      badge: 'Certified Skin-Safe',
    },
  ];

  return (
    <section className="bg-[#12100E] text-[#FAF8F5] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#29241E]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
            <Award className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span>Curatorial Connoisseur Guide</span>
            <span aria-hidden="true" className="text-[#6E604B]">·</span>
            <span>Non-Gold Fine Jewellery</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
            Why Connoisseurs Choose Antique Non-Gold Metals
          </h2>
          <p className="text-xs sm:text-sm text-[#A39684] mt-3 leading-relaxed">
            The world’s most celebrated royal dynasties — from Queen Victoria to the Maharanis of Kapurthala — favored oxidized silver, platinum mounts, and foil-backed polki over plain yellow gold for their sculptural drama and colored gemstone brilliance.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#1A1714] border border-[#2F2820] hover:border-[#8C7449] p-6 rounded-sm flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#25201A] border border-[#443828] flex items-center justify-center text-[#C9A24D] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#9E8E76]">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#F2EDE4] mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#9E907D] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#26211B] flex items-center gap-1.5 text-[11px] text-[#C9A24D]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Artisan Certified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assay & Authenticity Card */}
        <div className="mt-14 bg-gradient-to-r from-[#1C1814] via-[#221D17] to-[#1C1814] border border-[#423728] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#14120F] border border-[#6B5A3C] flex items-center justify-center text-[#C9A24D] shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-xl font-medium text-[#FAF8F5]">
                Individual Metallurgical Assay Certificate
              </h4>
              <p className="text-xs text-[#A89B88] mt-1 max-w-2xl leading-relaxed">
                Every Meghna Jewellery piece ships with a signed archival certificate verifying 925 sterling silver assay fineness, gemstone carat weights, and individual piece registration number for lifetime exchange and provenance documentation.
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-mono text-xs text-[#C9A24D] font-bold tracking-widest uppercase">
              Assay 925 / Platinum
            </div>
            <div className="text-[11px] text-[#8C7E6A] mt-0.5">
              Government Bureau Verified
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
