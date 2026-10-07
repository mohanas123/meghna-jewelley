import React, { useState } from 'react';
import {
  ArrowLeft, RefreshCw, ShieldCheck, Truck, CheckCircle2, Clock,
  MapPin, Copy, Check, MessageSquare, AlertCircle, Phone, Package
} from 'lucide-react';
import type { Order } from '../types/index.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface OrderTrackingDetailProps {
  order: Order;
  onBack: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const OrderTrackingDetail: React.FC<OrderTrackingDetailProps> = ({
  order,
  onBack,
  onRefresh,
  isRefreshing = false,
}) => {
  const { formatPrice } = useCurrency();
  const [copiedAwb, setCopiedAwb] = useState(false);

  // Deterministic carrier & tracking number derived from orderNumber
  const carrier = 'Sequel Armored Logistics';
  const awbNumber = `SEQL-${order.orderNumber.replace(/[^0-9]/g, '') || '894210'}-IN`;

  const orderDate = new Date(order.createdAt);
  const formattedOrderDate = orderDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate estimated delivery: 3 days after creation
  const estDeliveryDate = new Date(orderDate);
  estDeliveryDate.setDate(estDeliveryDate.getDate() + 3);
  const formattedEstDelivery = estDeliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case 'Received':
        return 1;
      case 'In Production':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return 0;
      default:
        return 1;
    }
  };

  const currentStep = getStepProgress(order.status);

  const steps = [
    {
      step: 1,
      label: 'Order Confirmed',
      desc: 'BIS 916 Hallmark & vault reserve locked',
      time: formattedOrderDate,
    },
    {
      step: 2,
      label: 'Studio Craftsmanship',
      desc: 'Artisan repoussé inspection & velvet packing',
      time: currentStep >= 2 ? 'Studio Atelier, Chennai' : 'Pending Artisan Completion',
    },
    {
      step: 3,
      label: 'Armored Transit',
      desc: 'Insured high-security courier dispatched',
      time: currentStep >= 3 ? `${carrier} Air Hub` : 'Scheduled Post-Assay',
    },
    {
      step: 4,
      label: 'Delivered Safely',
      desc: 'Secure OTP inspection & patron handover',
      time: currentStep >= 4 ? 'Delivered' : `Est. ${formattedEstDelivery}`,
    },
  ];

  const handleCopyAwb = () => {
    navigator.clipboard.writeText(awbNumber);
    setCopiedAwb(true);
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  const handleWhatsAppSupport = () => {
    const text = encodeURIComponent(
      `Hello Meghna Jewellery Atelier, I am checking the live shipping progress of my Order #${order.orderNumber} (Tracking: ${awbNumber}). Could you provide the latest armored transit status?`
    );
    window.open(`https://wa.me/919840122890?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D8] gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#52493D] hover:text-[#1E1B18] transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </button>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-2.5 py-1 text-xs bg-white border border-[#DDD5C7] hover:border-[#98702B] rounded text-[#4A433A] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Real-time Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#98702B] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Status'}</span>
          </button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-white p-5 rounded border border-[#E5DDCF] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F2ECE1]">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#8A7D6B] font-semibold">
              Live Shipment Tracking
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-lg font-bold text-[#1E1B18]">{order.orderNumber}</span>
              <span className="text-[#8A7D6B]">·</span>
              <span className="text-xs text-[#52493D]">{formattedOrderDate}</span>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-[#F2ECE1] sm:pl-4">
            <span className="text-[10px] uppercase tracking-wider text-[#8A7D6B] block">Estimated Delivery</span>
            <span className="text-sm font-semibold text-[#98702B]">{formattedEstDelivery}</span>
          </div>
        </div>

        {/* Visual Progress Stepper (4 Stages) */}
        <div className="py-3">
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting bar background */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-[#E8E0D2] -z-0 hidden sm:block" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-[#98702B] -z-0 transition-all duration-500 hidden sm:block"
              style={{
                width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%`,
              }}
            />

            {steps.map((st) => {
              const isCompleted = currentStep >= st.step;
              const isCurrent = currentStep === st.step;

              return (
                <div key={st.step} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-[#1E1B18] text-[#FAF8F5] ring-4 ring-[#FAF8F5]'
                        : isCurrent
                        ? 'bg-[#98702B] text-white ring-4 ring-[#FAF8F5]'
                        : 'bg-[#F2EDE2] text-[#8C7D6B] ring-4 ring-[#FAF8F5]'
                    }`}
                  >
                    {isCompleted && currentStep > st.step ? (
                      <Check className="w-4 h-4 text-[#C9A24D]" />
                    ) : (
                      st.step
                    )}
                  </div>

                  <div className="mt-2">
                    <div
                      className={`text-xs font-semibold leading-tight ${
                        isCompleted ? 'text-[#1E1B18]' : 'text-[#8A7E6E]'
                      }`}
                    >
                      {st.label}
                    </div>
                    <div className="text-[10px] text-[#7A6E5E] mt-0.5 line-clamp-1 hidden sm:block">
                      {st.desc}
                    </div>
                    <div className="text-[10px] text-[#98702B] font-medium mt-0.5">
                      {st.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier Waybill details */}
        <div className="bg-[#FAF8F5] p-3.5 rounded border border-[#E5DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#EFE8DD] flex items-center justify-center text-[#98702B]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#1E1B18] flex items-center gap-1.5">
                <span>{carrier}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-sans font-medium">
                  Armored & Insured
                </span>
              </div>
              <div className="font-mono text-[#685D4E] flex items-center gap-2 mt-0.5">
                <span>AWB: {awbNumber}</span>
                <button
                  onClick={handleCopyAwb}
                  className="text-[#98702B] hover:text-[#1E1B18] flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Copy Tracking ID"
                >
                  {copiedAwb ? (
                    <>
                      <Check className="w-3 h-3 text-[#2E6B47]" />
                      <span className="text-[10px] text-[#2E6B47]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppSupport}
            className="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1E7E34] rounded flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer text-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Track on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Checkpoints & Transit Events Log */}
      <div className="bg-white p-5 rounded border border-[#E5DDCF] shadow-2xs space-y-3">
        <h4 className="font-serif text-sm font-semibold text-[#1E1B18] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#98702B]" />
          <span>Real-Time Checkpoints</span>
        </h4>

        <div className="space-y-4 pt-1">
          {currentStep >= 3 && (
            <div className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#98702B] mt-1 shrink-0 ring-4 ring-[#98702B]/20" />
              <div>
                <div className="font-semibold text-[#1E1B18]">
                  Out for Armored Delivery / Terminal In Transit
                </div>
                <div className="text-[11px] text-[#7A6E5E]">
                  En route with high-security armed vehicle. Handover requires customer verification.
                </div>
                <div className="text-[10px] text-[#9E907B] mt-0.5">
                  {formattedEstDelivery} · Armored Hub, {order.shippingAddress.city}
                </div>
              </div>
            </div>
          )}

          {currentStep >= 2 && (
            <div className="flex gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-[#2E6B47] mt-1 shrink-0" />
              <div>
                <div className="font-semibold text-[#1E1B18]">
                  Handcrafted Finished & Velvet Case Sealed
                </div>
                <div className="text-[11px] text-[#7A6E5E]">
                  Underwent 4-point gold assay check, BIS hallmark laser verification & physical weight report stamp.
                </div>
                <div className="text-[10px] text-[#9E907B] mt-0.5">
                  {formattedOrderDate} · Meghna Atelier Vault, Chennai
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2E6B47] mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-[#1E1B18]">
                Vault Order Reserved & Payment Verified
              </div>
              <div className="text-[11px] text-[#7A6E5E]">
                Payment method: {order.paymentMethod}. Heirlooms allocated from private collection.
              </div>
              <div className="text-[10px] text-[#9E907B] mt-0.5">
                {formattedOrderDate} · Meghna Jewellery Online Central
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Advisory Notice */}
      <div className="p-3.5 bg-[#FAF6EE] border border-[#E8DEC8] rounded text-xs text-[#6B5F4F] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#98702B] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#1E1B18]">Tamper-Proof Gold Seal Policy:</strong> Your shipment is enclosed in a serialized armored pouch with a holographic seal. Please inspect the seal before providing your delivery OTP to the armored agent.
        </div>
      </div>

      {/* Package Contents & Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Shipping Address */}
        <div className="bg-white p-4 rounded border border-[#E5DDCF] space-y-1">
          <div className="font-semibold text-[#1E1B18] flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#98702B]" />
            <span>Delivery Destination</span>
          </div>
          <div className="text-[#4A433A] font-medium">{order.customerName}</div>
          <div className="text-[#6D6253] leading-relaxed">
            {order.shippingAddress.street},<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </div>
          <div className="text-[#6D6253] pt-1">Tel: {order.phone}</div>
        </div>

        {/* Itemized Contents */}
        <div className="bg-white p-4 rounded border border-[#E5DDCF] space-y-2">
          <div className="font-semibold text-[#1E1B18] flex items-center gap-1.5 mb-1.5">
            <Package className="w-3.5 h-3.5 text-[#98702B]" />
            <span>Vault Contents ({order.items.length} items)</span>
          </div>
          <div className="divide-y divide-[#F4EFE6] max-h-36 overflow-y-auto">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={it.image} alt={it.name} className="w-7 h-7 object-cover rounded border border-[#E8E0D2]" />
                  <span className="line-clamp-1 text-[11px] text-[#2E2822]">{it.name} (x{it.quantity})</span>
                </div>
                <span className="font-mono tabular-nums text-[11px] font-semibold text-[#1E1B18]">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[#F2ECE1] flex justify-between font-bold text-xs text-[#1E1B18]">
            <span>Total Insured Value:</span>
            <span className="font-mono text-[#98702B]">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
