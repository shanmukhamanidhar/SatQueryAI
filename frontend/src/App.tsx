import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Globe2, 
  ChevronRight, 
  ChevronLeft,
  Bot, 
  BarChart3, 
  Compass, 
  Radio, 
  Sparkles, 
  Sliders, 
  Layers, 
  ArrowRight, 
  Clock,
  Maximize2,
  Satellite
} from 'lucide-react';
import { AnalysisContext, ChangeRegion } from './lib/types';
import { runAnalysis, getYearSatelliteImage } from './lib/api';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { FeaturePanels } from './components/FeaturePanels';
import { EnvironmentalExploration } from './components/EnvironmentalExploration';
import { DisasterMonitoring } from './components/DisasterMonitoring';
import { CitySelector } from './components/CitySelector';
import { PurposeSection } from './components/PurposeSection';
import { Footer } from './components/Footer';
import { MapViewer } from './components/MapViewer';
import { ChatAnalyst } from './components/ChatAnalyst';
import { SummaryCard } from './components/SummaryCard';
import { ExpertPanel } from './components/ExpertPanel';
import { TimeMachine } from './components/TimeMachine';
import { ChangeInspector } from './components/ChangeInspector';
import { ExplainMapModal } from './components/ExplainMapModal';
import { ProvenanceModal } from './components/ProvenanceModal';
import { ReportModal } from './components/ReportModal';
import { RawSatelliteModal } from './components/RawSatelliteModal';

