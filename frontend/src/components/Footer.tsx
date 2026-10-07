import React from 'react';
import { ShieldCheck, Phone, Mail, MapPin, MessageCircle, Lock } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenAdmin }) => {
  return (
    <footer className="bg-[#171513] text-[#FAF8F5] pt-16 pb-12 border-t border-[#29241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2E2822]">
          {/* Brand Col */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-[0.08em] uppercase text-[#F2ECE1]">
              Meghna Jewellery
            </h3>
            <p className="text-xs text-[#9E907B] leading-relaxed">
              Curators of rare handcrafted fancy antique non-gold jewellery, Victorian 925 sterling silver collars, Art Deco platinum-dipped sapphires, and heirloom trousseau suites.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9A24D]">
              <ShieldCheck className="w-4 h-4" />
              <span>925 Sterling Silver & Platinum Assay (Non-Gold)</span>
            </div>
          </div>

          {/* Heirlooms Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C9A24D] font-semibold">
              The Antique Vault
            </h4>
            <ul className="space-y-2 text-xs text-[#B5A58E]">
              <li>
                <button
                  onClick={() => onSelectCategory('Chokers & Necklaces')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Victorian Silver Collars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Earrings & Jhumkas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blackened Bell Jhumkas & Chandbalis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bangles & Kadas')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sculpted Peacock Silver Kadas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Rani Haars')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Baroque Keshi Pearl Haars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Bridal Sets')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Imperial Gala Trousseau Suites
                </button>
              </li>
            </ul>
          </div>

          {/* Atelier Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C9A24D] font-semibold">
              Atelier Concierge
            </h4>
            <div className="space-y-2 text-xs text-[#B5A58E]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A24D] shrink-0 mt-0.5" />
                <span>14/B Heritage Guild, T. Nagar, Chennai 600017, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span>+91 98401 22890 (Studio Private Line)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C9A24D] shrink-0" />
                <span>concierge@meghnajewellery.com</span>
              </div>
              <a
                href="https://wa.me/919840122890"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#4CAF50] hover:text-[#81C784] transition-colors pt-1"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat with Goldsmith on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Merchant Portal & Security */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C9A24D] font-semibold">
              Artisan Governance
            </h4>
            <p className="text-xs text-[#9E907B] leading-relaxed">
              Armored high-security logistics handled through Sequel Logistics with end-to-end transit liability insurance.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 bg-[#25201A] hover:bg-[#342D25] border border-[#443828] text-[#C9A24D] rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Studio Admin Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6D5A] gap-4">
          <div>
            © {new Date().getFullYear()} Meghna Jewellery Private Limited. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>BIS Registration: TN-48201</span>
            <span>Syndicate Polki Certified</span>
            <span>Hallmark Bureau Inspected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
