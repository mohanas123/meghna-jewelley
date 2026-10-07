import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';

interface PrivateSalonBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateSalonBookingModal: React.FC<PrivateSalonBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sessionType, setSessionType] = useState('Victorian & Gala Styling');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [notes, setNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const ref = `SALON-${Date.now().toString().slice(-5)}`;
    setBookingRef(ref);
    setIsSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hello Meghna Jewellery Salon Concierge, I would like to schedule a private styling session for ${sessionType}. My name is ${name || 'Patron'}.`
    );
    window.open(`https://wa.me/919840122890?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#FAF8F5] w-full max-w-xl rounded-sm shadow-2xl border border-[#DCD3C3] overflow-hidden my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFCF] bg-[#181614] text-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#C9A24D]" />
            <div>
              <h3 className="font-serif text-xl font-medium text-[#FFFDF9]">
                Private Atelier & Styling Salon
              </h3>
              <p className="text-[11px] text-[#A69986]">
                Complimentary 1-on-1 virtual consultation with our Senior Curator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A69986] hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#EAF5EC] border border-[#BDE0C6] flex items-center justify-center text-[#2E6B47] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-widest text-[#8C7449] font-mono font-semibold">
                Appointment Requested
              </div>
              <h4 className="font-serif text-2xl font-medium text-[#1E1B18] mt-1">
                Thank You, {name}
              </h4>
              <p className="text-xs text-[#706454] mt-2 max-w-md mx-auto leading-relaxed">
                Your private salon consultation <strong className="font-mono text-[#1E1B18]">{bookingRef}</strong> has been received. Our senior jewellery curator will confirm your appointment via WhatsApp.
              </p>
            </div>

            <div className="bg-white p-4 rounded border border-[#E5DDCF] text-xs text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#807261]">Session Type:</span>
                <span className="font-medium text-[#1E1B18]">{sessionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#807261]">Date & Time:</span>
                <span className="font-medium text-[#1E1B18]">{preferredDate || 'Earliest Available'} at {preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#807261]">Direct WhatsApp:</span>
                <span className="font-mono text-[#1E1B18]">{phone}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#2B5E39] bg-[#EAF5EC] hover:bg-[#DDF0E0] border border-[#BDE0C6] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#2B5E39]" />
                <span>Message Curator Directly</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#1E1B18] hover:bg-[#383129] rounded transition-colors cursor-pointer"
              >
                Return to Gallery
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-xs">
            <div>
              <label className="block text-[#52493D] mb-1 font-medium">Your Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Radhika Sundaram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[#52493D] mb-1 font-medium">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
              </div>

              <div>
                <label className="block text-[#52493D] mb-1 font-medium">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="For calendar invite"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#52493D] mb-1 font-medium">Curatorial Focus</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              >
                <option value="Victorian & Gala Styling">Victorian & Gala Non-Gold Styling</option>
                <option value="Bridal Trousseau Curation">Antique Bridal Trousseau Curation</option>
                <option value="Custom Silver Restoration">Custom Silver Sizing & Patina Restoration</option>
                <option value="Emerald & Sapphire High Jewellery">Colombian Emerald & Sapphire Selection</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[#52493D] mb-1 font-medium">Preferred Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                />
              </div>

              <div>
                <label className="block text-[#52493D] mb-1 font-medium">Preferred Time Slot</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
                >
                  <option value="11:00 AM">11:00 AM – Morning Salon</option>
                  <option value="02:30 PM">02:30 PM – Afternoon Salon</option>
                  <option value="05:30 PM">05:30 PM – Evening Salon</option>
                  <option value="07:30 PM">07:30 PM – Twilight Salon</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#52493D] mb-1 font-medium">Special Requests or Wardrobe Details</label>
              <textarea
                rows={2}
                placeholder="Mention outfit colors, event dates, or specific pieces you want the curator to present..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#DDD5C7] rounded text-[#1E1B18] focus:outline-none focus:border-[#98702B]"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#7A6E5E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#98702B]" />
                <span>Complimentary · No Purchase Obligation</span>
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#383129] text-white font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer shadow-xs"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
