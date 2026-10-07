import React, { useState, useEffect } from 'react';
import {
  X, User as UserIcon, Package, MapPin, LogOut, CheckCircle2, Clock,
  Truck, ShieldCheck, Search, ArrowRight, RefreshCw, Bell, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { fetchOrders, addSavedAddress, fetchPriceAlerts, deletePriceAlert } from '../services/api.ts';
import type { Order, PriceAlert } from '../types/index.ts';
import { OrderTrackingDetail } from './OrderTrackingDetail.tsx';

interface ClientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { formatPrice } = useCurrency();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'alerts'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  // Quick order search
  const [trackingSearchNumber, setTrackingSearchNumber] = useState('');
  const [trackingSearchError, setTrackingSearchError] = useState<string | null>(null);

  // Add address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadUserOrders();
      loadUserAlerts();
    }
  }, [isOpen, user]);

  const loadUserOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const userOrders = await fetchOrders(user.email);
      setOrders(userOrders);

      // If viewing a tracked order, update it with latest server state
      if (selectedOrderForTracking) {
        const found = userOrders.find((o) => o.id === selectedOrderForTracking.id);
        if (found) setSelectedOrderForTracking(found);
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadUserAlerts = async () => {
    if (!user) return;
    setLoadingAlerts(true);
    try {
      const alerts = await fetchPriceAlerts(user.email);
      setPriceAlerts(alerts);
    } catch (err) {
      console.error('Failed to load user price alerts:', err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deletePriceAlert(alertId);
      setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
    } catch (err) {
      console.error('Failed to delete price alert:', err);
    }
  };

  if (!isOpen || !user) return null;

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingSearchError(null);
    const cleaned = trackingSearchNumber.trim().toUpperCase();
    if (!cleaned) return;

    const match = orders.find(
      (o) => o.orderNumber.toUpperCase() === cleaned || o.orderNumber.replace(/[^0-9]/g, '') === cleaned.replace(/[^0-9]/g, '')
    );

    if (match) {
      setSelectedOrderForTracking(match);
      setTrackingSearchNumber('');
    } else {
      setTrackingSearchError(`No order matching "${cleaned}" found in your registered account.`);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !pincode) return;

    try {
      await addSavedAddress(user.id, {
        label,
        street,
        city,
        state,
        pincode,
        country: 'India',
        isDefault: user.savedAddresses.length === 0,
      });
      setShowAddAddress(false);
      setStreet('');
      setCity('');
      setPincode('');
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Received':
        return (
          <span className="text-[#8C6D2B] bg-[#FAF5EB] border border-[#EADBBD] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#98702B]" /> Vault Order Received
          </span>
        );
      case 'In Production':
        return (
          <span className="text-[#98702B] bg-[#FAF5EB] border border-[#EADBBD] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#98702B]" /> Handcrafted In Studio
          </span>
        );
      case 'Dispatched':
        return (
          <span className="text-[#205A74] bg-[#EDF6F9] border border-[#C5E1EB] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <Truck className="w-3 h-3 text-[#205A74]" /> Insured Courier In Transit
          </span>
        );
      case 'Delivered':
        return (
          <span className="text-[#215E39] bg-[#EAF5EC] border border-[#C8E8D1] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#215E39]" /> Delivered Safely
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] my-6 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-full border border-[#E0D8CB] flex items-center justify-center text-[#98702B] shadow-2xs">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-medium text-[#1E1B18]">{user.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-[#F4EFE6] text-[#8B6523] px-2 py-0.5 rounded border border-[#E5DDD0]">
                  Patron
                </span>
              </div>
              <p className="text-xs text-[#7A6E5E]">{user.email} · {user.phone || 'Meghna Patron'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#F2EDE2] border-b border-[#E5DDD0] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                setSelectedOrderForTracking(null);
              }}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders & Live Tracking ({orders.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('addresses');
                setSelectedOrderForTracking(null);
              }}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'addresses' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Saved Addresses</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('alerts');
                setSelectedOrderForTracking(null);
              }}
              className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts' ? 'bg-[#1E1B18] text-white' : 'text-[#5C5243] hover:text-[#1E1B18]'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Price Alerts ({priceAlerts.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'orders' && (
            <div>
              {/* IF AN ORDER IS SELECTED: SHOW DETAILED TRACKING COMPONENT */}
              {selectedOrderForTracking ? (
                <OrderTrackingDetail
                  order={selectedOrderForTracking}
                  onBack={() => setSelectedOrderForTracking(null)}
                  onRefresh={loadUserOrders}
                  isRefreshing={loadingOrders}
                />
              ) : (
                /* OTHERWISE: SHOW LIST OF ORDERS WITH TRACKING CTA & SEARCH BAR */
                <div className="space-y-4">
                  {/* Quick Order Number Search Bar */}
                  {orders.length > 0 && (
                    <form onSubmit={handleSearchOrder} className="bg-white p-3 rounded border border-[#E5DDD0] flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Enter Order # to track (e.g. MJ-849102)"
                          value={trackingSearchNumber}
                          onChange={(e) => setTrackingSearchNumber(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                        />
                        <Search className="w-3.5 h-3.5 text-[#9E907B] absolute left-2.5 top-2" />
                      </div>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#1E1B18] hover:bg-[#342D25] text-white text-xs font-semibold rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1"
                      >
                        <span>Track</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </form>
                  )}

                  {trackingSearchError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                      {trackingSearchError}
                    </div>
                  )}

                  {loadingOrders ? (
                    <div className="text-center py-10 text-xs text-[#7A6E5E] flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#98702B]" />
                      <span>Retrieving real-time order states...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded border border-[#E8E2D8] p-6">
                      <Package className="w-8 h-8 text-[#98702B] mx-auto mb-2 opacity-60" />
                      <p className="font-serif text-lg text-[#1E1B18]">No purchases yet</p>
                      <p className="text-xs text-[#7A6E5E] mt-1 max-w-sm mx-auto">
                        When you acquire bespoke antique chokers or jadau pieces, live armored courier tracking will be available here.
                      </p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-white p-4 rounded border border-[#E5DDCF] shadow-2xs space-y-3 text-xs transition-colors hover:border-[#C4B7A0]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#F2ECE1] gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#1E1B18] text-sm">{ord.orderNumber}</span>
                            <span className="text-[#8A7D6C]">·</span>
                            <span className="text-[#8A7D6C]">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>{getStatusBadge(ord.status)}</div>
                        </div>

                        {/* Items preview */}
                        <div className="divide-y divide-[#F7F4EE]">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="py-1.5 flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-9 h-9 object-cover rounded border border-[#E8E0D2]"
                                />
                                <div>
                                  <div className="font-serif text-sm font-medium text-[#1E1B18]">{item.name}</div>
                                  <div className="text-[11px] text-[#7A6E5E]">
                                    Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}
                                  </div>
                                </div>
                              </div>
                              <span className="font-mono tabular-nums font-semibold text-[#1E1B18]">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom action row with Track Live Shipping */}
                        <div className="pt-2 border-t border-[#F2ECE1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[#7A6E5E]">Pay: <strong className="text-[#1E1B18]">{ord.paymentMethod}</strong></span>
                            <span className="mx-2 text-[#DDD5C7]">·</span>
                            <span>Total: <strong className="font-mono tabular-nums text-sm text-[#98702B]">{formatPrice(ord.total)}</strong></span>
                          </div>

                          <button
                            onClick={() => setSelectedOrderForTracking(ord)}
                            className="px-3.5 py-1.5 bg-[#1E1B18] hover:bg-[#342D25] text-white rounded font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs self-end sm:self-auto"
                          >
                            <Truck className="w-3.5 h-3.5 text-[#C9A24D]" />
                            <span>Track Live Shipping</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base text-[#1E1B18]">Saved Shipping Addresses</h4>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342E28] rounded transition-colors cursor-pointer"
                >
                  {showAddAddress ? 'Cancel' : '+ Add Address'}
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="bg-white p-4 rounded border border-[#DDD5C7] space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">Label</label>
                      <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        placeholder="e.g. Home, Office"
                        className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">PIN Code *</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="600017"
                        className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#52493D] mb-1 font-medium">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Door No., Street name, Landmark"
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">City *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Chennai"
                        className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[#52493D] mb-1 font-medium">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Tamil Nadu"
                        className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] rounded hover:bg-[#342E28]"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {user.savedAddresses.length === 0 && !showAddAddress ? (
                <div className="p-6 text-center bg-white rounded border border-[#E8E2D8] text-xs text-[#7A6E5E]">
                  No delivery addresses saved. Click "+ Add Address" to store your shipping address for fast 1-click checkout.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.savedAddresses.map((addr) => (
                    <div key={addr.id} className="bg-white p-3.5 rounded border border-[#E2DBD0] text-xs space-y-1">
                      <div className="font-semibold text-[#1E1B18] flex items-center justify-between">
                        <span>{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-[#2E6B47] bg-emerald-50 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[#6D6253] leading-relaxed">
                        {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                <h4 className="font-serif text-base text-[#1E1B18]">Active Heirloom Price Alerts</h4>
                <span className="text-xs text-[#7A6E5E]">
                  Automatic alerts sent whenever tracked pieces drop in price.
                </span>
              </div>

              {loadingAlerts ? (
                <div className="text-center py-10 text-xs text-[#7A6E5E] flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#98702B]" />
                  <span>Loading your price alerts...</span>
                </div>
              ) : priceAlerts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded border border-[#E8E2D8] p-6">
                  <Bell className="w-8 h-8 text-[#98702B] mx-auto mb-2 opacity-60" />
                  <p className="font-serif text-lg text-[#1E1B18]">No active price alerts</p>
                  <p className="text-xs text-[#7A6E5E] mt-1 max-w-sm mx-auto">
                    Click 'Set Price Alert' on any antique choker or jadau piece to monitor price drops and celebratory offers.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {priceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-white p-4 rounded border border-[#E5DDCF] shadow-2xs flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {alert.productImage && (
                          <img
                            src={alert.productImage}
                            alt={alert.productName}
                            className="w-12 h-12 object-cover rounded border border-[#E8E0D2] shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h5 className="font-serif text-sm font-medium text-[#1E1B18] truncate">
                            {alert.productName}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            <span className="text-[#7A6E5E]">Target Threshold:</span>
                            <span className="font-mono font-bold text-[#98702B]">
                              {formatPrice(alert.targetPrice)}
                            </span>
                            <span className="text-[#8A7D6B]">·</span>
                            <span className="text-[#7A6E5E]">Current: {formatPrice(alert.currentPrice)}</span>
                          </div>
                          <div className="text-[10px] text-[#2E6B47] mt-0.5">
                            Notifying: {alert.email}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className="px-2.5 py-1 text-red-700 hover:text-red-900 hover:bg-red-50 rounded text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                        title="Cancel this alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
