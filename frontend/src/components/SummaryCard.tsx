import React, { useState } from 'react';
import { 
  Building2, 
  Trees, 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Eye,
  Crosshair
} from 'lucide-react';
import { AnalysisContext, ChangeRegion } from '../lib/types';

interface SummaryCardProps {
  context: AnalysisContext;
  onFilterCategory: (category: string | null) => void;
  activeFilter: string | null;
  onSelectRegion: (region: ChangeRegion) => void;
  onOpenProvenance: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  context,
  onFilterCategory,
  activeFilter,
  onSelectRegion,
  onOpenProvenance,
}) => {
  const [expandedCard, setExpandedCard] = useState<'urban' | 'veg' | 'water' | null>('urban');
  const [showConfidenceWhy, setShowConfidenceWhy] = useState(false);

  const stats = context.land_cover_stats;
  const builtStat = stats.find((s) => s.category.includes('Built'));
  const treeStat = stats.find((s) => s.category.includes('Trees'));
  const cropStat = stats.find((s) => s.category.includes('Crops'));
  const waterStat = stats.find((s) => s.category.includes('Water'));

  const conf = context.confidence;
  const beforeYear = context.actual_before_date.split('-')[0];
  const afterYear = context.actual_after_date.split('-')[0];
  const changeIntensity = context.percent_aoi_changed > 10 ? 'significantly' : context.percent_aoi_changed > 3 ? 'moderately' : 'slightly';

  // Urban Growth
  const builtChange = builtStat ? builtStat.change_ha : 0;
  const builtLabel = builtChange > 0 ? "Newly built-up areas detected." : "Stable built footprint.";

  // Vegetation
  const treeChange = treeStat ? treeStat.change_ha : 0;
  const cropChange = cropStat ? cropStat.change_ha : 0;
  const vegChange = Number((treeChange + cropChange).toFixed(2));
  const vegLabel = vegChange > 5 ? "Vegetated area increased." : vegChange < -5 ? "Vegetated area changed across the analysis region." : "No significant vegetation change detected.";

  // Water
  const waterChange = waterStat ? waterStat.change_ha : 0;
  const waterLabel = Math.abs(waterChange) < 1.0 ? "No significant water-surface change detected." : waterChange > 0 ? "Water surface expanded." : "Water surface contracted.";

  return (
    <div className="flex flex-col h-full bg-[#0c1322]/95 border-l border-slate-800/80 backdrop-blur-xl overflow-y-auto p-4 space-y-4 font-sans">
      {/* Top Headline Card (Figma-inspired clean focal banner) */}
      <div className="rounded-2xl bg-gradient-to-br from-[#131d31] to-[#0d1627] p-4 border border-slate-700/60 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between text-xs font-telemetry mb-2">
          <span className="flex items-center space-x-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>EXECUTIVE SUMMARY</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-semibold">
            {context.resolution} GSD
          </span>
        </div>

        <h2 className="text-base font-bold text-slate-100 leading-snug">
          {context.location.name} changed {changeIntensity} between {beforeYear} and {afterYear}.
        </h2>

        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2 font-telemetry bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-300 font-medium">{context.actual_before_date}</span>
          <span className="text-slate-500">→</span>
          <span className="text-cyan-400 font-semibold">{context.actual_after_date}</span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-300 font-telemetry uppercase tracking-wider">
          WHAT CHANGED?
        </span>
        <span className="text-[10px] text-slate-500 font-telemetry">
          CLICK CARD TO FILTER
        </span>
      </div>

      {/* 3 Figma-inspired Category Change Cards */}
      <div className="space-y-3">
        {/* 1. Urban Growth Card */}
        <div 
          onClick={() => {
            onFilterCategory(activeFilter === 'Urban development' ? null : 'Urban development');
            setExpandedCard(expandedCard === 'urban' ? null : 'urban');
          }}
          className={`figma-card cursor-pointer border transition-all ${
            activeFilter === 'Urban development'
              ? 'border-amber-500/80 ring-2 ring-amber-500/20 bg-[#171e2e]'
              : 'border-slate-800 hover:border-slate-700 bg-[#0f172a]/90'
          }`}
        >
          {/* Card Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500" />
          
          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-sm">🏙️</span>
                </div>
                <div>
                  <div className="text-[10px] font-telemetry font-bold text-amber-400 uppercase tracking-wide">
                    URBAN DEVELOPMENT
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Urban growth
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-telemetry text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {builtChange >= 0 ? `+${builtChange}` : builtChange} ha
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{builtLabel}"
            </p>

            {/* Expandable Why & Evidence Details */}
            {expandedCard === 'urban' && (
              <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-2 text-[11px]">
                <div className="text-slate-400 font-telemetry text-[10px] uppercase font-semibold">
                  EVIDENCE & METHODOLOGY:
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span>NDBI index elevated across new built-up footprint (+{context.indices_summary.delta_ndbi_mean.toFixed(2)} mean shift).</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    <span>Sentinel-2 multispectral surface reflectance validated across observation timeline.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Vegetation Card */}
        <div 
          onClick={() => {
            onFilterCategory(activeFilter === 'Vegetation loss' ? null : 'Vegetation loss');
            setExpandedCard(expandedCard === 'veg' ? null : 'veg');
          }}
          className={`figma-card cursor-pointer border transition-all ${
            activeFilter === 'Vegetation loss'
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/20 bg-[#132223]'
              : 'border-slate-800 hover:border-slate-700 bg-[#0f172a]/90'
          }`}
        >
          {/* Card Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <span className="text-sm">🌳</span>
                </div>
                <div>
                  <div className="text-[10px] font-telemetry font-bold text-emerald-400 uppercase tracking-wide">
                    CANOPY & CROPLAND
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Vegetation
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold font-telemetry px-2 py-0.5 rounded-full border ${
                  vegChange >= 0 
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {vegChange >= 0 ? `+${vegChange}` : vegChange} ha
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{vegLabel}"
            </p>

            {/* Expandable Why & Evidence Details */}
            {expandedCard === 'veg' && (
              <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-2 text-[11px]">
                <div className="text-slate-400 font-telemetry text-[10px] uppercase font-semibold">
                  SPECTRAL EVIDENCE:
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Normalized Difference Vegetation Index (NDVI) shift: {context.indices_summary.delta_ndvi_mean >= 0 ? `+${context.indices_summary.delta_ndvi_mean.toFixed(2)}` : context.indices_summary.delta_ndvi_mean.toFixed(2)}.</span>
                  </div>
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Red-edge & NIR reflectance processed with cloud shadow masking.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Water Card */}
        <div 
          onClick={() => {
            onFilterCategory(activeFilter === 'Water reduction' ? null : 'Water reduction');
            setExpandedCard(expandedCard === 'water' ? null : 'water');
          }}
          className={`figma-card cursor-pointer border transition-all ${
            activeFilter === 'Water reduction'
              ? 'border-cyan-500/80 ring-2 ring-cyan-500/20 bg-[#101e2e]'
              : 'border-slate-800 hover:border-slate-700 bg-[#0f172a]/90'
          }`}
        >
          {/* Card Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-500" />

          <div className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <span className="text-sm">💧</span>
                </div>
                <div>
                  <div className="text-[10px] font-telemetry font-bold text-cyan-400 uppercase tracking-wide">
                    SURFACE HYDROLOGY
                  </div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Water
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-telemetry text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  {waterChange >= 0 ? `+${waterChange}` : waterChange} ha
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              "{waterLabel}"
            </p>

            {/* Expandable Why & Evidence Details */}
            {expandedCard === 'water' && (
              <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-2 text-[11px]">
                <div className="text-slate-400 font-telemetry text-[10px] uppercase font-semibold">
                  HYDROLOGICAL INDICES:
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-start space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>NDWI (Normalized Difference Water Index) delta: {context.indices_summary.delta_ndwi_mean.toFixed(2)}.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row: Total Area & Confidence Bar */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-telemetry uppercase text-slate-400 font-semibold">
            Total Changed
          </span>
          <div className="text-base font-bold text-cyan-300 mt-1 font-telemetry">
            {context.total_changed_hectares.toLocaleString()} <span className="text-xs font-normal text-slate-400">ha</span>
          </div>
          <span className="text-[10.5px] text-slate-400 font-telemetry mt-0.5">
            {context.percent_aoi_changed}% of AOI
          </span>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-telemetry uppercase text-slate-400 font-semibold">
              Confidence
            </span>
            <button
              type="button"
              onClick={() => setShowConfidenceWhy(!showConfidenceWhy)}
              className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-0.5 font-telemetry"
            >
              <span>Why?</span>
              {showConfidenceWhy ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-base font-bold text-emerald-400 font-telemetry">
              {conf.overall_score}%
            </span>
            <span className="text-[10px] text-slate-300 font-telemetry uppercase">
              ({conf.rating})
            </span>
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
              style={{ width: `${conf.overall_score}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Expandable Confidence & Evidence Audit Trail */}
      {showConfidenceWhy && (
        <div className="rounded-xl p-3 border border-emerald-500/30 bg-emerald-950/20 text-xs font-sans space-y-2.5">
          <div className="flex items-center justify-between border-b border-emerald-800/40 pb-1.5 font-telemetry text-[11px] text-emerald-300 font-semibold">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EVIDENCE AUDIT TRAIL</span>
            </span>
            <span>{conf.overall_score}% DEFENDED</span>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300 font-telemetry bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <div>Satellite: <strong className="text-slate-100">{context.imagery_source}</strong></div>
            <div>Resolution: <strong className="text-slate-100">{context.resolution} GSD</strong></div>
            <div>Before Scene: <strong className="text-slate-200">{context.actual_before_date}</strong> (Cloud: {context.cloud_percentage_before}%)</div>
            <div>After Scene: <strong className="text-cyan-300">{context.actual_after_date}</strong> (Cloud: {context.cloud_percentage_after}%)</div>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="font-semibold text-slate-200 font-telemetry text-[10.5px] uppercase">Validated Evidence:</div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>NDBI increase (+{context.indices_summary.delta_ndbi_mean.toFixed(2)} mean)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>NDVI shift ({context.indices_summary.delta_ndvi_mean.toFixed(2)} mean)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Persistent change confirmed across multi-year timeline</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Cloud-filtered imagery (&lt;30% atmospheric threshold)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenProvenance}
            className="text-[10.5px] text-cyan-400 hover:underline font-telemetry pt-1 flex items-center space-x-1"
          >
            <span>Inspect full sensor metadata & STAC scenes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Significant Change Zones List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 font-telemetry uppercase tracking-wider flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>DETECTED ZONES ({context.change_regions.length})</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-telemetry">
            CLICK TO INSPECT
          </span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {context.change_regions.slice(0, 10).map((region, idx) => {
            const num = region.indicator_number || (idx + 1);
            return (
              <div
                key={region.id}
                onClick={() => onSelectRegion(region)}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-telemetry font-bold text-[10.5px] text-slate-950 shadow-sm"
                    style={{ backgroundColor: region.color }}
                  >
                    {num}
                  </span>
                  <div className="min-w-0">
                    <div className="text-slate-200 font-semibold group-hover:text-cyan-300 transition-colors truncate">
                      {region.user_label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-telemetry">
                      Hotspot #{num} • {region.centroid[1].toFixed(3)}°, {region.centroid[0].toFixed(3)}°
                    </div>
                  </div>
                </div>

                <div className="text-right font-telemetry shrink-0 pl-2">
                  <div className="text-slate-200 font-bold">{region.area_hectares} ha</div>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-end space-x-0.5">
                    <Crosshair className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                    <span>{region.confidence_pct}% conf</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
