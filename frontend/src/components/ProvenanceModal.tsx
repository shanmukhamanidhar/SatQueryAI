import React from 'react';
import { 
  ShieldCheck, 
  X, 
  Database, 
  Calendar, 
  Globe2, 
  Download, 
  FileSpreadsheet, 
  Map, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AnalysisContext } from '../lib/types';
import { getCsvUrl, getGeoJsonUrl } from '../lib/api';

interface ProvenanceModalProps {
  context: AnalysisContext | null;
  onClose: () => void;
}

export const ProvenanceModal: React.FC<ProvenanceModalProps> = ({ context, onClose }) => {
  if (!context) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl panel-glass rounded-2xl border border-orbit-emerald/40 shadow-2xl p-5 font-sans animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-orbit-emerald/20 border border-orbit-emerald/40 flex items-center justify-center text-orbit-emerald">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-telemetry uppercase text-orbit-emerald font-bold tracking-wider">
                DATA PROVENANCE & SCIENTIFIC EVIDENCE
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Audit Trail & Sensor Metadata
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-space-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provenance Table */}
        <div className="space-y-4 text-xs font-telemetry">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Location & AOI */}
            <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Geographic Target</span>
              <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="text-slate-200">{context.location.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Feature Class:</span><span className="text-orbit-cyan capitalize font-semibold">{context.location.location_type || 'City Metro'}</span></div>
              {context.location.area_description && (
                <div className="text-[10px] text-cyan-300/80 bg-space-900/60 p-1 rounded border border-slate-800/80 leading-snug">
                  {context.location.area_description}
                </div>
              )}
              <div className="flex justify-between"><span className="text-slate-500">Coordinates:</span><span className="text-slate-200">{context.location.latitude.toFixed(4)}°, {context.location.longitude.toFixed(4)}°</span></div>
              <div className="flex justify-between"><span className="text-slate-500">AOI Surface:</span><span className="text-orbit-cyan font-semibold">{context.total_aoi_hectares.toLocaleString()} ha</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Bounding Box:</span><span className="text-slate-300 text-[10px] truncate max-w-[140px]">{JSON.stringify(context.location.bounding_box)}</span></div>
            </div>

            {/* Sensor & Satellite */}
            <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Spaceborne Sensor</span>
              <div className="flex justify-between"><span className="text-slate-500">Constellation:</span><span className="text-slate-200">Copernicus Sentinel-2</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Product:</span><span className="text-slate-200">Level-2A (BOA Reflectance)</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Spatial GSD:</span><span className="text-orbit-emerald font-semibold">{context.resolution}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">STAC Endpoint:</span><span className="text-slate-400 text-[10px]">AWS Earth Search Open Data</span></div>
            </div>
          </div>

          {/* Acquisition Passes */}
          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Satellite Observation Passes</span>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-2 rounded-lg bg-space-900/90 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Baseline Pass (Before)</span>
                <div>Acquisition: <strong className="text-slate-200">{context.actual_before_date}</strong></div>
                <div>Cloud Coverage: <span className="text-emerald-400">{context.cloud_percentage_before}%</span></div>
                <div>Usable Pixels: <span className="text-slate-300">{context.usable_pixel_pct_before}%</span></div>
              </div>
              <div className="p-2 rounded-lg bg-space-900/90 border border-slate-800">
                <span className="text-slate-400 font-bold block mb-1">Comparative Pass (After)</span>
                <div>Acquisition: <strong className="text-orbit-cyan">{context.actual_after_date}</strong></div>
                <div>Cloud Coverage: <span className="text-emerald-400">{context.cloud_percentage_after}%</span></div>
                <div>Usable Pixels: <span className="text-slate-300">{context.usable_pixel_pct_after}%</span></div>
              </div>
            </div>
            {context.temporal_match_note && (
              <p className="text-[10.5px] text-amber-300/90 font-sans">
                Notice: {context.temporal_match_note}
              </p>
            )}
          </div>

          {/* Confidence & Limitations */}
          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Confidence Telemetry</span>
              <span className="text-orbit-emerald font-bold">{context.confidence.overall_score}% ({context.confidence.rating})</span>
            </div>
            <div className="space-y-1">
              {context.confidence.factors.map((f, i) => (
                <div key={i} className="flex items-start space-x-1.5 text-[10.5px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orbit-emerald shrink-0 mt-0.5" />
                  <span className="text-slate-300">{f.text}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-800 text-[10.5px] text-slate-400 font-sans">
              <strong>Limitations:</strong> {context.confidence.limitations.join(' ')}
            </div>
          </div>

          {/* Raw Export Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <a
                href={getGeoJsonUrl(context.analysis_id)}
                download
                className="px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-750 border border-slate-700 hover:border-orbit-cyan text-slate-200 text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Map className="w-3.5 h-3.5 text-orbit-cyan" />
                <span>Export GeoJSON</span>
              </a>

              <a
                href={getCsvUrl(context.analysis_id)}
                download
                className="px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-750 border border-slate-700 hover:border-orbit-emerald text-slate-200 text-xs flex items-center space-x-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-orbit-emerald" />
                <span>Export Statistics CSV</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-telemetry transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
