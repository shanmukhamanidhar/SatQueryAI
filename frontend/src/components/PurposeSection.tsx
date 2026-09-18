import React from 'react';
import { Shield, HeartHandshake, Sparkles } from 'lucide-react';

export const PurposeSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#06101A] border-b border-[#0C1C2A] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="text-[11px] font-mono text-[#42E8D0] uppercase tracking-widest font-semibold mb-2">
            OUR SCIENTIFIC PURPOSE
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Empowering Global Earth Stewardship
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Column 1 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#03070D]/60 border border-slate-800/80 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-[#42E8D0]/10 border border-[#42E8D0]/30 flex items-center justify-center text-[#42E8D0] mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#42E8D0] uppercase mb-1">
              FOR A SAFER WORLD
            </h3>
            <div className="text-lg font-bold text-white mb-2">
              Monitor. Prepare. Respond.
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Continuous multispectral observation identifies rapid land alterations and infrastructural stress before they escalate into unchecked ecological damage.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#03070D]/60 border border-slate-800/80 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-[#35D6A1]/10 border border-[#35D6A1]/30 flex items-center justify-center text-[#35D6A1] mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#35D6A1] uppercase mb-1">
              FOR A HEALTHIER PLANET
            </h3>
            <div className="text-lg font-bold text-white mb-2">
              Understand. Protect. Sustain.
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Scientific indices democratize environmental insight. From canopy biomass to surface water security, transparency drives sustainable planning.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-[#03070D]/60 border border-slate-800/80 backdrop-blur-md">
            <div className="h-12 w-12 rounded-xl bg-[#8B6CFF]/10 border border-[#8B6CFF]/30 flex items-center justify-center text-[#8B6CFF] mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-mono font-bold tracking-widest text-[#8B6CFF] uppercase mb-1">
              FOR FUTURE GENERATIONS
            </h3>
            <div className="text-lg font-bold text-white mb-2">
              Data for a better tomorrow.
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Immutable Copernicus STAC archives paired with explainable Gemini AI ensure objective, reproducible evidence for researchers and policymakers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
