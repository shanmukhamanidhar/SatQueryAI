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
  Trees,
  Droplets,
  Building2,
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
    { label: "Visakhapatnam, India", query: "Analyze Visakhapatnam between 2021 and 2026", color: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950/40 dark:border-blue-900/50" },
    { label: "Krishna River (Vijayawada)", query: "Krishna River in Vijayawada", color: "text-sky-700 bg-sky-50 border-sky-200 dark:text-sky-300 dark:bg-sky-950/40 dark:border-sky-900/50" },
    { label: "Hyderabad Urban Growth", query: "Hyderabad, Telangana, India", color: "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/40 dark:border-orange-900/50" },
    { label: "Bengaluru IT Sprawl", query: "Bengaluru, Karnataka between 2021 and 2026", color: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-900/50" },
    { label: "Amazon Rainforest Basin", query: "Analyze Para, Brazil between 2021 and 2026", color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900/50" },
    { label: "Tokyo Bay Coastal Metro", query: "Tokyo, Japan", color: "text-indigo-700 bg-indigo-50 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-900/50" },
  ];

  return (
    <section id="hero" className="relative min-h-[85vh] flex flex-col justify-between overflow-hidden bg-white dark:bg-[#09090b] studio-grid border-b border-slate-200 dark:border-zinc-800 transition-colors">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Radial Ambient Aura */}
        <div className="absolute top-1/4 right-0 lg:right-[-5%] w-[600px] lg:w-[850px] h-[600px] lg:h-[850px] rounded-full bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-transparent blur-3xl opacity-70" />

        {/* Photorealistic Moving Satellite Earth Sphere */}
        <div className="absolute -right-32 sm:-right-20 lg:right-[-4%] top-[12%] lg:top-[6%] w-[460px] sm:w-[580px] lg:w-[740px] h-[460px] sm:h-[580px] lg:h-[740px] pointer-events-none select-none">
          {/* Orbital Orbit Ellipse */}
          <div className="absolute inset-0 rounded-full border border-blue-500/20 scale-125 rotate-[-22deg] animate-pulse pointer-events-none" />
          <div className="absolute inset-[-40px] rounded-full border border-dashed border-slate-400/20 dark:border-blue-400/20 rotate-[-22deg] pointer-events-none" />

          {/* 3D Earth Globe Container */}
          <div className="earth-sphere-realistic">
            <div className="earth-surface" />
            <div className="earth-clouds" />
            <div className="earth-atmosphere-shadow" />
            <div className="earth-rim-glow" />
          </div>

          {/* Sentinel-2 Orbiting Telemetry Marker */}
          <div 
            className="absolute inset-[-60px] pointer-events-none"
            style={{ animation: 'satellite-orbit-sweep 26s linear infinite' }}
          >
            <div className="absolute top-8 right-16 flex items-center space-x-2">
              <div className="relative">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 block shadow-[0_0_14px_#2563eb]" />
                <span className="w-8 h-8 rounded-full border border-blue-500/60 block absolute -top-[9px] -left-[9px] animate-ping" />
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-blue-200 dark:border-blue-800 text-[10px] font-mono text-blue-700 dark:text-blue-400 shadow-md backdrop-blur-md font-semibold">
                SENTINEL-2A · 786 KM
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Fade Gradients for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent dark:from-[#09090b] dark:via-[#09090b]/95 dark:to-transparent lg:w-3/5 z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-[#09090b] dark:to-transparent z-10 pointer-events-none" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 pt-12 lg:pt-20 pb-12 w-full flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 backdrop-blur-md mb-6 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-slate-700 dark:text-zinc-300 uppercase font-semibold">
              COPERNICUS MULTISPECTRAL OBSERVATION · REAL-TIME STAC
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6 font-sans">
            Earth Observation. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-300">
              Clear. Explainable.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 max-w-xl font-normal leading-relaxed mb-8">
            Investigate environmental dynamics, deforestation, water security, and urban sprawl across real satellite imagery. Ask in plain language—get verifiable scientific indices and vector boundaries.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              type="button"
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm tracking-wide transition-all shadow-md shadow-blue-500/25 flex items-center space-x-2 group"
            >
              <span>Explore Satellite Maps</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Hero Query Interface */}
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-black/60 transition-all">
            <div className="flex items-center space-x-2 px-1 pb-2.5 text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Any Location on Earth</span>
            </div>

            <form onSubmit={handleSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask about changes anywhere... (e.g. 'What changed in Visakhapatnam?')"
                className="w-full pl-10 pr-28 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !queryInput.trim()}
                className="absolute right-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5 font-mono shadow-xs"
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
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
              <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase tracking-wider shrink-0 font-medium">
                Preset Intel:
              </span>
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSearch(chip.query)}
                  disabled={isAnalyzing}
                  className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all font-sans shadow-xs ${chip.color}`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purposeful Multi-Color Statistics Strip */}
      <div className="relative z-20 w-full bg-slate-50 dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* Blue: Resolution */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
              <Satellite className="w-4 h-4" />
              <span className="text-xl lg:text-2xl font-black font-mono tracking-tight">10m GSD</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Multispectral Ground Sample
            </div>
          </div>

          {/* Sky: STAC Coverage */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 mb-1">
              <Globe2 className="w-4 h-4" />
              <span className="text-xl lg:text-2xl font-black font-mono tracking-tight">100% Real</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Copernicus STAC Discovery
            </div>
          </div>

          {/* Green: Scientific Indices */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
              <Trees className="w-4 h-4" />
              <span className="text-xl lg:text-2xl font-black font-mono tracking-tight">3 Indices</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              NDVI · NDBI · NDWI
            </div>
          </div>

          {/* Orange: Vector Polygons */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="text-xl lg:text-2xl font-black font-mono tracking-tight">Vector</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Hectare-Quantified Polygons
            </div>
          </div>

          {/* Red/Crimson: Time Machine */}
          <div className="col-span-2 md:col-span-1 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xl lg:text-2xl font-black font-mono tracking-tight">2020–2026</span>
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400 font-medium">
              Multi-Year Time Slider
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
