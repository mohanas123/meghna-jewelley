import React, { useState, useMemo } from 'react';
import { Heart, ShoppingBag, Eye, Search, Sparkles, Flame, Check, Tag } from 'lucide-react';
import type { Product } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenProductModal: (product: Product) => void;
  onOpenWishlist?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading?: boolean;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onOpenProductModal,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  loading = false,
}) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, wishlistIds, simulatePriceDrop, checkPriceDrops } = useWishlist();

  const [activeFilterTag, setActiveFilterTag] = useState<'all' | 'offers' | 'trending' | 'antique'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Check for price drops on wishlist pieces whenever products update
  React.useEffect(() => {
    if (products.length > 0 && wishlistIds.length > 0) {
      checkPriceDrops(products, onOpenProductModal);
    }
  }, [products, wishlistIds, checkPriceDrops, onOpenProductModal]);

  const categories = [
    { label: 'All Heirlooms', value: 'All Jewellery' },
    { label: 'Chokers & Necklaces', value: 'Chokers & Necklaces' },
    { label: 'Earrings & Jhumkas', value: 'Earrings & Jhumkas' },
    { label: 'Bangles & Kadas', value: 'Bangles & Kadas' },
    { label: 'Rani Haars', value: 'Rani Haars' },
    { label: 'Bridal Sets', value: 'Bridal Sets' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Wishlist view filter
    if (selectedCategory === 'wishlist') {
      list = list.filter((p) => wishlistIds.includes(p.id));
    } else if (selectedCategory !== 'All Jewellery' && selectedCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter tags: offers, trending, antique
    if (activeFilterTag === 'offers') {
      list = list.filter((p) => Boolean(p.offerBadge) || (p.originalPrice && p.originalPrice > p.price));
    } else if (activeFilterTag === 'antique') {
      list = list.filter((p) => p.isAntique);
    } else if (activeFilterTag === 'trending') {
      list = list.filter((p) => p.isTrending);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.gemstones.toLowerCase().includes(q) ||
          p.purity.toLowerCase().includes(q) ||
          (p.offerBadge && p.offerBadge.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      });
    } else {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, activeFilterTag, searchQuery, sortBy, wishlistIds]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    toggleWishlist(product, onOpenWishlist || (() => onSelectCategory('wishlist')));
  };

  const handleSimulatePriceDropClick = () => {
    // Pick first wishlist product, or first product in catalog
    const target = products.find((p) => wishlistIds.includes(p.id)) || products[0];
    if (target) {
      simulatePriceDrop(target, 20000, onOpenProductModal);
    }
  };

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header section with clean typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#8C764D] font-medium mb-1.5">
            {selectedCategory === 'wishlist' ? 'Your Curated Wishlist' : 'Heirloom & Trending Gallery'}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1E1B18] font-normal [text-wrap:balance]">
            {selectedCategory === 'wishlist' ? 'Saved Heirloom Pieces' : 'The Meghna Antique Vault'}
          </h2>
          <p className="text-sm text-[#665D52] mt-2 max-w-xl">
            Each artifact is individually hallmarked, weighing 22K pure antique gold with uncut syndicate polki, natural rubies, and celebratory offer pricing.
          </p>
          {selectedCategory === 'wishlist' && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {onOpenWishlist && (
                <button
                  onClick={onOpenWishlist}
                  className="px-3.5 py-1.5 bg-[#1E1B18] text-white hover:bg-[#383129] rounded text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-[#C9A24D]" />
                  <span>Open Full Wishlist Modal</span>
                </button>
              )}
              <button
                onClick={handleSimulatePriceDropClick}
                className="px-3 py-1.5 bg-white border border-[#C9A24D] text-[#8B6523] hover:bg-[#F7F2E7] rounded text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Test live price drop alert toast notification"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>Test Price Drop Notification</span>
              </button>
            </div>
          )}
        </div>

        {/* Search input & Sort controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search temple, offer, ruby..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#DDD5C7] rounded text-xs text-[#1E1B18] placeholder-[#9E9382] focus:outline-none focus:border-[#98702B]"
            />
            <Search className="w-3.5 h-3.5 text-[#9E9382] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-xs text-[#9E9382] hover:text-[#1E1B18] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#DDD5C7] rounded px-3 py-1.5">
            <span className="text-xs text-[#7A6E5E] whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-[#1E1B18] font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="discount">Biggest Discount</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Category Segmented Tabs */}
      {selectedCategory !== 'wishlist' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory(cat.value)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#1E1B18] text-[#FAF8F5]'
                      : 'bg-white border border-[#E2DBD0] text-[#554D42] hover:text-[#1E1B18] hover:border-[#C4B9A7]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Filter: All vs Festive Offers vs Trending vs Antique */}
          <div className="flex items-center gap-1 p-0.5 bg-[#EFE9DF] rounded text-xs shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveFilterTag('all')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeFilterTag === 'all'
                  ? 'bg-white text-[#1E1B18] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1E1B18]'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveFilterTag('offers')}
              className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilterTag === 'offers'
                  ? 'bg-white text-[#98702B] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1E1B18]'
              }`}
            >
              <Tag className="w-3 h-3 text-[#B88728]" />
              <span>Offers & Deals</span>
            </button>
            <button
              onClick={() => setActiveFilterTag('trending')}
              className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilterTag === 'trending'
                  ? 'bg-white text-[#98702B] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1E1B18]'
              }`}
            >
              <Flame className="w-3 h-3 text-[#B88728]" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setActiveFilterTag('antique')}
              className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeFilterTag === 'antique'
                  ? 'bg-white text-[#1E1B18] shadow-xs'
                  : 'text-[#6C6356] hover:text-[#1E1B18]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#7A6B53]" />
              <span>Antiques</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#C9A24D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#8A7E6E] mt-3">Fetching Meghna Jewellery vault...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-white border border-[#E8E2D8] rounded-lg p-8 max-w-lg mx-auto">
          <p className="font-serif text-xl text-[#2B2620]">No jewellery matching your selection</p>
          <p className="text-xs text-[#7A6E5E] mt-2 mb-5">
            Try adjusting your search query or reset filters to browse the complete vault.
          </p>
          <button
            onClick={() => {
              onSelectCategory('All Jewellery');
              onSearchChange('');
              setActiveFilterTag('all');
            }}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#3E372E] rounded transition-colors"
          >
            Show All Heirlooms
          </button>
        </div>
      )}

      {/* Product Cards Grid: 3-column desktop baseline */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const isJustAdded = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onOpenProductModal(product)}
                className="group bg-white border border-[#EAE3D6] rounded-sm overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#D1C5B0] hover:-translate-y-0.5"
              >
                {/* Product Imagery */}
                <div className="relative aspect-[4/3] bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={product.images[0] || '/images/hero_antique_jewellery.jpg'}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/hero_antique_jewellery.jpg';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Top tags: Offer badges and trending flags */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                    {product.offerBadge ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#98702B] bg-[#FAF8F5]/95 backdrop-blur-xs px-2.5 py-0.5 rounded shadow-2xs border border-[#E0D4BE]">
                        {product.offerBadge}
                      </span>
                    ) : product.isTrending ? (
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#98702B] bg-[#FAF8F5]/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-2xs">
                        Trending
                      </span>
                    ) : null}

                    {product.stockCount <= 3 && product.stockCount > 0 && (
                      <span className="text-[10px] uppercase tracking-wider text-[#8A4A28] bg-[#FAF8F5]/90 backdrop-blur-xs px-2 py-0.5 rounded-xs">
                        Only {product.stockCount} left
                      </span>
                    )}
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full text-[#4A433A] hover:text-[#98702B] transition-colors shadow-2xs z-10 cursor-pointer"
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart
                      className={`w-4 h-4 ${inWishlist ? 'fill-[#98702B] text-[#98702B]' : ''}`}
                    />
                  </button>

                  {/* Quick-view overlay on hover */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="px-3.5 py-1.5 text-xs font-medium text-[#1E1B18] bg-[#FAF8F5] rounded shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#98702B]" />
                      <span>View Craftsmanship</span>
                    </span>
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Zero-Pill unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-2 text-[11px] text-[#7E7465] mb-2 font-medium">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{product.weight}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#8C6D33]">925 Silver (Non-Gold)</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-serif text-lg font-medium text-[#1E1B18] leading-snug group-hover:text-[#98702B] transition-colors">
                      {product.name}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-[#6B6254] mt-1.5 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Pricing and Action row */}
                  <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono tabular-nums text-base font-bold text-[#1E1B18]">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="font-mono tabular-nums text-xs text-[#9B9080] line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#2E6B47] font-medium block">
                        Complimentary Insured Courier
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`px-3 py-2 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isJustAdded
                          ? 'bg-[#2E6B47] text-white'
                          : 'bg-[#1E1B18] hover:bg-[#3A332B] text-white'
                      }`}
                      aria-label="Add to bag"
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
