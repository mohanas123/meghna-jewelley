import React from 'react';
import { Hammer, Sparkles, Gem, Clock, ShieldCheck, Award } from 'lucide-react';

export const CraftsmanshipStory: React.FC = () => {
  const techniques = [
    {
      title: 'Nakshi & Repoussé Art',
      desc: 'Master artisans hand-chisel relief sculptures of peacocks, temple gopurams, and goddesses onto solid 22K sheets without dies or moulds.',
      tag: 'Ancient Chola Tradition',
    },
    {
      title: 'Syndicate Polki & Jadau',
      desc: 'Uncut flat diamonds set in pure 24K gold foil (daak) to reflect natural candlelight, complemented by bezel-set Burmese rubies.',
      tag: 'Royal Mughal Legacy',
    },
    {
      title: 'Antique Oxidation & Patina',
      desc: 'Special proprietary herbal wash creates an heirloom darkened golden glow, accentuating the three-dimensional depth of carvings.',
      tag: 'Time-Honored Finishing',
    },
  ];

  return (
    <section className="bg-[#1C1A17] text-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2D2822]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[#C9A24D] font-semibold mb-2">
            The Living Atelier
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal [text-wrap:balance]">
            Handcrafted With Reverence Across Five Centuries
          </h2>
          <p className="text-xs text-[#9E907B] mt-3 leading-relaxed">
            Every Meghna Jewellery creation begins as molten 24K gold, beaten by hand, and sculpted with chisels passed through four generations of hereditary Tamil goldsmiths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techniques.map((tech, idx) => (
            <div
              key={idx}
              className="bg-[#24201B] border border-[#3A3329] p-6 rounded-sm space-y-3 relative overflow-hidden group hover:border-[#98702B] transition-colors"
            >
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9A24D] font-bold">
                {tech.tag}
              </div>
              <h3 className="font-serif text-xl font-medium text-[#F4EFE6]">
                {tech.title}
              </h3>
              <p className="text-xs text-[#9E907B] leading-relaxed">
                {tech.desc}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#C9A24D]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Hand Sculpted</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#2A241C] border border-[#443827] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1C1915] border border-[#5E4C2F] flex items-center justify-center text-[#C9A24D] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-medium text-white">
                Individual Hallmarking & Assay Guarantee
              </h4>
              <p className="text-xs text-[#B5A58E] mt-0.5">
                Every piece carries an individual BIS laser-etched hallmark ID alongside a certified physical metallurgical breakdown certificate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
