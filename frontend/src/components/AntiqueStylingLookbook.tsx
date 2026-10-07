import React, { useState } from 'react';
import { Sparkles, ArrowRight, Eye, Check, Palette, Compass, ShoppingBag } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface AntiqueStylingLookbookProps {
  products: Product[];
  onOpenProductModal: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

interface LookbookMood {
  id: string;
  title: string;
  era: string;
  subtitle: string;
  quote: string;
  paletteName: string;
  paletteColors: { name: string; hex: string }[];
  dressCode: string;
  lightingNotes: string;
  recommendedProductIds: string[];
  bannerImage: string;
}

export const AntiqueStylingLookbook: React.FC<AntiqueStylingLookbookProps> = ({
  products,
  onOpenProductModal,
  onSelectCategory,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [activeMoodIndex, setActiveMoodIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const moods: LookbookMood[] = [
    {
      id: 'victorian-midnight',
      title: 'Victorian Midnight Soirée',
      era: 'Circa 1880 · Gothic Romance',
      subtitle: 'Oxidized 925 Sterling Silver, Dark Patina & Glowing Colombian Emeralds',
      quote:
        '“In the twilight glow of candelabras, yellow gold glares; but antique oxidized silver whispers stories of dynastic grandeur with shadows as deep as velvet.”',
      paletteName: 'Obsidian Noir & Royal Verdigris',
      paletteColors: [
        { name: 'Oxidized 925 Silver', hex: '#2A2927' },
        { name: 'Colombian Emerald', hex: '#0B4632' },
        { name: 'Velvet Midnight', hex: '#111818' },
        { name: 'Antique Platinum Sheen', hex: '#D6D3CD' },
      ],
      dressCode: 'Emerald Velvet Lehengas, Noir Evening Gowns, High-Neck Victoriana Blouses',
      lightingNotes: 'Dim chandelier, candlelight, evening gala ambient glow',
      recommendedProductIds: ['mj-101', 'mj-102', 'mj-103'],
      bannerImage: '/images/emerald_antique_choker.jpg',
    },
    {
      id: 'artdeco-glamour',
      title: 'Art Deco Parisienne Ballroom',
      era: 'Circa 1925 · Roaring Gala Haute Joaillerie',
      subtitle: 'Platinum-Finish Rhodium, Geometric Baguettes & Velvety Ceylon Sapphires',
      quote:
        '“Architectural precision carved into fine silver and sealed in platinum rhodium. A modern non-gold symphony of baguettes and sapphires designed for grand opera entrances.”',
      paletteName: 'Rhodium Platinum & Royal Ceylon Blue',
      paletteColors: [
        { name: 'Mirror Rhodium', hex: '#E5E7EB' },
        { name: 'Ceylon Royal Blue', hex: '#1E3A8A' },
        { name: 'Noir Obsidian', hex: '#1C1917' },
        { name: 'Prism Crystal', hex: '#F3F4F6' },
      ],
      dressCode: 'Backless Silk Charmeuse Gowns, Tuxedo Jackets, Sapphire Cocktail Ensembles',
      lightingNotes: 'Crystalline ballroom chandeliers, direct flash photography',
      recommendedProductIds: ['mj-104', 'mj-102', 'mj-103'],
      bannerImage: '/images/sapphire_artdeco_necklace.jpg',
    },
    {
      id: 'baroque-renaissance',
      title: 'Baroque Court of the Medici',
      era: 'Circa 1690 · Organic Luminescence',
      subtitle: 'Natural Keshi Baroque Pearls, Syndicate Polki Collets & Silk Zardozi',
      quote:
        '“Reject the cold uniformity of manufactured gold links. Embrace the poetry of imperfect natural keshi pearls strung on hand-braided antique metallic cords.”',
      paletteName: 'Champagne Baroque & Raw Polki Silver',
      paletteColors: [
        { name: 'Baroque Keshi Pearl', hex: '#FDFBF7' },
        { name: 'Muted Antique Gold-Silver Cord', hex: '#A8946E' },
        { name: 'Syndicate Polki Foil', hex: '#D1D5DB' },
        { name: 'Raw Ivory Silk', hex: '#EFECE6' },
      ],
      dressCode: 'Ivory Raw Silk Angrakhas, Organza Sarees, Vintage Cashmere Shawls',
      lightingNotes: 'Warm golden hour sunlight, intimate courtyard dining',
      recommendedProductIds: ['mj-105', 'mj-101', 'mj-106'],
      bannerImage: '/images/baroque_pearl_haar.jpg',
    },
    {
      id: 'nakshi-temple',
      title: 'Sculpted Nakshi Royal Darbar',
      era: 'Classical Lineage · Hand-Chiseled Relics',
      subtitle: 'Solid 925 Oxidized Silver Peacocks, Cabochon Rubies & Botanical Vines',
      quote:
        '“Not poured from a modern mould, but chiseled line-by-line over 60 artisan hours. The peacock cuffs and temple collars celebrate South Asian sculptural mastery in solid sterling silver.”',
      paletteName: 'Chiseled Pewter & Pigeon Blood Ruby',
      paletteColors: [
        { name: 'Sculpted Pewter Silver', hex: '#374151' },
        { name: 'Cabochon Ruby', hex: '#831843' },
        { name: 'Vintage Acid Wash', hex: '#1F2937' },
        { name: 'Herbal Matte Patina', hex: '#6B7280' },
      ],
      dressCode: 'Handwoven Kanjeevarams, Heritage Banarasi Silks, Aristocratic Sherwanis',
      lightingNotes: 'Traditional oil lamp (Diya) illumination, mandap firelight',
      recommendedProductIds: ['mj-103', 'mj-106', 'mj-102'],
      bannerImage: '/images/vintage_oxidized_cuff.jpg',
    },
  ];

  const currentMood = moods[activeMoodIndex];

  // Retrieve products for this look
  const lookProducts = currentMood.recommendedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const handleAddLookToBag = () => {
    lookProducts.forEach((item) => {
      addToCart(item, 1);
    });
    setAddedNotice(currentMood.title);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  return (
    <section id="lookbook-session" className="bg-[#0F0D0C] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#241F1A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#241F1A]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
              <Palette className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Curator Lookbook Session</span>
              <span aria-hidden="true" className="text-[#65553E]">·</span>
              <span>Antique & Fancy Aesthetics</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
              Haute Styling Moodboards
            </h2>
            <p className="text-xs sm:text-sm text-[#A89C8B] mt-2 max-w-xl leading-relaxed">
              Experience how world-class stylists and royalty pair fancy antique non-gold jewellery with couture wardrobes for maximum drama and sophistication.
            </p>
          </div>

          {/* Moodboard Selector Tabs - Zero-Pill Compliant */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1A1714] border border-[#2B251E] rounded-md overflow-x-auto max-w-full">
            {moods.map((mood, idx) => {
              const isActive = idx === activeMoodIndex;
              return (
                <button
                  key={mood.id}
                  onClick={() => setActiveMoodIndex(idx)}
                  className={`px-3 sm:px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#29231B] text-[#FFFDF9] border border-[#524430] shadow-sm'
                      : 'text-[#8E806D] hover:text-[#FAF8F5]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#C9A24D] mr-1.5">0{idx + 1}</span>
                  {mood.title.split(' ')[0]} {mood.title.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Lookbook Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Hero Mood Display (5 cols) */}
          <div className="lg:col-span-5 bg-[#171411] border border-[#2E271F] rounded-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#C9A24D] mb-3">
                <span>{currentMood.era}</span>
                <span aria-hidden="true">·</span>
                <span>Haute Ensemble</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFFDF9] font-normal mb-3 leading-snug">
                {currentMood.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#C4B7A4] font-light leading-relaxed mb-6">
                {currentMood.subtitle}
              </p>

              {/* Editorial Quote */}
              <blockquote className="border-l-2 border-[#8C7449] pl-4 py-1 italic text-xs text-[#9E8F7C] mb-6 leading-relaxed">
                {currentMood.quote}
              </blockquote>

              {/* Color Palette Swatches */}
              <div className="mb-6 pt-5 border-t border-[#2B241C]">
                <div className="text-[11px] uppercase tracking-wider font-mono text-[#8C7449] mb-2.5">
                  Artisan Palette · {currentMood.paletteName}
                </div>
                <div className="flex items-center gap-3">
                  {currentMood.paletteColors.map((col, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-1.5" title={col.name}>
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 inline-block shadow-inner"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] text-[#A69783] hidden sm:inline">{col.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Styling Advice Cards */}
              <div className="space-y-3 pt-4 border-t border-[#2B241C] text-xs">
                <div>
                  <span className="text-[#8C7449] font-medium block text-[10px] uppercase tracking-wider">Couture Pairing</span>
                  <p className="text-[#C4B7A4] mt-0.5">{currentMood.dressCode}</p>
                </div>
                <div>
                  <span className="text-[#8C7449] font-medium block text-[10px] uppercase tracking-wider">Optimal Lighting Atmosphere</span>
                  <p className="text-[#A39480] mt-0.5">{currentMood.lightingNotes}</p>
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-8 pt-6 border-t border-[#2B241C] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-10">
              <button
                onClick={handleAddLookToBag}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider bg-[#FAF8F5] hover:bg-[#EAE0CD] text-[#141210] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#141210]" />
                <span>Acquire Full Look ({lookProducts.length} Pieces)</span>
              </button>
              {addedNotice && (
                <span className="text-xs text-[#6EE7B7] flex items-center justify-center gap-1 animate-pulse font-medium">
                  <Check className="w-3.5 h-3.5" /> Added to bag!
                </span>
              )}
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#C9A24D]/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right: Curated Jewelry Pieces Grid (7 cols) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest font-mono text-[#A89C8B]">
                Curated Vault Pieces for This Aesthetic ({lookProducts.length})
              </span>
              <button
                onClick={() => onSelectCategory('All Jewellery')}
                className="text-xs text-[#C9A24D] hover:text-[#FAF8F5] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lookProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="bg-[#171411] border border-[#28221B] hover:border-[#8C7449] rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-[#221D18] overflow-hidden">
                      <img
                        src={product.images[0] || '/images/hero_antique_jewellery.jpg'}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171411] via-transparent to-transparent opacity-60" />
                      
                      {/* Floating Quick Action */}
                      <button
                        onClick={() => onOpenProductModal(product)}
                        className="absolute bottom-2.5 right-2.5 px-2.5 py-1.5 bg-black/75 hover:bg-black text-[#FAF8F5] text-[11px] rounded backdrop-blur-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        {/* Unboxed Metadata Tag */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#A8987E] mb-1.5">
                          <span>{product.purity.includes('925') ? '925 Silver' : 'Platinum Finish'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#C9A24D]">{product.category}</span>
                        </div>

                        <h4 className="font-serif text-sm font-medium text-[#FAF8F5] leading-snug line-clamp-2 mb-1 group-hover:text-[#D4AF37] transition-colors">
                          {product.name}
                        </h4>

                        <p className="text-[11px] text-[#8E806D] line-clamp-2 leading-relaxed mb-3">
                          {product.gemstones}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#262019] flex items-center justify-between">
                        <div>
                          <div className="font-mono text-xs font-semibold text-[#FFFDF9] tabular-nums">
                            {formatPrice(product.price)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-[10px] font-mono text-[#786C5A] line-through tabular-nums">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product, 1)}
                          className="p-2 text-[#C9A24D] hover:text-[#FAF8F5] hover:bg-[#2A231B] rounded transition-colors cursor-pointer"
                          title="Add piece to bag"
                          aria-label={`Add ${product.name} to bag`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lookbook Styling Advisory Note */}
            <div className="mt-6 p-4 bg-[#14110E] border border-[#2B231A] rounded-sm flex items-start gap-3 text-xs text-[#9E8F7C]">
              <Compass className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#C9A24D] font-medium">Bespoke Atelier Advisory:</span> You can mix elements across eras or request custom adjustments (such as lengthening the zardozi silk cord or adding matching ear drops). Contact our salon concierge for one-on-one virtual curation.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
