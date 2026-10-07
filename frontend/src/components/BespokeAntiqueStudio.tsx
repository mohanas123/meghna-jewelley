import React, { useState } from 'react';
import { Sparkles, Hammer, ShieldCheck, Check, Clock, Calendar, ArrowRight, FileText, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';
import { useCurrency } from '../context/CurrencyContext.tsx';

export const BespokeAntiqueStudio: React.FC = () => {
  const { showToast } = useToast();
  const { formatPrice } = useCurrency();

  const [serviceType, setServiceType] = useState<'commission' | 'restoration' | 'conversion' | 'restringing'>('commission');
  const [metalChoice, setMetalChoice] = useState<'silver925' | 'platinum-rhodium' | 'filigree-pewter'>('silver925');
  const [gemstoneChoice, setGemstoneChoice] = useState<'emerald' | 'sapphire' | 'polki' | 'pearl' | 'ruby'>('emerald');
  const [timelineWeeks, setTimelineWeeks] = useState<number>(4);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [heirloomNotes, setHeirloomNotes] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const serviceOptions = [
    {
      id: 'commission',
      title: 'Bespoke Antique Commission',
      desc: 'Ground-up creation of a custom Victorian collar, Nakshi cuff, or gala chandelier earrings.',
      baseHours: 55,
      estBaseINR: 58000,
    },
    {
      id: 'restoration',
      title: 'Heirloom Patina Restoration',
      desc: 'Herbal chemical re-oxidation of vintage silver jewellery with loose stone re-tightening.',
      baseHours: 18,
      estBaseINR: 18500,
    },
    {
      id: 'conversion',
      title: 'Antique Brooch / Relic Conversion',
      desc: 'Transform an antique family relic, crest, or coin into an imperial wearable neckpiece.',
      baseHours: 32,
      estBaseINR: 32000,
    },
    {
      id: 'restringing',
      title: 'Baroque Pearl Silk Knotting',
      desc: 'Professional stringing of natural baroque pearls with hand-knotted gold-silver zardozi cords.',
      baseHours: 14,
      estBaseINR: 14500,
    },
  ];

  const currentService = serviceOptions.find((s) => s.id === serviceType) || serviceOptions[0];

  // Calculate estimated investment
  const calculateEstimatedPrice = () => {
    let price = currentService.estBaseINR;
    if (metalChoice === 'platinum-rhodium') price += 12000;
    if (metalChoice === 'filigree-pewter') price += 6000;
    if (gemstoneChoice === 'polki') price += 24000;
    if (gemstoneChoice === 'emerald') price += 18000;
    if (gemstoneChoice === 'sapphire') price += 21000;
    return price;
  };

  const estimatedPrice = calculateEstimatedPrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientContact.trim()) {
      showToast({
        title: 'Details Required',
        message: 'Please provide your name and contact phone or email for the atelier master silversmith.',
        type: 'info',
      });
      return;
    }

    const ticketId = `MJ-BESPOKE-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket(ticketId);

    showToast({
      title: 'Bespoke Dossier Registered',
      message: `Your custom antique commission ticket #${ticketId} has been submitted to Master Silversmith atelier.`,
      type: 'success',
    });
  };

  return (
    <section id="bespoke-studio-session" className="bg-[#12100E] text-[#FAF8F5] py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#29221B]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#29221B]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[#C9A24D] font-semibold mb-2">
              <Hammer className="w-3.5 h-3.5 text-[#C9A24D]" />
              <span>Bespoke Atelier Session</span>
              <span aria-hidden="true" className="text-[#6B5A42]">·</span>
              <span>Antique Commission & Restoration</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FFFDF9] [text-wrap:balance]">
              Commission a One-Of-A-Kind Antique Heirlooms
            </h2>
            <p className="text-xs sm:text-sm text-[#A89C8B] mt-2 max-w-xl leading-relaxed">
              Work directly with our 4th-generation master silversmiths to conceive an exclusive non-gold antique masterpiece or restore family jewels with museum-grade herbal chiaroscuro patina.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
            <Clock className="w-4 h-4" />
            <span>Atelier Lead Time: 3 to 6 Weeks</span>
          </div>
        </div>

        {/* 2-Column Interactive Atelier Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Configuration Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Service Type */}
            <div className="bg-[#171411] border border-[#2B231B] p-5 rounded-sm">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A24D] font-semibold mb-3">
                1. Select Commission or Restoration Service
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((opt) => {
                  const isSelected = serviceType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setServiceType(opt.id as any)}
                      className={`text-left p-3.5 rounded transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] shadow-md ring-1 ring-[#C9A24D]'
                          : 'bg-[#12100E] border-[#262019] hover:border-[#6B5A42]'
                      }`}
                    >
                      <div className="font-serif text-sm font-medium text-[#FAF8F5] mb-1">
                        {opt.title}
                      </div>
                      <p className="text-[11px] text-[#8E806E] leading-relaxed">
                        {opt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Base Non-Gold Precious Metal */}
            <div className="bg-[#171411] border border-[#2B231B] p-5 rounded-sm">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A24D] font-semibold mb-3">
                2. Select Non-Gold Precious Base Metal & Patina
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'silver925',
                    name: 'Solid 925 Sterling Silver',
                    desc: 'Deep herbal charcoal chiaroscuro patina',
                  },
                  {
                    id: 'platinum-rhodium',
                    name: 'Platinum-Rhodium Alloy',
                    desc: 'Mirror Art Deco sheen with noir accents',
                  },
                  {
                    id: 'filigree-pewter',
                    name: 'Fine Silver Filigree',
                    desc: 'Organic vintage acid washed pewter finish',
                  },
                ].map((m) => {
                  const isSelected = metalChoice === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMetalChoice(m.id as any)}
                      className={`text-left p-3 rounded transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] shadow-md ring-1 ring-[#C9A24D]'
                          : 'bg-[#12100E] border-[#262019] hover:border-[#6B5A42]'
                      }`}
                    >
                      <div className="font-serif text-xs font-medium text-[#FAF8F5] mb-1">
                        {m.name}
                      </div>
                      <p className="text-[10px] text-[#8E806E]">{m.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Signature Gemstone Preference */}
            <div className="bg-[#171411] border border-[#2B231B] p-5 rounded-sm">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A24D] font-semibold mb-3">
                3. Primary Gemstone / Pearl Centerpiece
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'emerald', label: 'Colombian Emerald', col: '#0F5132' },
                  { id: 'sapphire', label: 'Ceylon Sapphire', col: '#1E3A8A' },
                  { id: 'polki', label: 'Syndicate Polki', col: '#9CA3AF' },
                  { id: 'pearl', label: 'Keshi Baroque Pearl', col: '#F9FAFB' },
                  { id: 'ruby', label: 'Burmese Ruby', col: '#991B1B' },
                ].map((gem) => {
                  const isSelected = gemstoneChoice === gem.id;
                  return (
                    <button
                      key={gem.id}
                      type="button"
                      onClick={() => setGemstoneChoice(gem.id as any)}
                      className={`p-2.5 rounded text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#29221A] border-[#C9A24D] ring-1 ring-[#C9A24D]'
                          : 'bg-[#12100E] border-[#262019] hover:border-[#6B5A42]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block mb-1 border border-white/20"
                        style={{ backgroundColor: gem.col }}
                      />
                      <div className="text-[11px] font-medium text-[#FAF8F5] truncate">
                        {gem.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Patron Contact & Heirloom Description */}
            <form onSubmit={handleSubmit} className="bg-[#171411] border border-[#2B231B] p-5 rounded-sm space-y-4">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#C9A24D] font-semibold">
                4. Register Patron Dossier for Master Silversmith Review
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#A89C8B] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Maharani Gayatri Devi / Vikram Mehta"
                    className="w-full bg-[#12100E] border border-[#2B231B] focus:border-[#C9A24D] text-[#FAF8F5] px-3.5 py-2.5 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#A89C8B] mb-1">Phone or Email Address *</label>
                  <input
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="e.g. +91 98401 00000 or patron@luxury.com"
                    className="w-full bg-[#12100E] border border-[#2B231B] focus:border-[#C9A24D] text-[#FAF8F5] px-3.5 py-2.5 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#A89C8B] mb-1">
                  Commission Notes / Heirloom Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={heirloomNotes}
                  onChange={(e) => setHeirloomNotes(e.target.value)}
                  placeholder="Describe your desired motifs (e.g. twin peacocks, floral repoussé, collar length in inches, or reference antique photograph)..."
                  className="w-full bg-[#12100E] border border-[#2B231B] focus:border-[#C9A24D] text-[#FAF8F5] px-3.5 py-2.5 rounded text-xs focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#FAF8F5] hover:bg-[#EAE0CD] text-[#141210] font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-3.5 h-3.5 text-[#141210]" />
                <span>Submit Bespoke Commission Dossier</span>
              </button>
            </form>

          </div>

          {/* Right Column: Live Atelier Ledger & Status (5 cols) */}
          <div className="lg:col-span-5 bg-[#171411] border border-[#2E271E] rounded-sm p-6 sm:p-7 sticky top-24 shadow-2xl">
            
            <div className="pb-4 border-b border-[#29221A] mb-5">
              <span className="text-[10px] uppercase tracking-wider font-mono text-[#8C7E6C] block">
                Atelier Calculation Ledger
              </span>
              <h3 className="font-serif text-xl font-normal text-[#FAF8F5]">
                {currentService.title}
              </h3>
            </div>

            {/* Spec Matrix */}
            <div className="space-y-3 pb-5 border-b border-[#29221A] mb-5 text-xs text-[#B3A591]">
              <div className="flex justify-between">
                <span>Selected Metal Finish:</span>
                <span className="font-medium text-[#FAF8F5] text-right">
                  {metalChoice === 'silver925' ? '925 Solid Oxidized Silver' : metalChoice === 'platinum-rhodium' ? 'Platinum-Rhodium Finish' : 'Fine Silver Filigree'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Centerpiece Gemstone:</span>
                <span className="font-medium text-[#FAF8F5] capitalize">
                  {gemstoneChoice} Gemstones
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hand-Chiseled Labor:</span>
                <span className="font-mono text-[#FAF8F5] tabular-nums">
                  ~{currentService.baseHours} Artisan Hours
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Completion:</span>
                <span className="font-mono text-[#E6CD92] tabular-nums">
                  3 to 5 Weeks
                </span>
              </div>
            </div>

            {/* Price Estimate */}
            <div className="bg-[#12100E] border border-[#262019] rounded p-4 mb-5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#A8987E] mb-1">
                Estimated Atelier Investment Bracket
              </div>
              <div className="font-mono text-2xl font-bold text-[#F5E6C8] tabular-nums">
                {formatPrice(estimatedPrice)}
              </div>
              <p className="text-[10px] text-[#786C5A] mt-1">
                *Final quotation confirmed after 3D conceptual sketch & gem weighing by Master Silversmith.
              </p>
            </div>

            {/* Ticket confirmation */}
            {submittedTicket ? (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded text-xs space-y-2">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-300">
                  <Check className="w-4 h-4" /> Commission Registered Successfully
                </div>
                <div className="font-mono text-[11px] text-white">
                  Ticket Reference: <span className="text-[#C9A24D]">{submittedTicket}</span>
                </div>
                <p className="text-[11px] text-emerald-300/80">
                  Our Chief Atelier Silversmith will contact you within 24 business hours to review sketches and finalize gemstone collet details.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-[#12100E] border border-[#262019] rounded text-xs text-[#9E8F7C] flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
                <span>
                  All custom commissions include private sketch consultations, progress photo updates from the forge, and hallmark certification upon completion.
                </span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
