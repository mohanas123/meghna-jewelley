import React, { useState, useEffect } from 'react';
import {
  X, Database, Package, ShoppingBag, Plus, RefreshCw, Trash2, Edit3,
  Tag, Percent, Megaphone, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Phone, MessageSquare
} from 'lucide-react';
import {
  fetchHealth, fetchOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct,
  fetchCoupons, createCoupon, updateCoupon, deleteCoupon, fetchSettings, updateSettings
} from '../services/api.ts';
import type { Order, Product, Coupon, StoreSettings } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsUpdated: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsUpdated,
}) => {
  const { formatPrice } = useCurrency();
  const { user, isAdmin, openAuthModal } = useAuth();
  const { simulatePriceDrop } = useWishlist();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'offers' | 'orders' | 'database'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Product Create/Edit Form State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Chokers & Necklaces');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pOfferPrice, setPOfferPrice] = useState('');
  const [pOfferBadge, setPOfferBadge] = useState('Festive Offer: 12% Off');
  const [pWeight, setPWeight] = useState('48.50 grams');
  const [pPurity, setPPurity] = useState('22K Antique Hallmarked Gold (916 BIS)');
  const [pGemstones, setPGemstones] = useState('Uncut Syndicate Polki & Burmese Rubies');
  const [pDesc, setPDesc] = useState('');
  const [pStock, setPStock] = useState('5');
  const [pIsAntique, setPIsAntique] = useState(true);
  const [pIsTrending, setPIsTrending] = useState(true);
  const [pIsDealOfDay, setPIsDealOfDay] = useState(false);
  const [pImage, setPImage] = useState('/images/product_temple_choker.jpg');

  // Coupon Form State
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('10');
  const [couponMinOrder, setCouponMinOrder] = useState('25000');
  const [couponDesc, setCouponDesc] = useState('');

  // Settings Form State
  const [announcementText, setAnnouncementText] = useState('');
  const [activeOfferTitle, setActiveOfferTitle] = useState('');
  const [activeOfferDiscount, setActiveOfferDiscount] = useState(15);
  const [offerBannerActive, setOfferBannerActive] = useState(true);

  const sampleImages = [
    { label: 'Temple Choker', path: '/images/product_temple_choker.jpg' },
    { label: 'Emerald Jhumkas', path: '/images/product_emerald_jhumkas.jpg' },
    { label: 'Heritage Bangles', path: '/images/product_heritage_kadas.jpg' },
    { label: 'Rani Haar', path: '/images/product_rani_haar.jpg' },
    { label: 'Floral Chandbali', path: '/images/product_floral_chandbali.jpg' },
    { label: 'Royal Bridal Set', path: '/images/product_royal_bridal_set.jpg' },
    { label: 'Royal Showcase', path: '/images/hero_antique_jewellery.jpg' },
  ];

  useEffect(() => {
    if (isOpen) {
      loadAllAdminData();
    }
  }, [isOpen]);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [ords, cpx, stg, hlth] = await Promise.all([
        fetchOrders().catch(() => []),
        fetchCoupons().catch(() => []),
        fetchSettings().catch(() => null),
        fetchHealth().catch(() => null),
      ]);
      setOrders(ords);
      setCoupons(cpx);
      if (stg) {
        setSettings(stg);
        setAnnouncementText(stg.announcementText || '');
        setActiveOfferTitle(stg.activeOfferTitle || '');
        setActiveOfferDiscount(stg.activeOfferDiscount || 15);
        setOfferBannerActive(stg.offerBannerActive ?? true);
      }
      setHealthData(hlth);
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Product Form Handlers
  const handleOpenAddProduct = () => {
    setIsEditingProduct(false);
    setEditingId(null);
    setPName('');
    setPCategory('Chokers & Necklaces');
    setPOriginalPrice('120000');
    setPOfferPrice('99000');
    setPOfferBadge('Festive Offer: 18% Off');
    setPWeight('42.00 grams');
    setPPurity('22K Antique Hallmarked Gold (916 BIS)');
    setPGemstones('Burmese Rubies & Uncut Polki');
    setPDesc('');
    setPStock('5');
    setPIsAntique(true);
    setPIsTrending(true);
    setPIsDealOfDay(false);
    setPImage(sampleImages[0].path);
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setIsEditingProduct(true);
    setEditingId(prod.id);
    setPName(prod.name);
    setPCategory(prod.category);
    setPOriginalPrice(String(prod.originalPrice || prod.price));
    setPOfferPrice(String(prod.price));
    setPOfferBadge(prod.offerBadge || '');
    setPWeight(prod.weight);
    setPPurity(prod.purity);
    setPGemstones(prod.gemstones);
    setPDesc(prod.description);
    setPStock(String(prod.stockCount));
    setPIsAntique(prod.isAntique);
    setPIsTrending(prod.isTrending);
    setPIsDealOfDay(Boolean(prod.isDealOfTheDay));
    setPImage(prod.images[0] || sampleImages[0].path);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pOfferPrice) return;

    const offerPriceNum = Number(pOfferPrice);
    const origPriceNum = pOriginalPrice ? Number(pOriginalPrice) : offerPriceNum;

    const productData = {
      name: pName,
      shortDescription: pDesc ? pDesc.slice(0, 110) + '...' : `${pPurity} with ${pGemstones}`,
      description: pDesc || `${pPurity} handcrafted temple jewellery piece featuring ${pGemstones}. Certified BIS hallmark with individual authenticity report.`,
      category: pCategory,
      price: offerPriceNum,
      originalPrice: origPriceNum > offerPriceNum ? origPriceNum : undefined,
      offerBadge: pOfferBadge || undefined,
      isDealOfTheDay: pIsDealOfDay,
      weight: pWeight,
      purity: pPurity,
      gemstones: pGemstones,
      craftsmanship: 'Traditional artisan repoussé and vintage gold patina bath.',
      inStock: Number(pStock) > 0,
      stockCount: Number(pStock) || 1,
      isAntique: pIsAntique,
      isTrending: pIsTrending,
      isFeatured: true,
      images: [pImage],
      tags: [pCategory, pIsTrending ? 'Trending' : '', pIsAntique ? 'Antique' : ''].filter(Boolean),
      sku: editingId ? undefined : `MJ-${Date.now().toString().slice(-5)}`,
    };

    try {
      if (isEditingProduct && editingId) {
        await updateProduct(editingId, productData);
        showStatus('Product updated with new offer price!');
      } else {
        await createProduct(productData);
        showStatus('New handcrafted piece added to vault!');
      }
      setShowProductForm(false);
      onProductsUpdated();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the vault?')) return;
    try {
      await deleteProduct(id);
      showStatus('Product removed from catalog.');
      onProductsUpdated();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Coupon Handlers
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    try {
      await createCoupon({
        code: couponCode,
        discountPercent: Number(couponDiscount) || 10,
        minOrderValue: Number(couponMinOrder) || 0,
        description: couponDesc || `${couponDiscount}% privilege discount`,
        isActive: true,
      });
      setShowCouponForm(false);
      setCouponCode('');
      setCouponDesc('');
      const updatedCoupons = await fetchCoupons();
      setCoupons(updatedCoupons);
      showStatus('Promotional offer coupon created!');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleToggleCoupon = async (coupon: Coupon) => {
    try {
      await updateCoupon(coupon.id, { isActive: !coupon.isActive });
      const updatedCoupons = await fetchCoupons();
      setCoupons(updatedCoupons);
      showStatus(`Coupon ${coupon.code} ${coupon.isActive ? 'deactivated' : 'activated'}!`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteCoupon(id);
      const updatedCoupons = await fetchCoupons();
      setCoupons(updatedCoupons);
      showStatus('Coupon removed.');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showStatus(`Order ${updated.orderNumber} updated to ${newStatus}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await updateSettings({
        announcementText,
        activeOfferTitle,
        activeOfferDiscount: Number(activeOfferDiscount),
        offerBannerActive,
      });
      setSettings(updated);
      showStatus('Store promotion & announcement bar saved!');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // Calculations for dashboard
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Received' || o.status === 'In Production').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#171513] text-[#FAF8F5] flex items-center justify-between border-b border-[#2D2821]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2B251E] rounded flex items-center justify-center text-[#D6C7A8]">
              <Package className="w-5 h-5 text-[#C9A24D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium tracking-wide">Meghna Jewellery Admin Studio</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#C9A24D]/20 text-[#EBD7A7] px-2 py-0.5 rounded">
                  Merchant Control
                </span>
              </div>
              <p className="text-[11px] text-[#A89C8C]">Live Vault Management, Offer Prices, Orders & Promotions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#B8ACA0] hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-[#2E6B47] text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A1E3BA]" />
              <span>{statusMessage}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#F2EDE2] border-b border-[#E0D7C9] flex items-center justify-between text-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'products' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products & Offer Prices ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'offers' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Coupons & Banners ({coupons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
              {pendingOrders > 0 && (
                <span className="bg-[#98702B] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {pendingOrders}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'database' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Mongo Engine</span>
            </button>
          </div>

          <button
            onClick={loadAllAdminData}
            className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#E5DDCF] transition-colors cursor-pointer ml-3 shrink-0"
            title="Refresh All Vault Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded border border-[#E5DDD0] shadow-2xs">
                  <div className="text-[11px] uppercase tracking-wider text-[#8A7D6B] font-semibold">Total Revenue</div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#1E1B18] mt-1">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[11px] text-[#2E6B47] mt-1 font-medium">From {orders.length} registered orders</div>
                </div>

                <div className="bg-white p-4 rounded border border-[#E5DDD0] shadow-2xs">
                  <div className="text-[11px] uppercase tracking-wider text-[#8A7D6B] font-semibold">Active Vault Pieces</div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#1E1B18] mt-1">
                    {products.length} Items
                  </div>
                  <div className="text-[11px] text-[#7A6E5E] mt-1">
                    {products.filter((p) => p.offerBadge).length} with active offer pricing
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-[#E5DDD0] shadow-2xs">
                  <div className="text-[11px] uppercase tracking-wider text-[#8A7D6B] font-semibold">Orders Pending Dispatch</div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#98702B] mt-1">
                    {pendingOrders}
                  </div>
                  <div className="text-[11px] text-[#7A6E5E] mt-1">Need artisan packaging/courier</div>
                </div>

                <div className="bg-white p-4 rounded border border-[#E5DDD0] shadow-2xs">
                  <div className="text-[11px] uppercase tracking-wider text-[#8A7D6B] font-semibold">Active Coupons</div>
                  <div className="font-mono tabular-nums text-2xl font-bold text-[#1E1B18] mt-1">
                    {coupons.filter((c) => c.isActive).length} Active
                  </div>
                  <div className="text-[11px] text-[#7A6E5E] mt-1">Special codes: MEGHNA10, ROYALFESTIVE</div>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fast Action Box */}
                <div className="bg-white p-5 rounded border border-[#E5DDD0] space-y-3">
                  <h4 className="font-serif text-base text-[#1E1B18] font-medium">Merchandise & Offer Actions</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab('products');
                        handleOpenAddProduct();
                      }}
                      className="p-3 bg-[#FAF8F5] border border-[#DDD5C7] hover:border-[#98702B] rounded text-left transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#98702B] mb-1" />
                      <div className="font-semibold text-[#1E1B18]">Add Jewellery Item</div>
                      <div className="text-[10px] text-[#7A6E5E]">Set regular & offer price</div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('offers');
                        setShowCouponForm(true);
                      }}
                      className="p-3 bg-[#FAF8F5] border border-[#DDD5C7] hover:border-[#98702B] rounded text-left transition-colors cursor-pointer"
                    >
                      <Tag className="w-4 h-4 text-[#98702B] mb-1" />
                      <div className="font-semibold text-[#1E1B18]">Create Discount Code</div>
                      <div className="text-[10px] text-[#7A6E5E]">Custom % discount code</div>
                    </button>
                  </div>
                </div>

                {/* Announcement Preview */}
                <div className="bg-[#F6F2EA] p-5 rounded border border-[#E2DBD0] space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-[#1E1B18]">
                    <Megaphone className="w-4 h-4 text-[#98702B]" />
                    <span>Storewide Promotional Banner</span>
                  </div>
                  <p className="text-[#6D6253] leading-relaxed italic bg-white p-3 rounded border border-[#E5DDCF]">
                    "{settings?.announcementText || 'Complimentary Insured Delivery on Heirloom Orders'}"
                  </p>
                  <button
                    onClick={() => setActiveTab('offers')}
                    className="text-xs text-[#98702B] hover:underline font-medium"
                  >
                    Edit announcement message & banner settings →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & OFFER PRICES */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif text-lg text-[#1E1B18]">Vault Product Catalog</h4>
                  <p className="text-xs text-[#7A6E5E]">Manage original MRP, offer sale prices, badges and stock</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342D25] rounded transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Piece</span>
                </button>
              </div>

              {/* Add / Edit Form Modal */}
              {showProductForm && (
                <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded border border-[#DDD5C7] shadow-sm space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DD]">
                    <h5 className="font-serif text-base font-medium text-[#1E1B18]">
                      {isEditingProduct ? 'Edit Jewellery Piece & Offer Price' : 'Add New Handcrafted Heirloom'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="text-xs text-[#7A6E5E] hover:text-[#1E1B18]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[#52493D] mb-1 font-medium">Piece Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Gauri Temple Choker"
                        value={pName}
                        onChange={(e) => setPName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded focus:outline-none focus:border-[#98702B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Category</label>
                      <select
                        value={pCategory}
                        onChange={(e) => setPCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded focus:outline-none focus:border-[#98702B]"
                      >
                        <option value="Chokers & Necklaces">Chokers & Necklaces</option>
                        <option value="Earrings & Jhumkas">Earrings & Jhumkas</option>
                        <option value="Bangles & Kadas">Bangles & Kadas</option>
                        <option value="Rani Haars">Rani Haars</option>
                        <option value="Bridal Sets">Bridal Sets</option>
                      </select>
                    </div>

                    {/* PRICING ROW */}
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Regular MRP Price (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 150000"
                        value={pOriginalPrice}
                        onChange={(e) => setPOriginalPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                      />
                      <span className="text-[10px] text-[#8C7D6B]">Original price before discount</span>
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium text-[#98702B] font-bold">
                        Offer Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 125000"
                        value={pOfferPrice}
                        onChange={(e) => setPOfferPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white border-2 border-[#98702B]/40 rounded font-mono font-bold text-[#1E1B18]"
                      />
                      <span className="text-[10px] text-[#2E6B47]">Actual price patron pays</span>
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Offer Badge Text</label>
                      <input
                        type="text"
                        placeholder="e.g. Festive Offer: 15% Off"
                        value={pOfferBadge}
                        onChange={(e) => setPOfferBadge(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Net Gold Weight</label>
                      <input
                        type="text"
                        value={pWeight}
                        onChange={(e) => setPWeight(e.target.value)}
                        placeholder="e.g. 52.40 grams"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Gold Purity & Fineness</label>
                      <input
                        type="text"
                        value={pPurity}
                        onChange={(e) => setPPurity(e.target.value)}
                        placeholder="22K Antique Gold (916 BIS)"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Stock Count</label>
                      <input
                        type="number"
                        value={pStock}
                        onChange={(e) => setPStock(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[#52493D] mb-1 font-medium">Gemstones & Pearls</label>
                      <input
                        type="text"
                        value={pGemstones}
                        onChange={(e) => setPGemstones(e.target.value)}
                        placeholder="Natural Burmese Rubies, Syndicate Polki, Basra Pearls"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Product Photography</label>
                      <select
                        value={pImage}
                        onChange={(e) => setPImage(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      >
                        {sampleImages.map((img) => (
                          <option key={img.path} value={img.path}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[#52493D] mb-1 font-medium">Detailed Description & Craft Story</label>
                      <textarea
                        rows={2}
                        value={pDesc}
                        onChange={(e) => setPDesc(e.target.value)}
                        placeholder="Repoussé carving techniques, heirloom lineage..."
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                  </div>

                  {/* Badges / Checkboxes */}
                  <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#F2ECE1]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pIsDealOfDay}
                        onChange={(e) => setPIsDealOfDay(e.target.checked)}
                      />
                      <span className="font-semibold text-[#8B6523]">Deal of the Day Highlight</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pIsTrending}
                        onChange={(e) => setPIsTrending(e.target.checked)}
                      />
                      <span>Mark as Trending</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pIsAntique}
                        onChange={(e) => setPIsAntique(e.target.checked)}
                      />
                      <span>Mark as Antique Heirloom</span>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowProductForm(false)}
                      className="px-4 py-2 border border-[#DDD5C7] rounded hover:bg-[#FAF8F5]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1E1B18] text-white font-semibold rounded hover:bg-[#342E28]"
                    >
                      {isEditingProduct ? 'Save Changes' : 'Add to Vault'}
                    </button>
                  </div>
                </form>
              )}

              {/* Product Listing Table */}
              <div className="bg-white border border-[#E5DDD0] rounded divide-y divide-[#F2ECE1]">
                {products.map((prod) => (
                  <div key={prod.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3.5">
                      <img src={prod.images[0]} alt={prod.name} className="w-14 h-14 object-cover rounded border border-[#E2DBD0] shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-serif text-base font-medium text-[#1E1B18]">{prod.name}</h5>
                          {prod.isDealOfTheDay && (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                              Deal of Day
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A6E5E] mt-0.5">
                          {prod.category} · {prod.weight} · {prod.purity.split(' ')[0]} · Stock: {prod.stockCount}
                        </div>
                        {prod.offerBadge && (
                          <div className="text-[11px] text-[#2E6B47] font-medium mt-0.5">
                            {prod.offerBadge}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      <div className="text-right">
                        <div className="font-mono tabular-nums text-base font-bold text-[#1E1B18]">
                          {formatPrice(prod.price)}
                        </div>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <div className="font-mono tabular-nums text-xs text-[#9B9080] line-through">
                            MRP: {formatPrice(prod.originalPrice)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            simulatePriceDrop(prod);
                            showStatus(`Simulated Price Drop Alert for ${prod.name}!`);
                          }}
                          className="p-2 text-[#98702B] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
                          title="Simulate Wishlist Price Drop Alert"
                        >
                          <TrendingDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-2 text-[#52493D] hover:text-[#98702B] hover:bg-[#F4EFE6] rounded transition-colors cursor-pointer"
                          title="Edit product & offer price"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-[#9E907B] hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: COUPONS & PROMOTIONAL BANNERS */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Section 1: Coupons */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg text-[#1E1B18]">Promotional Coupons & Privilege Codes</h4>
                    <p className="text-xs text-[#7A6E5E]">Create and manage discount codes applied at checkout</p>
                  </div>
                  <button
                    onClick={() => setShowCouponForm(!showCouponForm)}
                    className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342D25] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showCouponForm ? 'Cancel' : 'Create Coupon'}</span>
                  </button>
                </div>

                {showCouponForm && (
                  <form onSubmit={handleCreateCoupon} className="bg-white p-5 rounded border border-[#DDD5C7] space-y-3 text-xs">
                    <h5 className="font-semibold text-sm text-[#1E1B18]">New Discount Coupon</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[#52493D] mb-1 font-medium">Coupon Code *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. FESTIVE20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[#52493D] mb-1 font-medium">Discount Percent (%) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 15"
                          value={couponDiscount}
                          onChange={(e) => setCouponDiscount(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[#52493D] mb-1 font-medium">Minimum Order (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 50000"
                          value={couponMinOrder}
                          onChange={(e) => setCouponMinOrder(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[#52493D] mb-1 font-medium">Coupon Description</label>
                        <input
                          type="text"
                          placeholder="e.g. 15% off on orders above ₹50,000"
                          value={couponDesc}
                          onChange={(e) => setCouponDesc(e.target.value)}
                          className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1E1B18] text-white font-semibold rounded hover:bg-[#342D25]"
                    >
                      Save Coupon
                    </button>
                  </form>
                )}

                {/* Coupon Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {coupons.map((c) => (
                    <div key={c.id} className="bg-white p-4 rounded border border-[#E5DDD0] flex flex-col justify-between text-xs space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#1E1B18] bg-[#F4EFE6] px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="font-bold text-base text-[#98702B] mt-2">
                          {c.discountPercent}% OFF
                        </div>
                        <p className="text-[11px] text-[#7A6E5E] mt-1">{c.description}</p>
                        <div className="text-[10px] text-[#9E907B] mt-1">
                          Min. Order: ₹{c.minOrderValue.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between">
                        <button
                          onClick={() => handleToggleCoupon(c)}
                          className="text-[11px] text-[#52493D] hover:underline font-medium cursor-pointer"
                        >
                          {c.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="text-[11px] text-red-700 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Store Announcement & Offer Banner */}
              <div className="pt-6 border-t border-[#E5DDD0] space-y-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-[#98702B]" />
                  <h4 className="font-serif text-lg text-[#1E1B18]">Storewide Header Announcement & Offers</h4>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white p-5 rounded border border-[#DDD5C7] space-y-4 text-xs">
                  <div>
                    <label className="block text-[#52493D] mb-1 font-medium">Header Ticker Announcement Text</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="e.g. Festive Privileges: Complimentary Insured Armored Delivery + 10% Off with Code MEGHNA10"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Featured Campaign Title</label>
                      <input
                        type="text"
                        value={activeOfferTitle}
                        onChange={(e) => setActiveOfferTitle(e.target.value)}
                        placeholder="e.g. Heritage Bridal & Antique Festival"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Campaign Max Discount (%)</label>
                      <input
                        type="number"
                        value={activeOfferDiscount}
                        onChange={(e) => setActiveOfferDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#1E1B18] text-white font-semibold uppercase tracking-wider text-xs rounded hover:bg-[#342D25] cursor-pointer"
                    >
                      Save Store Settings & Announcements
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-[#1E1B18]">Customer Vault Orders</h4>
                  <p className="text-xs text-[#7A6E5E]">Track status, customer contact & dispatch shipments</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded border border-[#E8E2D8] p-6 text-xs text-[#7A6E5E]">
                  No orders placed yet. Test checking out an antique choker to verify this flow!
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-4 rounded border border-[#E5DDD0] shadow-2xs space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#F2ECE1] gap-2">
                        <div>
                          <span className="font-mono font-bold text-sm text-[#1E1B18]">{ord.orderNumber}</span>
                          <span className="text-[#8C7D6B] ml-2">· {new Date(ord.createdAt).toLocaleDateString()}</span>
                          <span className="text-[#8C7D6B] ml-2">· Patron: <strong className="text-[#1E1B18]">{ord.customerName}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/${ord.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.customerName)},%20this%20is%20Meghna%20Jewellery%20regarding%20your%20Order%20${ord.orderNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 bg-[#25D366]/15 text-[#1E7E34] rounded flex items-center gap-1 font-medium hover:bg-[#25D366]/25"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp Customer</span>
                          </a>

                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="px-2.5 py-1 bg-[#FAF8F5] border border-[#DDD5C7] rounded text-xs font-semibold text-[#1E1B18] cursor-pointer"
                          >
                            <option value="Received">Received</option>
                            <option value="In Production">In Production</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Item list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#6D6253]">
                        <div>
                          <span className="font-semibold text-[#1E1B18]">Items: </span>
                          {ord.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                        </div>
                        <div>
                          <span className="font-semibold text-[#1E1B18]">Delivery To: </span>
                          {ord.shippingAddress.street}, {ord.shippingAddress.city} - {ord.shippingAddress.pincode} (Tel: {ord.phone})
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F2ECE1] flex items-center justify-between text-xs">
                        <span className="text-[#7A6E5E]">Payment: <strong className="text-[#1E1B18]">{ord.paymentMethod}</strong></span>
                        <div>Total: <strong className="font-mono tabular-nums text-sm text-[#98702B]">{formatPrice(ord.total)}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: DATABASE & MONGO STATUS */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg text-[#1E1B18]">MongoDB Architecture & Live Persistence</h4>
              <p className="text-xs text-[#7A6E5E]">
                Meghna Jewellery operates with complete MongoDB compatibility.
              </p>

              <div className="bg-white p-5 rounded border border-[#E5DDD0] space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE1]">
                  <span className="text-[#6D6253]">Active Storage Mode:</span>
                  <span className="font-mono font-bold text-[#2E6B47] uppercase">
                    {healthData?.database?.mode || 'Embedded-Mongo (Active)'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE1]">
                  <span className="text-[#6D6253]">External MongoDB Status:</span>
                  <span className="font-mono">
                    {healthData?.database?.connectedToMongo ? 'Connected to Mongo Cluster' : 'Standby (Embedded Document Engine)'}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE1]">
                  <span className="text-[#6D6253]">Products in Collection:</span>
                  <span className="font-mono tabular-nums font-bold text-[#1E1B18]">
                    {healthData?.database?.productsCount ?? products.length} documents
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE1]">
                  <span className="text-[#6D6253]">Customer Accounts Registered:</span>
                  <span className="font-mono tabular-nums font-bold text-[#1E1B18]">
                    {healthData?.database?.usersCount ?? 2} accounts
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#F2ECE1]">
                  <span className="text-[#6D6253]">Promotional Coupons Stored:</span>
                  <span className="font-mono tabular-nums font-bold text-[#1E1B18]">
                    {healthData?.database?.couponsCount ?? coupons.length} coupons
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-[#7A6E5E]">
                  To connect an external MongoDB Atlas cluster, set <code className="bg-[#F2EDE2] px-1 py-0.5 rounded font-mono">MONGODB_URI=mongodb+srv://...</code> in your environment.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
