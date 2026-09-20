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
  Layers,
  Radio,
  ArrowRight,
  Satellite,
  Sun,
  Moon,
  Upload
} from 'lucide-react';
import { SatQueryLogo } from './SatQueryLogo';
import { AnalysisContext } from '../lib/types';

interface NavigationProps {
  currentView: 'home' | 'studio' | 'upload';
  setCurrentView: (view: 'home' | 'studio' | 'upload') => void;
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
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
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
  theme = 'light',
  onToggleTheme,
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
    { id: 'upload-studio', label: 'Upload Studio', action: () => { setCurrentView('upload'); } },
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
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0c0c0e]/95 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800 transition-colors select-none">
      {/* Top Telemetry & Sensor Ticker Ribbon */}
      <div className="px-4 lg:px-8 py-1.5 bg-slate-100/90 dark:bg-zinc-950/80 border-b border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-zinc-400 overflow-x-auto no-scrollbar gap-4">
        {/* Left Side: Sensor & Active Location Status */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-semibold tracking-wider">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase font-bold">COPERNICUS SENTINEL-2 L2A</span>
          </div>

          {activeContext && (
            <>
              <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">|</span>
              <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-100 font-semibold">
                <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-600 dark:text-blue-400 font-bold">{activeContext.location.name}</span>
                {activeContext.location.admin_region && !activeContext.location.name.includes(activeContext.location.admin_region) && (
                  <span className="text-slate-500 dark:text-zinc-400 hidden sm:inline">({activeContext.location.admin_region}, {activeContext.location.country})</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Purposeful Status Badges */}
        <div className="flex items-center space-x-2.5 shrink-0 text-[10.5px]">
          {activeContext ? (
            <>
              {/* Blue: Area Hectares */}
              <div className="hidden sm:flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300">
                <span className="text-blue-600/70 dark:text-blue-400/70 uppercase font-semibold">AOI:</span>
                <strong>~{activeContext.total_aoi_hectares.toLocaleString()} ha</strong>
              </div>

              {/* Slate/Neutral: Dates */}
              <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 text-slate-700 dark:text-zinc-300">
                <span className="text-slate-500 uppercase">Window:</span>
                <strong>{activeContext.actual_before_date}</strong>
                <span>→</span>
                <strong className="text-blue-600 dark:text-blue-400">{activeContext.actual_after_date}</strong>
              </div>

              {/* Green: Confidence */}
              <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">{activeContext.confidence.overall_score}% Conf ({activeContext.confidence.rating})</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-mono text-[10.5px]">
              <Radio className="w-3 h-3 text-amber-500 animate-pulse" />
              <span className="font-medium">AWAITING LOCATION QUERY</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        {/* Left: SatQueryAI Logo */}
        <div 
          onClick={() => { setCurrentView('home'); onScrollToSection?.('hero'); }}
          className="cursor-pointer shrink-0"
        >
          <SatQueryLogo size="md" />
        </div>

        {/* Center: In Studio Mode show full search bar, in Home mode show Nav Links */}
        {currentView === 'studio' ? (
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm sm:max-w-md lg:max-w-xl mx-1 sm:mx-2 min-w-0">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ask about changes anywhere on Earth (e.g. 'What changed in Visakhapatnam?')"
                className="w-full pl-9 pr-24 py-2 bg-slate-50 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans shadow-inner"
                disabled={isAnalyzing}
              />
              <button
                type="submit"
                disabled={isAnalyzing || !searchInput.trim()}
                className="absolute right-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 font-mono shadow-xs"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-3 h-3 animate-spin" />
                    <span>SCANNING</span>
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
          <div className="hidden xl:flex items-center space-x-1 min-w-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/80 whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Right: Theme Toggle, View Switcher, Mode, Provenance, Report */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto pr-0.5">
          {/* THEME TOGGLE (Light / Dark Mode) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-xs bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 shrink-0"
              title={theme === 'dark' ? 'Switch to Clean White Theme (Light)' : 'Switch to Deep Black Theme (Dark)'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline font-mono text-[11px]">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline font-mono text-[11px]">DARK</span>
                </>
              )}
            </button>
          )}

          {/* Primary View Switcher Button (Home vs Studio) */}
          {currentView === 'home' ? (
            <button
              type="button"
              onClick={() => setCurrentView('studio')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold font-mono tracking-wide transition-all shadow-xs flex items-center space-x-1.5 shrink-0"
              title="Launch full-screen satellite analysis studio"
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>STUDIO</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          ) : currentView === 'studio' ? (
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 shadow-xs shrink-0"
              title="Return to the planetary overview landing page"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>OVERVIEW</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 shadow-xs shrink-0"
              title="Return to planetary overview"
            >
              <Globe2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>OVERVIEW</span>
            </button>
          )}

          {/* Dedicated Upload Studio Mode Button */}
          <button
            type="button"
            onClick={() => setCurrentView(currentView === 'upload' ? 'home' : 'upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono tracking-wide transition-all shadow-xs flex items-center space-x-1.5 shrink-0 ${
              currentView === 'upload'
                ? 'bg-purple-600 hover:bg-purple-700 text-white ring-2 ring-purple-500/40 shadow-sm'
                : 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
            }`}
            title="Upload custom satellite images for AI analysis, comparison & timeline"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span>UPLOAD</span>
          </button>

          {/* Simple vs Expert Mode Pill Switch (Studio view only) */}
          {currentView === 'studio' && (
            <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setExpertMode(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  !expertMode 
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-semibold shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                Simple
              </button>
              <button
                type="button"
                onClick={() => setExpertMode(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center space-x-1 ${
                  expertMode 
                    ? 'bg-white dark:bg-zinc-800 text-orange-600 dark:text-orange-400 font-semibold shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Expert</span>
              </button>
            </div>
          )}

          {/* SIH Walkthrough Button */}
          {onRunDemo && (
            <button
              type="button"
              onClick={onRunDemo}
              disabled={isAnalyzing}
              className="hidden 2xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-semibold transition-all shadow-xs shrink-0"
              title="Automated Smart India Hackathon walkthrough for Visakhapatnam"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping shrink-0" />
              <span>SIH DEMO</span>
            </button>
          )}

          {/* Evidence Provenance Trigger */}
          <button
            type="button"
            onClick={onOpenProvenance}
            disabled={!activeContext}
            className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0"
            title="Inspect Data Provenance & Copernicus Scenes"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Provenance</span>
          </button>

          {/* Raw Satellite Comparison Option */}
          {onOpenRawSatellite && (
            <button
              type="button"
              onClick={onOpenRawSatellite}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold font-mono tracking-wide transition-all shadow-xs shrink-0"
              title="Compare raw optical satellite images side-by-side"
            >
              <Satellite className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="hidden xl:inline">RAW SATELLITES</span>
              <span className="xl:hidden">RAW</span>
            </button>
          )}

          {/* PDF Report Trigger (Always fully visible, never compressed or cut off) */}
          <button
            type="button"
            onClick={onOpenReport}
            disabled={!activeContext}
            className="shrink-0 flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Download Executive Analysis Report"
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="font-sans font-semibold">Report</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quick Prompts Strip in Studio Mode */}
      {currentView === 'studio' && (
        <div className="px-4 lg:px-8 py-1.5 bg-slate-50 dark:bg-zinc-950/90 border-t border-slate-200 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 dark:text-zinc-500 font-mono uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Quick Intel:</span>
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSearch(p)}
              disabled={isAnalyzing}
              className="shrink-0 px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs transition-colors font-sans shadow-xs"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 space-y-3 font-sans animate-in slide-in-from-top-2 duration-150 shadow-lg">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium"
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
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40"
            >
              {currentView === 'home' ? 'Switch to Studio Workspace' : 'Switch to Planetary Overview'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('upload');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Mode (Analyze Custom Images)</span>
            </button>
            {onOpenRawSatellite && (
              <button
                type="button"
                onClick={() => {
                  onOpenRawSatellite();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 flex items-center space-x-2"
              >
                <Satellite className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Raw Satellite Timeline (Side-by-Side)</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap gap-2">
            {onRunDemo && (
              <button
                type="button"
                onClick={() => {
                  onRunDemo();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center justify-center space-x-2"
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
              className="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center justify-center space-x-1.5 disabled:opacity-40"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Provenance</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenReport();
                setMobileMenuOpen(false);
              }}
              disabled={!activeContext}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 disabled:opacity-40 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Executive Report</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
