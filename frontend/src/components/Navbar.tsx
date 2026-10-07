import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, ShieldCheck, Globe, Menu, X, User as UserIcon, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import type { CurrencyCode } from '../types/index.ts';

interface NavbarProps {
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenClientProfile: () => void;
  onOpenWishlist: () => void;
  onOpenSalonModal?: () => void;
  activeCategory: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectCategory,
  onOpenSearch,
  onOpenAdmin,
  onOpenClientProfile,
  onOpenWishlist,
  onOpenSalonModal,
  activeCategory,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const { user, isAdmin, openAuthModal } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'All Heirlooms', value: 'All Jewellery' },
    { label: 'Victorian Collars', value: 'Chokers & Necklaces' },
    { label: 'Antique Jhumkas', value: 'Earrings & Jhumkas' },
    { label: 'Oxidized Kadas', value: 'Bangles & Kadas' },
    { label: 'Baroque Haars', value: 'Rani Haars' },
    { label: 'Gala Suites', value: 'Bridal Sets' },
  ];

  return (
    <>
      {/* Subtle announcement strip: single line, no pill badges */}
      <div className="bg-[#141210] text-[#D6C7A8] text-xs py-2 px-4 tracking-wider text-center border-b border-[#2A241E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#A8987E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24D]" />
            <span>925 Oxidized Sterling Silver & Platinum Assay (Non-Gold)</span>
          </div>
          <div className="mx-auto sm:mx-0 text-[11px] font-medium flex items-center gap-1.5">
            <span>Complimentary Insured Vault Delivery</span>
            <span className="text-[#7A6B53]">·</span>
            <span className="text-[#E8D9B8] font-semibold">Code: MEGHNA10 (10% Privilege)</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-[#A8987E]">
            {onOpenSalonModal && (
              <button
                onClick={onOpenSalonModal}
                className="text-[#C9A24D] hover:text-[#F3EAD3] font-medium transition-colors cursor-pointer"
              >
                Book Private Salon
              </button>
            )}
            {isAdmin ? (
              <button
                onClick={onOpenAdmin}
                className="text-[#C9A24D] hover:text-[#F3EAD3] font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Vault Control</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#F3EAD3] transition-colors cursor-pointer"
                title="Studio Merchant Portal"
              >
                Studio Portal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar adhering to strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1E1B18] hover:text-[#98702B] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory('All Jewellery');
              }}
              className="font-serif text-2xl sm:text-3xl tracking-[0.08em] font-medium text-[#1A1815] uppercase hover:text-[#98702B] transition-colors"
            >
              Meghna Jewellery
            </a>
          </div>

          {/* Zone 2: 4-5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-[#4A443C]">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => onSelectCategory(link.value)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  activeCategory === link.value
                    ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#98702B]'
                    : 'hover:text-[#1C1917]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1-2 primary actions & utility controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#4A443C] hover:text-[#1C1917] rounded hover:bg-[#F0ECE3] transition-colors"
                aria-label="Select Currency"
              >
                <Globe className="w-3.5 h-3.5 text-[#7A6B53]" />
                <span className="font-mono tabular-nums">{currency}</span>
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#E8E2D8] rounded-md shadow-lg py-1 z-50">
                  {availableCurrencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#FAF8F5] ${
                        currency === c.code ? 'font-semibold text-[#98702B]' : 'text-[#4A443C]'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="font-mono text-stone-400">{c.symbol.trim()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#4A443C] hover:text-[#1C1917] hover:bg-[#F0ECE3] rounded-full transition-colors cursor-pointer"
              aria-label="Search collection"
              title="Search collection"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Indicator */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#4A443C] hover:text-[#1C1917] hover:bg-[#F0ECE3] rounded-full transition-colors relative cursor-pointer"
              aria-label="View wishlist"
              title="Saved Heirloom Pieces"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#98702B] rounded-full" />
              )}
            </button>

            {/* Client Login / Profile Action */}
            {user ? (
              <button
                onClick={onOpenClientProfile}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1C1917] bg-[#EFE9DF] hover:bg-[#E2DBD0] rounded transition-colors cursor-pointer"
                title="Your Patron Profile & Orders"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#98702B]" />
                <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#4A443C] hover:text-[#1C1917] hover:bg-[#F0ECE3] rounded transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1C1917] hover:bg-[#342E28] rounded transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-sans">Bag</span>
              <span className="font-mono tabular-nums text-[#D6C7A8] font-bold">({totalItems})</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8E2D8] bg-[#FAF8F5] px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.value}
                onClick={() => {
                  onSelectCategory(link.value);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 text-sm font-medium ${
                  activeCategory === link.value ? 'text-[#98702B] font-semibold' : 'text-[#4A443C]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 text-sm font-medium text-[#4A443C] hover:text-[#98702B] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#98702B]" />
                <span>Saved Pieces (Wishlist)</span>
              </span>
              <span className="font-mono text-xs text-[#8A7D6B] bg-[#F4EFE6] px-2 py-0.5 rounded">
                {wishlistCount}
              </span>
            </button>
            {onOpenSalonModal && (
              <button
                onClick={() => {
                  onOpenSalonModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm font-medium text-[#98702B] hover:text-[#7A581F] flex items-center gap-2"
              >
                <span>Book Private Styling Salon</span>
              </button>
            )}
            <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
              {user ? (
                <button
                  onClick={() => {
                    onOpenClientProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="font-medium text-[#1E1B18]"
                >
                  My Patron Account ({user.name.split(' ')[0]})
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="font-medium text-[#98702B]"
                >
                  Client Sign In / Register
                </button>
              )}

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-[#7A6B53] font-medium"
              >
                Studio Admin Portal
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
