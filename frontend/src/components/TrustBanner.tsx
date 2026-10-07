import React from 'react';
import { ShieldCheck, Gem, Truck, RotateCcw, Award } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'BIS 916 Hallmarked',
      subtitle: 'Government assay certified 22K pure antique gold',
    },
    {
      icon: Gem,
      title: 'Certified Natural Polki',
      subtitle: 'Uncut syndicate polki, natural rubies & emeralds',
    },
    {
      icon: Truck,
      title: 'Insured Armored Courier',
      subtitle: 'High-security discreet transit with OTP handover',
    },
    {
      icon: RotateCcw,
      title: 'Lifetime Exchange Value',
      subtitle: 'Guaranteed 100% gold benchmark exchange policy',
    },
  ];

  return (
    <section className="bg-white border-y border-[#E8E2D8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#FAF5EB] border border-[#E8DCBF] flex items-center justify-center text-[#98702B] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#1E1B18] leading-snug">
                  {p.title}
                </h4>
                <p className="text-xs text-[#7A6E5E] mt-0.5 leading-relaxed">
                  {p.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
