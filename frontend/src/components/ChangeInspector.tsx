import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { ChangeRegion, AnalysisContext } from '../lib/types';
import { getCategoryVisual } from '../lib/categoryThumbnails';
import { getCategoryConfig, getCategoryColor } from '../lib/colorSystem';

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

  const categoryVisual = getCategoryVisual(region.category);
  const categoryConfig = getCategoryConfig(region.category);
  const canonicalColor = categoryConfig.color;

  // Strict synchronized status labels based on canonical category key
  const statusLabel = categoryConfig.key === 'urban'
    ? 'New construction & urban development detected'
    : categoryConfig.key === 'deforestation'
    ? 'Vegetation loss / Deforestation detected'
    : categoryConfig.key === 'vegetation'
    ? 'Vegetation growth & canopy recovery detected'
    : categoryConfig.key === 'water'
    ? 'Water surface & hydrology dynamics detected'
    : categoryConfig.key === 'bare'
    ? 'Bare ground & soil exposure detected'
    : region.user_label;

  return (
    <div 
      className="absolute top-16 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 border-t-4 p-4 font-sans backdrop-blur-2xl animate-in fade-in slide-in-from-right-4 duration-200 shadow-2xl text-slate-900 dark:text-slate-100"
      style={{ 
        borderTopColor: canonicalColor,
        boxShadow: `0 20px 45px -10px ${canonicalColor}25, 0 4px 20px rgba(0,0,0,0.15)`
      }}
    >
      {/* Header: What happened here? */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-2.5 mb-3">
        <div className="flex items-center space-x-2.5">
          <div 
            className="h-7 w-7 rounded-lg flex items-center justify-center"
            style={{ 
              backgroundColor: `${canonicalColor}15`, 
              color: canonicalColor,
              border: `1px solid ${canonicalColor}40`
            }}
          >
            <Search className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">What happened here?</h3>
            <span 
              className="text-[10.5px] font-telemetry font-bold flex items-center gap-1.5 mt-0.5"
              style={{ color: canonicalColor }}
            >
              <span className="inline-block w-2 h-2 rounded-full shadow-xs" style={{ backgroundColor: canonicalColor }} />
              HOTSPOT ZONE · {categoryConfig.shortLabel.toUpperCase()}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Human-Friendly Primary Information Cards */}
      <div className="space-y-2.5 mb-3">
        {/* Realistic Satellite Thumbnail Status Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/70 border border-slate-200 dark:border-zinc-700 flex items-center space-x-3">
          <div className="relative shrink-0">
            <img 
              src={categoryVisual.thumbnail} 
              alt={categoryVisual.name}
              className="w-14 h-14 rounded-xl object-cover border-2 shadow-md"
              style={{ borderColor: canonicalColor }}
            />
            <span 
              className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm"
              style={{ backgroundColor: canonicalColor }}
              title={categoryConfig.name}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className={`text-[9.5px] font-telemetry uppercase font-bold px-1.5 py-0.5 rounded border ${categoryConfig.badgeClass}`}>
                {categoryConfig.shortLabel}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">{statusLabel}</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
              {region.simple_explanation}
            </p>
          </div>
        </div>

        {/* Date Window */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-750/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span className="text-base">📅</span>
            <span>Timing:</span>
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-100 font-telemetry">
            Mostly between {dateEstimate}
          </span>
        </div>

        {/* Area */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-750/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span className="text-base">📏</span>
            <span>Measured Area:</span>
          </span>
          <span 
            className="font-bold font-telemetry text-sm"
            style={{ color: canonicalColor }}
          >
            ~{region.area_hectares} ha
          </span>
        </div>

        {/* Evidence Source */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-750/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span className="text-base">🔍</span>
            <span>Evidence:</span>
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-telemetry">
            Sentinel-2 multispectral imagery
          </span>
        </div>
      </div>

      {/* Technical Evidence Drawer (Expert Mode) */}
      <div className="border-t border-slate-200 dark:border-zinc-800 pt-2.5">
        <button
          type="button"
          onClick={() => setShowTechnical(!showTechnical)}
          className="w-full flex items-center justify-between text-xs font-telemetry text-blue-600 dark:text-blue-400 hover:underline py-1 font-bold"
        >
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>{showTechnical ? 'Hide Expert Mode Details' : 'Technical Details (Expert Mode)'}</span>
          </span>
          {showTechnical ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showTechnical && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 font-telemetry text-[11px] text-slate-700 dark:text-slate-300 space-y-2.5">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-sans">{region.technical_evidence}</p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-zinc-700 text-[10.5px]">
              <div className="p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-750">
                <span className="text-slate-500 block text-[9px]">Δ NDVI (Veg)</span>
                <span className={`font-bold ${region.delta_ndvi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {region.delta_ndvi >= 0 ? `+${region.delta_ndvi}` : region.delta_ndvi}
                </span>
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-750">
                <span className="text-slate-500 block text-[9px]">Δ NDBI (Urban)</span>
                <span className={`font-bold ${region.delta_ndbi >= 0 ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'}`}>
                  {region.delta_ndbi >= 0 ? `+${region.delta_ndbi}` : region.delta_ndbi}
                </span>
              </div>
              <div className="p-1.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-750">
                <span className="text-slate-500 block text-[9px]">Δ NDWI (Water)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {region.delta_ndwi >= 0 ? `+${region.delta_ndwi}` : region.delta_ndwi}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-zinc-700/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span>Centroid: {region.centroid[1].toFixed(4)}°, {region.centroid[0].toFixed(4)}°</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{region.confidence_pct}% detection confidence</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