export const App: React.FC = () => {
  // Navigation View State: 'home' for cinematic landing experience, 'studio' for full-screen analysis control room
  const [currentView, setCurrentView] = useState<'home' | 'studio'>('home');

  // Analysis State
  const [context, setContext] = useState<AnalysisContext | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);

  // Modes & Modals
  const [expertMode, setExpertMode] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = useState<ChangeRegion | null>(null);
  const [showExplainMap, setShowExplainMap] = useState<boolean>(false);
  const [showProvenance, setShowProvenance] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  // Map Filter, Highlights & Zoom Target from Chat
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [highlightedRegionIds, setHighlightedRegionIds] = useState<string[] | null>(null);
  const [zoomTarget, setZoomTarget] = useState<[number, number, number] | null>(null);

  // From and To Yearly Satellite Image Selector State (e.g. 2020 to 2026)
  const [fromYear, setFromYear] = useState<number | null>(null);
  const [toYear, setToYear] = useState<number | null>(null);
  const [fromImageData, setFromImageData] = useState<{
    year: number;
    date: string;
    imageUrl: string;
  } | null>(null);
  const [toImageData, setToImageData] = useState<{
    year: number;
    date: string;
    imageUrl: string;
  } | null>(null);
  const [isLoadingFromYear, setIsLoadingFromYear] = useState<boolean>(false);
  const [isLoadingToYear, setIsLoadingToYear] = useState<boolean>(false);

  const handleSelectFromYear = async (year: number | null) => {
    if (year === null || !context) {
      setFromYear(null);
      setFromImageData(null);
      return;
    }

    setFromYear(year);
    setIsLoadingFromYear(true);
    try {
      const data = await getYearSatelliteImage({
        analysis_id: context.analysis_id,
        bbox: context.location.bounding_box,
        year,
      });
      setFromImageData({
        year: data.year,
        date: data.date,
        imageUrl: data.image_url,
      });
    } catch (err) {
      console.error('Failed to load From satellite image for year:', err);
    } finally {
      setIsLoadingFromYear(false);
    }
  };

  const handleSelectToYear = async (year: number | null) => {
    if (year === null || !context) {
      setToYear(null);
      setToImageData(null);
      return;
    }

    setToYear(year);
    setIsLoadingToYear(true);
    try {
      const data = await getYearSatelliteImage({
        analysis_id: context.analysis_id,
        bbox: context.location.bounding_box,
        year,
      });
      setToImageData({
        year: data.year,
        date: data.date,
        imageUrl: data.image_url,
      });
    } catch (err) {
      console.error('Failed to load To satellite image for year:', err);
    } finally {
      setIsLoadingToYear(false);
    }
  };

  const handleResetYears = () => {
    setFromYear(null);
    setToYear(null);
    setFromImageData(null);
    setToImageData(null);
  };

  // Collapsible Sidebars & Maximize Map Viewport State
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(false);
  const [isMapMaximized, setIsMapMaximized] = useState<boolean>(false);
  const [timeDrawerOpen, setTimeDrawerOpen] = useState<boolean>(false);
  const [showRawSatelliteModal, setShowRawSatelliteModal] = useState<boolean>(false);

  // Trigger map resize on layout changes
  useEffect(() => {
    const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [currentView, isMapMaximized, leftSidebarOpen, rightSidebarOpen]);

  const handleToggleMaximizeMap = () => {
    const next = !isMapMaximized;
    setIsMapMaximized(next);
    if (next) {
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
    } else {
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
    }
  };

  // Mobile layout tab switcher
  const [mobileTab, setMobileTab] = useState<'map' | 'chat' | 'summary'>('map');

  // Multi-step progress pipeline
  const stages = [
    "Resolving location and geospatial bounding box...",
    "Querying Copernicus Sentinel-2 open STAC catalogue...",
    "Filtering atmospheric clouds & selecting optimal observation passes...",
    "Streaming multi-spectral bands (Red, Green, Blue, NIR, SWIR)...",
    "Computing scientific indices (NDVI, NDWI, NDBI)...",
    "Running morphological change detection & vector cluster extraction...",
    "Calculating hectares transition matrix & rate of change...",
    "Synthesizing Gemini AI geospatial intelligence & evidence summary...",
    "Analysis complete!"
  ];

  // Initial load: run default analysis for Visakhapatnam to showcase immediate live capability
  useEffect(() => {
    handleSearch("Analyze Visakhapatnam between 2021 and 2026");
  }, []);

  const handleSearch = async (query: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setCurrentStage(0);
    setSelectedRegion(null);
    setActiveFilter(null);
    setHighlightedRegionIds(null);
    setZoomTarget(null);
    setFromYear(null);
    setToYear(null);
    setFromImageData(null);
    setToImageData(null);

    // Simulate progressive telemetry stages while backend processes
    const timer1 = setTimeout(() => setCurrentStage(1), 700);
    const timer2 = setTimeout(() => setCurrentStage(2), 1600);
    const timer3 = setTimeout(() => setCurrentStage(3), 2600);
    const timer4 = setTimeout(() => setCurrentStage(4), 3800);
    const timer5 = setTimeout(() => setCurrentStage(5), 4800);
    const timer6 = setTimeout(() => setCurrentStage(6), 5600);
    const timer7 = setTimeout(() => setCurrentStage(7), 6400);

    try {
      const res = await runAnalysis({ query });
      setCurrentStage(8);
      setTimeout(() => {
        setContext(res);
        setIsAnalyzing(false);
      }, 500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis could not be completed.');
      setIsAnalyzing(false);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    }
  };

  // Smart India Hackathon Automated Walkthrough
  const handleDemoWalkthrough = async () => {
    await handleSearch("Analyze Visakhapatnam between 2021 and 2026");
    setTimeout(() => {
      if (context && context.change_regions.length > 0) {
        const topUrban = context.change_regions.find(r => r.category.includes('Urban')) || context.change_regions[0];
        setSelectedRegion(topUrban);
        setHighlightedRegionIds([topUrban.id]);
        setZoomTarget([topUrban.centroid[0], topUrban.centroid[1], 14.2]);
      }
    }, 1500);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHotspot = (region: ChangeRegion) => {
    setSelectedRegion(region);
    setHighlightedRegionIds([region.id]);
    setZoomTarget([region.centroid[0], region.centroid[1], 14.2]);
    if (currentView === 'home') {
      handleScrollToSection('live-earth-section');
    }
  };

  const handleSelectCategory = (categoryQuery: string, filterName?: string) => {
    if (filterName) {
      setActiveFilter(filterName);
    }
    handleSearch(categoryQuery);
    if (currentView === 'home') {
      handleScrollToSection('live-earth-section');
    }
  };

  // Reusable Studio Workspace component used both full-screen and embedded in the Home View
  const renderStudioWorkspace = (isFullscreen: boolean) => (
    <div className={`flex flex-col lg:flex-row overflow-hidden relative ${isFullscreen ? 'h-full w-full' : 'h-[750px] w-full rounded-2xl border border-[#0C1C2A] bg-[#06101A] shadow-2xl'}`}>
      {/* Left Column: AI Analyst Chat (Collapsible to give map maximum space) */}
      {leftSidebarOpen ? (
        <div className={`w-full lg:w-72 xl:w-80 h-full shrink-0 relative transition-all duration-200 ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
          <ChatAnalyst
            context={context}
            onFilterCategory={setActiveFilter}
            onHighlightRegions={setHighlightedRegionIds}
            onSelectRegion={setSelectedRegion}
            onZoomTo={setZoomTarget}
          />
          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(false)}
            className="absolute top-3 -right-3 z-30 h-6 w-6 rounded-full bg-[#0b121e] border border-slate-700 text-slate-400 hover:text-[#42E8D0] hover:border-[#42E8D0] flex items-center justify-center shadow-xl transition-all"
            title="Collapse AI Chat (Expand map)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center py-3 px-1 bg-[#06101A]/95 border-r border-[#0C1C2A] shrink-0 z-20">
          <button
            type="button"
            onClick={() => setLeftSidebarOpen(true)}
            className="px-2 py-3 rounded-xl bg-[#0C1C2A]/90 hover:bg-[#42E8D0]/15 text-slate-400 hover:text-[#42E8D0] border border-[#102536] hover:border-[#42E8D0]/40 transition-all flex flex-col items-center space-y-2 group shadow-md"
            title="Open AI Analyst Chat"
          >
            <Bot className="w-4 h-4 text-[#42E8D0] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-wider [writing-mode:vertical-lr] font-bold">
              AI CHAT
            </span>
          </button>
        </div>
      )}

      {/* Center Column: Interactive Global Map + TimeMachine */}
      <div className={`flex-1 flex flex-col h-full relative ${mobileTab === 'map' ? 'flex' : 'hidden lg:flex'}`}>
        {/* Map Viewer */}
        <div className="flex-1 relative w-full h-full">
          <MapViewer
            context={context}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onExplainMap={() => setShowExplainMap(true)}
            filteredCategory={activeFilter}
            highlightedRegionIds={highlightedRegionIds}
            zoomTarget={zoomTarget}
            onFilterCategory={setActiveFilter}
            fromYear={fromYear}
            toYear={toYear}
            fromImageData={fromImageData}
            toImageData={toImageData}
            isLoadingFromYear={isLoadingFromYear}
            isLoadingToYear={isLoadingToYear}
            onResetYears={handleResetYears}
            isMapMaximized={isMapMaximized}
            onToggleMaximizeMap={handleToggleMaximizeMap}
            timeDrawerOpen={timeDrawerOpen}
            onToggleTimeDrawer={() => setTimeDrawerOpen(!timeDrawerOpen)}
            onOpenRawSatelliteModal={() => setShowRawSatelliteModal(true)}
          />

          {/* Change Region Inspector Modal */}
          {selectedRegion && (
            <ChangeInspector
              region={selectedRegion}
              context={context}
              onClose={() => setSelectedRegion(null)}
            />
          )}

          {/* Expert Mode Panel Drawer */}
          {expertMode && context && (
            <ExpertPanel
              context={context}
              onClose={() => setExpertMode(false)}
            />
          )}
        </div>

        {/* Bottom Time Machine Drawer with Dual From / To Yearly Satellite Selector */}
        {context && timeDrawerOpen && (
          <div className="shrink-0 animate-in slide-in-from-bottom-4 duration-200">
            <TimeMachine
              timeline={context.timeline}
              fromYear={fromYear}
              toYear={toYear}
              fromImageData={fromImageData}
              toImageData={toImageData}
              isLoadingFromYear={isLoadingFromYear}
              isLoadingToYear={isLoadingToYear}
              onSelectFromYear={handleSelectFromYear}
              onSelectToYear={handleSelectToYear}
              onResetYears={handleResetYears}
              onClose={() => setTimeDrawerOpen(false)}
              defaultBeforeYear={context.actual_before_date ? parseInt(context.actual_before_date.slice(0, 4)) : 2021}
              defaultAfterYear={context.actual_after_date ? parseInt(context.actual_after_date.slice(0, 4)) : 2026}
            />
          </div>
        )}
      </div>

      {/* Right Column: Simple Summary / Inspector (Collapsible) */}
      {rightSidebarOpen ? (
        <div className={`w-full lg:w-72 xl:w-80 h-full shrink-0 relative transition-all duration-200 ${mobileTab === 'summary' ? 'flex' : 'hidden lg:flex'}`}>
          <button
            type="button"
            onClick={() => setRightSidebarOpen(false)}
            className="absolute top-3 -left-3 z-30 h-6 w-6 rounded-full bg-[#0b121e] border border-slate-700 text-slate-400 hover:text-[#42E8D0] hover:border-[#42E8D0] flex items-center justify-center shadow-xl transition-all"
            title="Collapse Summary (Expand map)"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          {context ? (
            <SummaryCard
              context={context}
              onFilterCategory={setActiveFilter}
              activeFilter={activeFilter}
              onSelectRegion={setSelectedRegion}
              onOpenProvenance={() => setShowProvenance(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 font-mono text-xs space-y-2">
              <Radio className="w-8 h-8 text-slate-600 animate-pulse" />
              <p>Awaiting Earth observation search command...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden lg:flex flex-col items-center py-3 px-1 bg-[#06101A]/95 border-l border-[#0C1C2A] shrink-0 z-20">
          <button
            type="button"
            onClick={() => setRightSidebarOpen(true)}
            className="px-2 py-3 rounded-xl bg-[#0C1C2A]/90 hover:bg-[#42E8D0]/15 text-slate-400 hover:text-[#42E8D0] border border-[#102536] hover:border-[#42E8D0]/40 transition-all flex flex-col items-center space-y-2 group shadow-md"
            title="Open Metrics Summary"
          >
            <BarChart3 className="w-4 h-4 text-[#42E8D0] group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono uppercase tracking-wider [writing-mode:vertical-lr] font-bold">
              SUMMARY
            </span>
          </button>
        </div>
      )}

      {/* Mobile Navigation Tabs (visible only on mobile screens) */}
      <div className="lg:hidden flex border-t border-[#0C1C2A] bg-[#03070D] text-xs font-mono z-30">
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-3 text-center ${mobileTab === 'chat' ? 'text-[#42E8D0] border-t-2 border-[#42E8D0] font-bold bg-[#06101A]' : 'text-slate-400'}`}
        >
          AI Analyst
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-3 text-center ${mobileTab === 'map' ? 'text-[#42E8D0] border-t-2 border-[#42E8D0] font-bold bg-[#06101A]' : 'text-slate-400'}`}
        >
          Map View
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('summary')}
          className={`flex-1 py-3 text-center ${mobileTab === 'summary' ? 'text-[#42E8D0] border-t-2 border-[#42E8D0] font-bold bg-[#06101A]' : 'text-slate-400'}`}
        >
          Summary
        </button>
      </div>
    </div>
  );

  return (
    <div className={`${currentView === 'studio' ? 'h-screen overflow-hidden' : 'min-h-screen'} w-screen bg-[#03070D] text-slate-100 font-sans control-room-bg flex flex-col`}>
      {/* Unified Top Navigation */}
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSearch={handleSearch}
        isAnalyzing={isAnalyzing}
        activeContext={context}
        expertMode={expertMode}
        setExpertMode={setExpertMode}
        onOpenReport={() => setShowReport(true)}
        onOpenProvenance={() => setShowProvenance(true)}
        onOpenRawSatellite={() => setShowRawSatelliteModal(true)}
        onRunDemo={handleDemoWalkthrough}
        onScrollToSection={handleScrollToSection}
      />

      {/* VIEW MODE 1: CINEMATIC HOME / LANDING PAGE */}
      {currentView === 'home' && (
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <HeroSection
            onSearch={handleSearch}
            isAnalyzing={isAnalyzing}
            activeContext={context}
            onRunDemo={handleDemoWalkthrough}
            onExploreClick={() => handleScrollToSection('live-earth-section')}
          />

          {/* Feature Capabilities Panels */}
          <FeaturePanels
            onSelectFeature={(featId) => {
              if (featId === 'ai') {
                setLeftSidebarOpen(true);
              }
              handleScrollToSection('live-earth-section');
            }}
          />

          {/* Interactive Live Earth Section */}
          <section id="live-earth-section" className="py-16 bg-[#03070D] border-b border-[#0C1C2A] relative">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#42E8D0] uppercase tracking-widest font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>INTERACTIVE OBSERVATION WORKSPACE</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Live Planetary Satellite Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Direct multispectral examination of {context ? context.location.name : 'planetary locations'} with swipe comparison, vector polygons, and Gemini AI synthesis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowRawSatelliteModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orbit-cyan/20 to-emerald-500/20 hover:from-orbit-cyan/35 hover:to-emerald-500/35 border border-orbit-cyan/50 text-orbit-cyan hover:text-white text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center space-x-2"
                    title="Open Raw Satellite Timeline Studio: Side-by-side pure optical satellite imagery with timeline choice"
                  >
                    <Satellite className="w-3.5 h-3.5 text-orbit-cyan animate-pulse" />
                    <span>RAW SATELLITE (SIDE-BY-SIDE)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('studio')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#42E8D0] to-[#4EA7FF] hover:from-[#3BE0C8] hover:to-[#3B96F5] text-[#03070D] text-xs font-mono font-bold transition-all shadow-md flex items-center space-x-2"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>EXPAND FULLSCREEN STUDIO</span>
                  </button>
                </div>
              </div>

              {/* Multi-City / Location Selection Options */}
              <CitySelector
                activeLocationName={context?.location.name}
                onSelectCity={handleSearch}
                isAnalyzing={isAnalyzing}
                onOpenRawSatellite={() => setShowRawSatelliteModal(true)}
              />

              {/* Embedded Live Earth Workspace */}
              {renderStudioWorkspace(false)}
            </div>
          </section>

          {/* Environmental Exploration */}
          <EnvironmentalExploration onSelectCategory={handleSelectCategory} />

          {/* Disaster & Stress Hotspot Monitoring */}
          <DisasterMonitoring
            context={context}
            onSelectRegion={handleSelectHotspot}
            onExploreHotspots={() => handleScrollToSection('live-earth-section')}
            onSelectCity={handleSearch}
          />

          {/* Purpose & Impact Section */}
          <PurposeSection />

          {/* Footer */}
          <Footer />
        </main>
      )}

      {/* VIEW MODE 2: FULL-SCREEN MISSION STUDIO WORKSPACE */}
      {currentView === 'studio' && (
        <main className="flex-1 w-full min-h-0 overflow-hidden relative flex flex-col">
          {renderStudioWorkspace(true)}
        </main>
      )}

      {/* Progress Telemetry Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03070D]/85 backdrop-blur-lg">
          <div className="w-full max-w-md panel-glass rounded-2xl border border-[#42E8D0]/40 shadow-2xl p-6 font-mono">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-[#42E8D0]/20 border border-[#42E8D0]/50 flex items-center justify-center shadow-[0_0_20px_rgba(66,232,208,0.3)]">
                <Activity className="w-5 h-5 text-[#42E8D0] animate-spin" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  AUTONOMOUS EARTH PIPELINE ACTIVE
                </h3>
                <span className="text-[11px] text-[#42E8D0]">
                  {stages[currentStage]}
                </span>
              </div>
            </div>

            {/* Stepper Checklist */}
            <div className="space-y-2 text-xs py-2 border-y border-slate-800 my-4">
              {stages.slice(0, 8).map((stepText, idx) => {
                const isDone = currentStage > idx;
                const isCurrent = currentStage === idx;
                return (
                  <div key={idx} className="flex items-center space-x-2.5">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#35D6A1] shrink-0" />
                    ) : isCurrent ? (
                      <Activity className="w-4 h-4 text-[#42E8D0] animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span className={`text-[11px] ${isDone ? 'text-slate-400' : isCurrent ? 'text-[#42E8D0] font-semibold' : 'text-slate-600'}`}>
                      {stepText.replace("...", "")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[10px] text-slate-500 text-center font-sans">
              Accessing Sentinel-2 open cloud rasters. No manual upload or GIS expertise required.
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#03070D]/80 backdrop-blur-md">
          <div className="w-full max-w-md panel-glass rounded-2xl border border-rose-500/40 p-5 font-sans">
            <div className="flex items-center space-x-3 text-rose-400 mb-3 font-mono">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm uppercase">OBSERVATION NOTICE</h3>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              {errorMessage}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="px-4 py-2 bg-[#0C1C2A] hover:bg-[#102536] text-slate-200 text-xs rounded-lg font-mono"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showExplainMap && (
        <ExplainMapModal
          context={context}
          onClose={() => setShowExplainMap(false)}
        />
      )}

      {showProvenance && (
        <ProvenanceModal
          context={context}
          onClose={() => setShowProvenance(false)}
        />
      )}

      {showReport && (
        <ReportModal
          context={context}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Raw Satellite Imagery Studio Modal (Pure Optical Comparison) */}
      <RawSatelliteModal
        isOpen={showRawSatelliteModal}
        onClose={() => setShowRawSatelliteModal(false)}
        context={context}
        onSelectCityForAnalysis={handleSearch}
      />
    </div>
  );
};
