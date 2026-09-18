import React from 'react';
import { 
  Activity, 
  Database, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Globe2,
  Layers
} from 'lucide-react';

interface FeaturePanelsProps {
  onSelectFeature: (featureId: 'monitor' | 'explore' | 'analyze' | 'ai') => void;
}

export const FeaturePanels: React.FC<FeaturePanelsProps> = ({ onSelectFeature }) => {
  const panels = [
    {
      id: 'monitor' as const,
      tag: 'REAL-TIME TRACKING',
      title: 'LIVE MONITOR',
      description: 'Continuously observe environmental changes, land-cover transitions, and spectral heatmaps with swipe-comparison tools.',
      accent: 'border-[#42E8D0]/30 hover:border-[#42E8D0] group-hover:shadow-[0_0_24px_rgba(66,232,208,0.2)]',
      iconColor: 'text-[#42E8D0] bg-[#42E8D0]/10 border-[#42E8D0]/30',
      icon: Activity,
      gradient: 'from-[#42E8D0]/10 via-[#0C1C2A] to-[#06101A]',
    },
    {
      id: 'explore' as const,
      tag: 'OPEN STAC ARCHIVES',
      title: 'EXPLORE DATA',
      description: 'Access open Copernicus Sentinel-2 Level-2A imagery with 10-meter ground resolution, cloud masking, and raw scene provenance.',
      accent: 'border-[#4EA7FF]/30 hover:border-[#4EA7FF] group-hover:shadow-[0_0_24px_rgba(78,167,255,0.2)]',
      iconColor: 'text-[#4EA7FF] bg-[#4EA7FF]/10 border-[#4EA7FF]/30',
      icon: Database,
      gradient: 'from-[#4EA7FF]/10 via-[#0C1C2A] to-[#06101A]',
    },
    {
      id: 'analyze' as const,
      tag: 'REMOTE SENSING ENGINE',
      title: 'ANALYZE',
      description: 'Compute true scientific indices (NDVI for vegetation, NDBI for built-up, NDWI for water) with multi-year temporal trajectory curves.',
      accent: 'border-[#35D6A1]/30 hover:border-[#35D6A1] group-hover:shadow-[0_0_24px_rgba(53,214,161,0.2)]',
      iconColor: 'text-[#35D6A1] bg-[#35D6A1]/10 border-[#35D6A1]/30',
      icon: TrendingUp,
      gradient: 'from-[#35D6A1]/10 via-[#0C1C2A] to-[#06101A]',
    },
    {
      id: 'ai' as const,
      tag: 'GEMINI INTELLIGENCE',
      title: 'SATQUERYAI',
      description: 'Ask complex natural language questions. Receive authoritative, explainable scientific interpretations synthesized by Google Gemini.',
      accent: 'border-[#8B6CFF]/30 hover:border-[#8B6CFF] group-hover:shadow-[0_0_24px_rgba(139,108,255,0.2)]',
      iconColor: 'text-[#8B6CFF] bg-[#8B6CFF]/10 border-[#8B6CFF]/30',
      icon: Sparkles,
      gradient: 'from-[#8B6CFF]/10 via-[#0C1C2A] to-[#06101A]',
    },
  ];

  return (
    <section id="features-section" className="py-16 bg-[#03070D] border-b border-[#0C1C2A] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#42E8D0] uppercase tracking-widest font-semibold mb-2">
            <span>SCIENTIFIC CAPABILITIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineered for Autonomous Earth Observation
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Four specialized operational capabilities delivering zero-click satellite intelligence from orbit to your screen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {panels.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => onSelectFeature(p.id)}
                className={`group cursor-pointer rounded-2xl p-6 bg-gradient-to-b ${p.gradient} border ${p.accent} transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-xl`}
              >
                {/* Subtle Hover Aura */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${p.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-sans group-hover:text-slate-100 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                  <span>Explore Module</span>
                  <ArrowRight className="w-4 h-4 text-[#42E8D0] group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
