import React, { useState, useEffect } from 'react';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { ToastContainer } from './components/ToastContainer.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { TrustBanner } from './components/TrustBanner.tsx';
import { ProductCatalog } from './components/ProductCatalog.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { CraftsmanshipStory } from './components/CraftsmanshipStory.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { AdminPortalModal } from './components/AdminPortalModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ClientProfileModal } from './components/ClientProfileModal.tsx';
import { WishlistModal } from './components/WishlistModal.tsx';
import { Footer } from './components/Footer.tsx';
import { fetchProducts, fetchReviews } from './services/api.ts';
import type { Product, Review } from './types/index.ts';

function AppContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Jewellery');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Drawers state
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<{ product: Product; quantity: number; size?: string } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isClientProfileOpen, setIsClientProfileOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const loadInitialData = async () => {
    try {
      const [prods, revs] = await Promise.all([
        fetchProducts(),
        fetchReviews(),
      ]);
      setProducts(prods);
      setReviews(revs);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenSearch = () => {
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCheckoutWithDirectItem = (product: Product, quantity: number, size?: string) => {
    setActiveProduct(null);
    setDirectCheckoutItem({ product, quantity, size });
    setIsCheckoutOpen(true);
  };

  const handleProceedFromCart = () => {
    setDirectCheckoutItem(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1B18] flex flex-col font-sans">
      {/* Strict 3-zone Top Bar */}
      <Navbar
        onSelectCategory={handleSelectCategory}
        onOpenSearch={handleOpenSearch}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenClientProfile={() => setIsClientProfileOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        activeCategory={selectedCategory}
      />

      {/* Hero Showcase */}
      <Hero
        onExploreClick={() => handleSelectCategory('All Jewellery')}
        onSelectCategory={handleSelectCategory}
      />

      {/* Trust & Hallmark Authenticity Pillars */}
      <TrustBanner />

      {/* Main Product Catalog with Offer Selling Prices & Filter Controls */}
      <ProductCatalog
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenProductModal={(prod) => setActiveProduct(prod)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />

      {/* Heritage Craftsmanship Story */}
      <CraftsmanshipStory />

      {/* Patron Testimonials */}
      <ReviewsSection
        reviews={reviews}
        onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Contiguous Purchase Module (Product Modal) */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onOpenCheckoutWithItem={handleOpenCheckoutWithDirectItem}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        allProducts={products}
      />

      {/* Heirloom Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        onOpenProductModal={(prod) => setActiveProduct(prod)}
        onExploreCatalog={() => handleSelectCategory('All Jewellery')}
      />

      {/* Shopping Bag Slide-Over Drawer */}
      <CartDrawer onProceedToCheckout={handleProceedFromCart} />

      {/* Secure Checkout & Vault Delivery Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setDirectCheckoutItem(null);
        }}
        directItem={directCheckoutItem}
      />

      {/* Merchant Admin Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onProductsUpdated={loadInitialData}
      />

      {/* Client Authentication (Sign In & Register) Modal */}
      <AuthModal />

      {/* Client Profile & Order History Modal */}
      <ClientProfileModal
        isOpen={isClientProfileOpen}
        onClose={() => setIsClientProfileOpen(false)}
      />

      {/* Global Toast Alert Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <WishlistProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
