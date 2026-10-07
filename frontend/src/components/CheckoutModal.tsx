import React, { useState } from 'react';
import {
  X, ShieldCheck, CheckCircle2, Truck, CreditCard, Banknote,
  QrCode, ArrowLeft, Printer, Gift, Sparkles, Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { createOrder } from '../services/api.ts';
import type { Order, Product, CartItem } from '../types/index.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  directItem?: { product: Product; quantity: number; size?: string } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  directItem,
}) => {
  const { items: cartItems, subtotal: cartSubtotal, discount: cartDiscount, shipping: cartShipping, couponCode, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();

  // If directly buying single item
  const checkoutItems: CartItem[] = directItem
    ? [{ product: directItem.product, quantity: directItem.quantity, selectedSize: directItem.size }]
    : cartItems;

  const checkoutSubtotal = directItem ? directItem.product.price * directItem.quantity : cartSubtotal;
  const checkoutDiscount = directItem ? 0 : cartDiscount;
  const checkoutShipping = checkoutSubtotal >= 50000 ? 0 : 750;
  const checkoutTotal = Math.max(0, checkoutSubtotal - checkoutDiscount + checkoutShipping);

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [notes, setNotes] = useState('');

  // Gift Options State
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (user.savedAddresses.length > 0 && !street) {
        const def = user.savedAddresses.find(a => a.isDefault) || user.savedAddresses[0];
        setStreet(def.street);
        setCity(def.city);
        setState(def.state);
        setPincode(def.pincode);
      }
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !street || !city || !pincode) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload = {
        userId: user?.id || user?.email,
        customerName,
        email: email || `${phone.replace(/\D/g, '')}@meghnacustomer.in`,
        phone,
        shippingAddress: {
          street,
          city,
          state: state || 'State',
          pincode,
          country,
        },
        items: checkoutItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.selectedSize,
          image: item.product.images[0],
        })),
        subtotal: checkoutSubtotal,
        discount: checkoutDiscount,
        couponCode: couponCode || undefined,
        shipping: checkoutShipping,
        total: checkoutTotal,
        currency,
        paymentMethod,
        notes: isGift
          ? `[GIFT ORDER] Recipient: ${giftRecipient.trim() || 'Honored Recipient'}${giftMessage.trim() ? `\nGift Message: "${giftMessage.trim()}"` : ''}${notes.trim() ? `\nSpecial Requests: ${notes.trim()}` : ''}`
          : notes,
      };

      const newOrder = await createOrder(orderPayload);
      setConfirmedOrder(newOrder);
      if (!directItem) {
        clearCart();
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden border border-[#D9D0C1] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E8E0D2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#98702B]" />
            <h3 className="font-serif text-xl font-medium text-[#1E1B18]">
              {confirmedOrder ? 'Order Confirmed' : 'Insured Checkout & Vault Delivery'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6D6253] hover:text-[#1E1B18] rounded hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center py-4">
              <CheckCircle2 className="w-14 h-14 text-[#2E6B47] mx-auto mb-3" />
              <div className="text-xs uppercase tracking-[0.2em] text-[#8C764D] font-semibold">
                Payment & Order Verified
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1B18] font-medium mt-1">
                Thank You, {confirmedOrder.customerName}
              </h2>
              <p className="text-xs text-[#6B5F4F] mt-2 max-w-md mx-auto">
                Your order <strong className="font-mono text-[#1E1B18]">{confirmedOrder.orderNumber}</strong> has been secured in our vault. Our master artisan is preparing your insured hallmarked packaging.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-white border border-[#E5DDCF] p-5 rounded space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EAE0] text-xs gap-2">
                <div>
                  <span className="text-[#877A69]">Order Number:</span>{' '}
                  <strong className="font-mono text-[#1E1B18]">{confirmedOrder.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-[#877A69]">Date:</span>{' '}
                  <span className="text-[#1E1B18]">{new Date(confirmedOrder.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[#877A69]">Payment:</span>{' '}
                  <span className="font-semibold text-[#98702B]">{confirmedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Items in receipt */}
              <div className="divide-y divide-[#F2ECE1]">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border border-[#E8E0D2]" />
                      <div>
                        <div className="font-serif text-sm font-medium text-[#1E1B18]">{item.name}</div>
                        <div className="text-[11px] text-[#7A6E5E]">
                          Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono tabular-nums font-semibold text-[#1E1B18]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping address & Totals */}
              <div className="pt-3 border-t border-[#F0EAE0] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-[#2E2822] mb-1">Insured Shipping Address:</div>
                  <div className="text-[#685D4E] leading-relaxed">
                    {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city},<br />
                    {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.pincode}<br />
                    Phone: {confirmedOrder.phone}
                  </div>
                </div>

                <div className="space-y-1.5 text-right sm:border-l sm:border-[#F0EAE0] sm:pl-4">
                  <div className="flex justify-between text-[#685D4E]">
                    <span>Subtotal:</span>
                    <span className="font-mono tabular-nums">{formatPrice(confirmedOrder.subtotal)}</span>
                  </div>
                  {confirmedOrder.discount > 0 && (
                    <div className="flex justify-between text-[#2E6B47]">
                      <span>Privilege Discount:</span>
                      <span className="font-mono tabular-nums">-{formatPrice(confirmedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#685D4E]">
                    <span>Insured Courier:</span>
                    <span>{confirmedOrder.shipping === 0 ? 'FREE' : formatPrice(confirmedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1E1B18] pt-1.5 border-t border-[#F0EAE0]">
                    <span>Total Amount:</span>
                    <span className="font-mono tabular-nums text-[#98702B]">{formatPrice(confirmedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Presentation Details on Receipt */}
            {confirmedOrder.notes && confirmedOrder.notes.includes('[GIFT ORDER]') && (
              <div className="bg-[#FAF6EE] border border-[#EADBBD] p-4 rounded text-xs space-y-1.5">
                <div className="font-semibold text-[#8B6523] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#98702B]" />
                  <span>Complimentary Royal Velvet Gift Presentation Confirmed</span>
                </div>
                <div className="text-[#6D5D48] whitespace-pre-line pl-6 leading-relaxed italic">
                  {confirmedOrder.notes.replace('[GIFT ORDER] ', '')}
                </div>
                <div className="text-[10px] text-[#7A6E5E] pl-6 pt-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C9A24D]" />
                  <span>Personalized gold wax seal will be hand-applied by our artisan team.</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 text-xs font-medium text-[#4A4339] bg-white border border-[#DDD5C7] rounded hover:bg-[#F2ECE1] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Tax Invoice</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#383129] rounded transition-colors cursor-pointer"
              >
                Return to Gallery
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT FORM SCREEN */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                {errorMessage}
              </div>
            )}

            {/* Order Review Snippet */}
            <div className="bg-[#F5F0E6] p-4 rounded border border-[#E5DDD0] text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[#2E2822]">Order Summary ({checkoutItems.length} items)</span>
                <span className="font-mono tabular-nums font-bold text-sm text-[#98702B]">
                  {formatPrice(checkoutTotal)}
                </span>
              </div>
              <div className="text-[11px] text-[#706454] space-y-1">
                {checkoutItems.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="line-clamp-1">{item.product.name} (x{item.quantity})</span>
                    <span className="font-mono tabular-nums shrink-0 ml-2">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Shipping Details */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8B7349] mb-3">
                1. Customer & Delivery Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Radhika Sundaram"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98400 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="For tracking & digital receipt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">Postal PIN Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 600017"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#52493D] mb-1 font-medium">Street Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    placeholder="House / Apartment no., Street name, Landmark"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>

                <div>
                  <label className="block text-[#52493D] mb-1 font-medium">State / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Tamil Nadu"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#8B7349] mb-3">
                2. Payment Method
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                      : 'border-[#DDD5C7] bg-white hover:border-[#BAAA93]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="w-5 h-5 text-[#98702B]" />
                    <span className="text-[10px] font-semibold text-[#2E6B47]">Fast & Secure</span>
                  </div>
                  <div className="font-semibold text-[#1E1B18]">UPI & QR Code</div>
                  <div className="text-[10px] text-[#7A6E5E] mt-0.5">GPay, PhonePe, Paytm</div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                    paymentMethod === 'COD'
                      ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                      : 'border-[#DDD5C7] bg-white hover:border-[#BAAA93]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="w-5 h-5 text-[#98702B]" />
                    <span className="text-[10px] text-[#7A6E5E]">Assisted</span>
                  </div>
                  <div className="font-semibold text-[#1E1B18]">Cash on Delivery</div>
                  <div className="text-[10px] text-[#7A6E5E] mt-0.5">Pay upon inspection</div>
                </button>

                {/* Card / NetBanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                    paymentMethod === 'CARD'
                      ? 'border-[#98702B] bg-[#F7F2E7] ring-1 ring-[#98702B]'
                      : 'border-[#DDD5C7] bg-white hover:border-[#BAAA93]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="w-5 h-5 text-[#98702B]" />
                    <span className="text-[10px] text-[#7A6E5E]">Visa / MC</span>
                  </div>
                  <div className="font-semibold text-[#1E1B18]">Card / NetBanking</div>
                  <div className="text-[10px] text-[#7A6E5E] mt-0.5">Debit, Credit & EMI</div>
                </button>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="mt-3 p-3 bg-[#F4EFE6] rounded border border-[#E2D8C7] text-xs text-[#5C5243] flex items-center justify-between">
                  <span>UPI ID: <strong className="font-mono text-[#1E1B18]">meghnajewellery@okaxis</strong></span>
                  <span className="text-[11px] text-[#2B6E45] font-medium">Instant 0% transaction fee</span>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="mt-3 p-3 bg-[#F4EFE6] rounded border border-[#E2D8C7] text-xs text-[#5C5243]">
                  <span>Cash on Delivery is accompanied by our certified tamper-evident seal and gold verification assay card.</span>
                </div>
              )}
            </div>

            {/* Gift Options Section */}
            <div className="bg-white p-4 rounded border border-[#E5DDD0] space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#98702B] accent-[#98702B] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold text-xs text-[#1E1B18]">
                    <Gift className="w-4 h-4 text-[#98702B]" />
                    <span>Gift Options: This order is a gift</span>
                    <span className="text-[10px] text-[#2E6B47] bg-[#EAF5EC] px-1.5 py-0.2 rounded font-normal">
                      Complimentary
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6E5E] mt-0.5">
                    Includes royal velvet gift presentation box, satin ribbon wrap, and personalized handwritten parchment message card.
                  </p>
                </div>
              </label>

              {/* Revealed Personalized Gift Message Area */}
              {isGift && (
                <div className="pt-3 border-t border-[#F2ECE1] space-y-3 pl-7 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-[11px] font-medium text-[#52493D] mb-1">
                      Recipient Name (Printed on gift envelope)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sundaram / Dearest Sister"
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD5C7] rounded text-xs text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#52493D] mb-1">
                      <span>Personalized Gift Message</span>
                      <span className="text-[10px] text-[#8C7D6B] font-mono">
                        {giftMessage.length}/300 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={300}
                      placeholder="e.g. Wishing you timeless joy, prosperity and radiance with this handcrafted antique heirloom. With eternal love..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DDD5C7] rounded text-xs text-[#1E1B18] focus:outline-none focus:border-[#98702B] placeholder:text-[#9E907B]"
                    />
                  </div>

                  <div className="p-2.5 bg-[#FAF6EE] rounded border border-[#EADBBD] flex items-center gap-2 text-[11px] text-[#7A6743]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A24D] shrink-0" />
                    <span>Prices will be concealed on the enclosed delivery paperwork for gift orders.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div className="text-xs">
              <label className="block text-[#52493D] mb-1 font-medium">Artisan Notes & Custom Requests</label>
              <textarea
                rows={2}
                placeholder="e.g., Please add gold thread dori extension / Call before delivery"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E8E0D2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#6B5F4F]">
                <div>Total Payable: <strong className="font-mono tabular-nums text-base text-[#1E1B18]">{formatPrice(checkoutTotal)}</strong></div>
                <div className="text-[11px] text-[#2B6E45]">Includes BIS Hallmark & Armored Transit Insurance</div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#342D25] rounded transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {isSubmitting ? 'Confirming with Vault...' : `Confirm & Place Order (${formatPrice(checkoutTotal)})`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
