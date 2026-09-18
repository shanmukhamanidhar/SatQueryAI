import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Compass,
  Search,
  Maximize2,
  Sparkles,
  Sliders
} from 'lucide-react';
import { ChangeRegion, AnalysisContext } from '../lib/types';

interface ChangeInspectorProps {
  region: ChangeRegion | null;
  context: AnalysisContext | null;
  onClose: () => void;
}

export const ChangeInspector: React.FC<ChangeInspectorProps> = ({
  region,
  context,
  onClose,
}) => {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!region || !context) return null;

  const beforeYear = context.actual_before_date.split('-')[0];
  const afterYear = context.actual_after_date.split('-')[0];
  const midYearStart = Math.min(Number(beforeYear) + 1, Number(afterYear));
  const dateEstimate = `${midYearStart}–${afterYear}`;

  // Emoji and simple label
  const isUrban = region.category.includes('Urban') || region.delta_ndbi > 0.08;
  const isVegLoss = region.category.includes('loss') || region.delta_ndvi < -0.12;
  const isVegGain = region.category.includes('gain') || region.delta_ndvi > 0.12;
  const isWater = region.category.includes('Water');

  const statusEmoji = isUrban ? '🟠' : isVegLoss ? '🔴' : isVegGain ? '🟢' : '💧';
  const statusLabel = isUrban
    ? 'New development detected'
    : isVegLoss
    ? 'Vegetation loss detected'
    : isVegGain
    ? 'Vegetation regrowth detected'
    : isWater
    ? 'Water surface change detected'
    : region.user_label;

  const accentColorClass = isUrban
    ? 'border-t-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)]'
    : isVegLoss
    ? 'border-t-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.15)]'
    : isVegGain
    ? 'border-t-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
    : 'border-t-sky-500 shadow-[0_0_30px_rgba(14,165,233,0.15)]';

  return (
    <div className={`absolute top-16 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] figma-card rounded-2xl border-t-4 ${accentColorClass} p-4 font-sans backdrop-blur-2xl animate-in fade-in slide-in-from-right-4 duration-200 shadow-2xl`}>
      {/* Header: What happened here? */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-lg bg-orbit-cyan/15 border border-orbit-cyan/30 flex items-center justify-center text-orbit-cyan">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">What happened here?</h3>
            <span className="text-[10px] font-telemetry text-orbit-cyan font-bold">
              HOTSPOT #{region.indicator_number || region.id} // {context.location.name}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Human-Friendly Primary Information Cards */}
      <div className="space-y-2.5 mb-3">
        {/* Status */}
        <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800 flex items-center space-x-2.5">
          <span className="text-xl shrink-0">{statusEmoji}</span>
          <div>
            <div className="text-xs font-bold text-slate-100">{statusLabel}</div>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              {region.simple_explanation}
            </p>
          </div>
        </div>

        {/* Date Window */}
        <div className="p-2.5 rounded-xl bg-space-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center space-x-2">
            <span className="text-base">📅</span>
            <span>Timing:</span>
          </span>
          <span className="font-semibold text-slate-100 font-telemetry">
            Mostly between {dateEstimate}
          </span>
        </div>

        {/* Area */}
        <div className="p-2.5 rounded-xl bg-space-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center space-x-2">
            <span className="text-base">📏</span>
            <span>Measured Area:</span>
          </span>
          <span className="font-bold text-orbit-cyan font-telemetry text-sm">
            ~{region.area_hectares} ha
          </span>
        </div>

        {/* Evidence Source */}
        <div className="p-2.5 rounded-xl bg-space-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center space-x-2">
            <span className="text-base">🔍</span>
            <span>Evidence:</span>
          </span>
          <span className="font-semibold text-emerald-400 font-telemetry">
            Sentinel-2 multispectral imagery
          </span>
        </div>
      </div>

      {/* Technical Evidence Drawer (Expert Mode) */}
      <div className="border-t border-slate-700/60 pt-2.5">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full flex items-center justify-between text-xs font-telemetry text-orbit-cyan hover:underline py-1"
        >
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>{showTechnical ? 'Hide Expert Mode Details' : 'Technical Details (Expert Mode)'}</span>
          </span>
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTechnical && (
          <div className="mt-2.5 p-3 rounded-xl bg-space-950/90 border border-slate-800 font-telemetry text-[11px] text-slate-300 space-y-2.5">
            <p className="leading-relaxed text-slate-300 font-sans">{region.technical_evidence}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10.5px]">
              <div className="p-1.5 rounded bg-space-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Δ NDVI</span>
                <span className={`font-bold ${region.delta_ndvi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {region.delta_ndvi >= 0 ? `+${region.delta_ndvi}` : region.delta_ndvi}
                </span>
              </div>
              <div className="p-1.5 rounded bg-space-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Δ NDBI</span>
                <span className={`font-bold ${region.delta_ndbi >= 0 ? 'text-orange-400' : 'text-slate-400'}`}>
                  {region.delta_ndbi >= 0 ? `+${region.delta_ndbi}` : region.delta_ndbi}
                </span>
              </div>
              <div className="p-1.5 rounded bg-space-900 border border-slate-800">
                <span className="text-slate-500 block text-[9px]">Δ NDWI</span>
                <span className="font-bold text-sky-400">
                  {region.delta_ndwi >= 0 ? `+${region.delta_ndwi}` : region.delta_ndwi}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Centroid: {region.centroid[1].toFixed(4)}°, {region.centroid[0].toFixed(4)}°</span>
              <span className="text-emerald-400 font-semibold">{region.confidence_pct}% detection confidence</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
