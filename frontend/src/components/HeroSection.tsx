import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Activity, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  Compass, 
  Database,
  Calendar,
  Satellite
} from 'lucide-react';
import { AnalysisContext } from '../lib/types';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  isAnalyzing: boolean;
  activeContext: AnalysisContext | null;
  onRunDemo?: () => void;
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  isAnalyzing,
  activeContext,
  onRunDemo,
  onExploreClick,
}) => {
  const [queryInput, setQueryInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim() && !isAnalyzing) {
      onSearch(queryInput.trim());
    }
  };

  const suggestionChips = [
    { label: "Visakhapatnam, Andhra Pradesh", query: "Analyze Visakhapatnam between 2021 and 2026" },
    { label: "Krishna River in Vijayawada", query: "Krishna River in Vijayawada" },
    { label: "Hyderabad Urban Growth", query: "Hyderabad, Telangana, India" },
    { label: "Gujarat Coastal & Croplands", query: "Gujarat, India" },
    { label: "Tokyo, Japan", query: "Tokyo, Japan" },
    { label: "London, United Kingdom", query: "London, United Kingdom" },
  ];

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#03070D] border-b border-[#0C1C2A]">
      {/* Cinematic Earth & Deep Space Visual Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Deep space radial aura */}
        <div className="absolute top-1/4 right-0 lg:right-[-10%] w-[650px] lg:w-[950px] h-[650px] lg:h-[950px] rounded-full bg-gradient-to-br from-[#4EA7FF]/10 via-[#42E8D0]/5 to-transparent blur-3xl opacity-70" />

        {/* Photorealistic Moving Satellite Earth Sphere */}
        <div className="absolute -right-32 sm:-right-20 lg:right-[-4%] top-[10%] lg:top-[4%] w-[480px] sm:w-[600px] lg:w-[780px] h-[480px] sm:h-[600px] lg:h-[780px] pointer-events-none select-none">
          {/* Deep Space Orbit Ellipse */}
          <div className="absolute inset-0 rounded-full border border-[#42E8D0]/20 scale-125 rotate-[-22deg] animate-pulse pointer-events-none" />
          <div className="absolute inset-[-40px] rounded-full border border-dashed border-[#4EA7FF]/20 rotate-[-22deg] pointer-events-none" />

          {/* 3D Realistic Earth Globe */}
          <div className="earth-sphere-realistic">
            {/* Realistic Earth Daymap Texture Rotating */}
            <div className="earth-surface" />
            {/* Realistic Drifting Cloud Layer */}
            <div className="earth-clouds" />
            {/* Day/Night Terminator Shadow & Spherical Depth */}
            <div className="earth-atmosphere-shadow" />
            {/* Atmospheric Rayleigh Scattering Glow Edge */}
            <div className="earth-rim-glow" />
          </div>

          {/* Active Sentinel-2 Orbiting Marker */}
          <div 
            className="absolute inset-[-60px] pointer-events-none"
            style={{ animation: 'satellite-orbit-sweep 24s linear infinite' }}
          >
            <div className="absolute top-8 right-16 flex items-center space-x-2">
              <div className="relative">
                <span className="w-3.5 h-3.5 rounded-full bg-[#42E8D0] block shadow-[0_0_16px_#42E8D0]" />
                <span className="w-8 h-8 rounded-full border border-[#42E8D0]/60 block absolute -top-[9px] -left-[9px] animate-ping" />
              </div>
              <div className="px-2 py-0.5 rounded-md bg-[#06101A]/90 border border-[#42E8D0]/50 text-[10px] font-mono text-[#42E8D0] shadow-xl backdrop-blur-md">
                SENTINEL-2A · 786 KM
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Dark Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#03070D] via-[#03070D]/90 to-transparent lg:w-3/5 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03070D] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-12 w-full flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Real-Data Tagline Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#0C1C2A]/90 border border-[#42E8D0]/30 backdrop-blur-md mb-6 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#42E8D0] shadow-[0_0_8px_#42E8D0] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-slate-200 uppercase font-semibold">
              REAL DATA · REAL CHANGE · AUTONOMOUS COPERNICUS STAC
            </span>
          </div>

          {/* Hero Editorial Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 font-sans">
            A Clearer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D0] via-[#55DDE0] to-[#4EA7FF]">
              Tomorrow.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed mb-8">
            Explore our planet through satellite data, intelligent queries, environmental insights, and powerful remote-sensing analysis tools.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              type="button"
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#42E8D0] to-[#4EA7FF] hover:from-[#3BE0C8] hover:to-[#3B96F5] text-[#03070D] font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#42E8D0]/25 hover:shadow-[#42E8D0]/40 flex items-center space-x-2 group"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {onRunDemo && (
              <button
                type="button"
                onClick={onRunDemo}
                disabled={isAnalyzing}
                className="px-5 py-3.5 rounded-xl bg-[#0C1C2A]/80 hover:bg-[#102536] border border-[#4EA7FF]/30 hover:border-[#4EA7FF]/60 text-slate-200 text-sm font-semibold transition-all flex items-center space-x-2 backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-[#42E8D0]" />
                <span>Launch SIH Demo ✦</span>
              </button>
            )}
          </div>

          {/* Hero Query Interface — "✦ Ask SatQueryAI" */}
          <div className="w-full max-w-2xl bg-[#0C1C2A]/85 backdrop-blur-2xl border border-[#42E8D0]/30 rounded-2xl p-3 shadow-2xl shadow-[#03070D]">
            <div className="flex items-center space-x-2 px-2 pb-2 text-[11px] font-mono text-[#42E8D0] font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask SatQueryAI</span>
            </div>

            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask anything about Earth... (e.g., 'What changed in Visakhapatnam between 2021 and 2026?')"
                className="w-full pl-10 pr-28 py-3 bg-[#06101A] border border-slate-700/70 hover:border-[#42E8D0]/50 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#42E8D0] focus:ring-2 focus:ring-[#42E8D0]/20 transition-all font-sans"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !queryInput.trim()}
                className="absolute right-1.5 px-4 py-2 bg-gradient-to-r from-[#42E8D0] to-[#4EA7FF] hover:from-[#3BE0C8] hover:to-[#3B96F5] text-[#03070D] font-bold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 font-mono shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin" />
                    <span>ANALYZING</span>
                  </>
                ) : (
                  <>
                    <span>ANALYZE</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {/* Suggestion Chips */}
            <div className="mt-2.5 pt-2.5 border-t border-[#102536] flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0">
                Suggestions:
              </span>
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSearch(chip.query)}
                  disabled={isAnalyzing}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-[#06101A] hover:bg-[#102536] border border-slate-800 hover:border-[#42E8D0]/40 text-slate-300 hover:text-[#42E8D0] text-[11px] transition-all font-sans"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 14: Real Project Statistics Strip */}
      <div className="relative z-20 w-full bg-[#06101A]/95 border-t border-[#0C1C2A] backdrop-blur-xl py-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-6 text-slate-200">
          <div>
            <div className="text-2xl lg:text-3xl font-extrabold font-mono text-[#42E8D0] tracking-tight">
              10m GSD
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
              Multispectral Ground Sample
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold font-mono text-[#4EA7FF] tracking-tight">
              100%
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
              Cloud-Filtered STAC Passes
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold font-mono text-[#35D6A1] tracking-tight">
              3 Indices
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
              NDVI · NDBI · NDWI
            </div>
          </div>

          <div>
            <div className="text-2xl lg:text-3xl font-extrabold font-mono text-[#FFB454] tracking-tight">
              Vector
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
              Autonomous Polygon Clusters
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl lg:text-3xl font-extrabold font-mono text-[#8B6CFF] tracking-tight">
              2020–2026
            </div>
            <div className="text-xs text-slate-400 font-sans mt-0.5 font-medium">
              Multi-Year Observation Archive
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
