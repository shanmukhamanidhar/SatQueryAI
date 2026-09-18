import React, { useState } from 'react';
import { 
  Globe2, 
  Search, 
  Sparkles, 
  Sliders, 
  FileText, 
  Activity, 
  ShieldCheck, 
  Compass, 
  Menu, 
  X, 
  Clock, 
  Layers,
  MapPin,
  Flame,
  Radio,
  ExternalLink,
  ArrowRight,
  Maximize2,
  Satellite
} from 'lucide-react';
import { SatQueryLogo } from './SatQueryLogo';
import { AnalysisContext } from '../lib/types';

interface NavigationProps {
  currentView: 'home' | 'studio';
  setCurrentView: (view: 'home' | 'studio') => void;
  onSearch: (query: string) => void;
  isAnalyzing: boolean;
  activeContext: AnalysisContext | null;
  expertMode: boolean;
  setExpertMode: (val: boolean) => void;
  onOpenReport: () => void;
  onOpenProvenance: () => void;
  onOpenRawSatellite?: () => void;
  onRunDemo?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  onSearch,
  isAnalyzing,
  activeContext,
  expertMode,
  setExpertMode,
  onOpenReport,
  onOpenProvenance,
  onOpenRawSatellite,
  onRunDemo,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && !isAnalyzing) {
      onSearch(searchInput.trim());
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', action: () => { setCurrentView('home'); onScrollToSection?.('hero'); } },
    { id: 'features', label: 'Capabilities', action: () => { if (currentView !== 'home') setCurrentView('home'); setTimeout(() => onScrollToSection?.('features-section'), 100); } },
    { id: 'live-earth', label: 'Live Studio', action: () => { if (currentView === 'home') { onScrollToSection?.('live-earth-section'); } else { setCurrentView('studio'); } } },
    { id: 'environmental', label: 'Environmental', action: () => { if (currentView !== 'home') setCurrentView('home'); setTimeout(() => onScrollToSection?.('environmental-section'), 100); } },
    { id: 'monitoring', label: 'Hotspots', action: () => { if (currentView !== 'home') setCurrentView('home'); setTimeout(() => onScrollToSection?.('monitoring-section'), 100); } },
  ];

  const quickPrompts = [
    "Visakhapatnam, Andhra Pradesh",
    "Krishna River in Vijayawada",
    "Hyderabad, Telangana",
    "Bengaluru, Karnataka",
    "Gujarat Coast, India",
    "Mumbai, Maharashtra",
    "Delhi NCR, India",
    "Dubai, UAE",
    "Tokyo, Japan",
    "London, United Kingdom",
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#03070D]/95 backdrop-blur-2xl border-b border-[#0C1C2A] transition-all select-none">
      {/* Top Telemetry & Sensor Ticker Ribbon */}
      <div className="px-4 lg:px-8 py-1.5 bg-[#06101A]/90 border-b border-[#0C1C2A]/80 flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto no-scrollbar gap-4">
        {/* Left Side: Sensor & Active Location Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 text-[#42E8D0] font-semibold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-[#42E8D0] shadow-[0_0_8px_#42E8D0] animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-bold">COPERNICUS SENTINEL-2 L2A</span>
          </div>

          {activeContext && (
            <>
              <span className="text-slate-700 hidden sm:inline">|</span>
              <div className="flex items-center space-x-1.5 text-slate-100 font-semibold">
                <Compass className="w-3.5 h-3.5 text-[#42E8D0]" />
                <span className="text-[#42E8D0] font-bold">{activeContext.location.name}</span>
                {activeContext.location.admin_region && !activeContext.location.name.includes(activeContext.location.admin_region) && (
                  <span className="text-slate-400 hidden sm:inline">({activeContext.location.admin_region}, {activeContext.location.country})</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Comprehensive Scientific Telemetry */}
        <div className="flex items-center space-x-3 shrink-0 text-[10.5px]">
          {activeContext ? (
            <>
              <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded bg-[#081724] border border-[#102536]">
                <span className="text-slate-500 uppercase">AOI:</span>
                <strong className="text-[#42E8D0]">~{activeContext.total_aoi_hectares.toLocaleString()} ha</strong>
              </div>

              <div className="hidden md:flex items-center space-x-1 px-2 py-0.5 rounded bg-[#081724] border border-[#102536]">
                <span className="text-slate-500 uppercase">Archive:</span>
                <strong className="text-slate-200">{activeContext.actual_before_date}</strong>
                <span className="text-slate-500">→</span>
                <strong className="text-[#42E8D0]">{activeContext.actual_after_date}</strong>
              </div>

              <div className="hidden lg:flex items-center space-x-1 px-2 py-0.5 rounded bg-[#081724] border border-[#102536]">
                <span className="text-slate-500 uppercase">GSD:</span>
                <strong className="text-slate-300">10m Multispectral</strong>
              </div>

              <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#081724] border border-[#102536] text-[#35D6A1]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">{activeContext.confidence.overall_score}% Conf ({activeContext.confidence.rating})</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-slate-500 font-mono text-[10.5px]">
              <Radio className="w-3 h-3 text-[#FFB454] animate-pulse" />
              <span>AWAITING EARTH OBSERVATION TARGET</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: SatQueryAI Logo */}
        <div 
          onClick={() => { setCurrentView('home'); onScrollToSection?.('hero'); }}
          className="cursor-pointer shrink-0"
        >
          <SatQueryLogo size="md" />
        </div>

        {/* Center: In Studio Mode show full search bar, in Home mode show Nav Links */}
        {currentView === 'studio' ? (
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ask about changes anywhere on Earth (e.g., 'What changed in Visakhapatnam between 2021 and 2026?')"
                className="w-full pl-9 pr-24 py-2 bg-[#06101A] border border-slate-700/80 hover:border-[#42E8D0]/50 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#42E8D0] focus:ring-1 focus:ring-[#42E8D0]/20 transition-all font-sans shadow-inner"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !searchInput.trim()}
                className="absolute right-1 px-3 py-1.5 bg-gradient-to-r from-[#42E8D0] to-[#4EA7FF] hover:from-[#3BE0C8] hover:to-[#3B96F5] text-[#03070D] font-bold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 font-mono shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>SCAN</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>QUERY</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all tracking-wide text-slate-300 hover:text-white hover:bg-white/5"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right: View Switcher, Mode, Provenance, Report, Demo */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {/* Primary View Switcher Button (Home vs Studio) */}
          {currentView === 'home' ? (
            <button
              type="button"
              onClick={() => setCurrentView('studio')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#42E8D0]/15 to-[#4EA7FF]/15 hover:from-[#42E8D0]/25 hover:to-[#4EA7FF]/25 border border-[#42E8D0]/50 text-[#42E8D0] hover:text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-sm flex items-center space-x-1.5"
              title="Launch full-screen satellite analysis studio"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>STUDIO</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-3.5 py-1.5 rounded-xl bg-[#0C1C2A] hover:bg-[#102536] border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold font-mono transition-all flex items-center space-x-1.5"
              title="Return to the planetary overview landing page"
            >
              <Globe2 className="w-3.5 h-3.5 text-[#42E8D0]" />
              <span>HOME</span>
            </button>
          )}

          {/* Simple vs Expert Mode Pill Switch */}
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-[#0C1C2A] border border-slate-700/60 text-xs">
            <button
              type="button"
              onClick={() => setExpertMode(false)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                !expertMode 
                  ? 'bg-[#42E8D0]/20 text-[#42E8D0] font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simple
            </button>
            <button
              type="button"
              onClick={() => setExpertMode(true)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center space-x-1 ${
                expertMode 
                  ? 'bg-[#FFB454]/20 text-[#FFB454] font-semibold shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Expert</span>
            </button>
          </div>

          {/* SIH Demo Walkthrough Button */}
          {onRunDemo && (
            <button
              type="button"
              onClick={onRunDemo}
              disabled={isAnalyzing}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#35D6A1]/10 hover:bg-[#35D6A1]/20 border border-[#35D6A1]/30 text-[#35D6A1] text-xs font-mono font-semibold transition-all shadow-sm"
              title="Automated Smart India Hackathon walkthrough for Visakhapatnam"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#35D6A1] animate-ping" />
              <span>SIH DEMO</span>
            </button>
          )}

          {/* Evidence Provenance Trigger */}
          <button
            type="button"
            onClick={onOpenProvenance}
            disabled={!activeContext}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0C1C2A] hover:bg-[#102536] border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Inspect Data Provenance & Copernicus Scenes"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#35D6A1]" />
            <span>Provenance</span>
          </button>

          {/* Raw Satellite Comparison Studio Option Button */}
          {onOpenRawSatellite && (
            <button
              type="button"
              onClick={onOpenRawSatellite}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orbit-cyan/20 to-emerald-500/20 hover:from-orbit-cyan/30 hover:to-emerald-500/30 border border-orbit-cyan/50 text-orbit-cyan hover:text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)]"
              title="Compare raw optical satellite images side-by-side with timeline choice"
            >
              <Satellite className="w-3.5 h-3.5 text-orbit-cyan animate-pulse" />
              <span className="hidden lg:inline">RAW SATELLITE (SIDE-BY-SIDE)</span>
              <span className="lg:hidden">RAW SATS</span>
            </button>
          )}

          {/* Executive PDF Report Trigger */}
          <button
            type="button"
            onClick={onOpenReport}
            disabled={!activeContext}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#4EA7FF] to-[#6D8DFF] hover:from-[#3B82F6] hover:to-[#4EA7FF] text-white text-xs font-semibold transition-all shadow-md shadow-[#4EA7FF]/20 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Download Executive Analysis Report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0C1C2A] border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quick Prompts Strip in Studio Mode */}
      {currentView === 'studio' && (
        <div className="px-4 lg:px-8 py-1.5 bg-[#06101A]/80 border-t border-[#0C1C2A]/60 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 font-mono uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <Sparkles className="w-3 h-3 text-[#42E8D0]" />
            <span>Quick Intel:</span>
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSearch(p)}
              disabled={isAnalyzing}
              className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#081724] hover:bg-[#102536] border border-slate-700/60 text-slate-300 hover:text-[#42E8D0] text-xs transition-colors font-sans"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-[#06101A] border-b border-[#0C1C2A] space-y-3 font-sans animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setCurrentView(currentView === 'home' ? 'studio' : 'home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#42E8D0] font-bold bg-[#42E8D0]/10 border border-[#42E8D0]/30"
            >
              {currentView === 'home' ? 'Switch to Studio Workspace' : 'Switch to Planetary Overview'}
            </button>
            {onOpenRawSatellite && (
              <button
                type="button"
                onClick={() => {
                  onOpenRawSatellite();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-orbit-cyan font-bold bg-orbit-cyan/10 border border-orbit-cyan/30 flex items-center space-x-2"
              >
                <Satellite className="w-4 h-4 text-orbit-cyan" />
                <span>Raw Satellite Timeline (Side-by-Side)</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-[#0C1C2A] flex flex-wrap gap-2">
            {onRunDemo && (
              <button
                type="button"
                onClick={() => {
                  onRunDemo();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#35D6A1]/15 text-[#35D6A1] text-xs font-mono font-bold flex items-center justify-center space-x-2"
              >
                <span>Launch SIH Demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenProvenance();
                setMobileMenuOpen(false);
              }}
              disabled={!activeContext}
              className="flex-1 py-2 px-3 rounded-lg bg-[#0C1C2A] border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center space-x-1.5 disabled:opacity-40"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#35D6A1]" />
              <span>Provenance</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
