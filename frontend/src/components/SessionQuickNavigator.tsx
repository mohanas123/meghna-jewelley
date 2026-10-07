import React from 'react';
import { Compass, Palette, Sparkles, Layers, Award, BookOpen, Hammer, ShoppingBag } from 'lucide-react';

export const SessionQuickNavigator: React.FC = () => {
  const sessions = [
    { label: 'Antique Epochs', id: 'epochs-session', icon: Compass },
    { label: 'Haute Lookbook', id: 'lookbook-session', icon: Palette },
    { label: 'Trousseau Suite', id: 'trousseau-session', icon: Sparkles },
    { label: 'Pairing Studio', id: 'pairing-studio-session', icon: Layers },
    { label: 'Collector Vault', id: 'vault-session', icon: Award },
    { label: 'Patina vs. Gold', id: 'philosophy-session', icon: BookOpen },
    { label: 'Bespoke Atelier', id: 'bespoke-studio-session', icon: Hammer },
    { label: 'Heirloom Gallery', id: 'catalog-section', icon: ShoppingBag },
  ];

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#14110E] border-y border-[#29221B] py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C9A24D] font-semibold whitespace-nowrap flex items-center gap-1.5 shrink-0">
          <span>Explore Sessions:</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
          {sessions.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => handleScroll(s.id)}
                className="px-3 py-1.5 rounded text-xs font-medium text-[#C4B7A4] hover:text-[#FAF8F5] bg-[#1E1914] hover:bg-[#2C241D] border border-[#2B231B] hover:border-[#6B5A42] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
