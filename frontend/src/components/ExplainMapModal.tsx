import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  X, 
  Layers, 
  HelpCircle, 
  Compass, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AnalysisContext } from '../lib/types';
import { explainMap } from '../lib/api';

interface ExplainMapModalProps {
  context: AnalysisContext | null;
  onClose: () => void;
}

export const ExplainMapModal: React.FC<ExplainMapModalProps> = ({ context, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [explanationText, setExplanationText] = useState<string>('');

  useEffect(() => {
    if (!context) return;
    setLoading(true);

    explainMap({
      analysis_id: context.analysis_id,
      active_layer: 'Multispectral Change Composite',
    })
      .then((res) => {
        setExplanationText(res.explanation);
      })
      .catch((err) => {
        setExplanationText(
          `You are viewing **${context.location.name}** comparing observations from **${context.actual_before_date}** to **${context.actual_after_date}**.\n\n` +
          `• **Orange Zones:** Indicate detected built-up and development surface expansion.\n` +
          `• **Green Zones:** Highlight photosynthetically active vegetation canopy.\n` +
          `• **Red Contours:** Mark regions of major detected surface change exceeding the analytical threshold.\n\n` +
          `Satellite observations confirm physical alterations across ${context.total_changed_hectares} hectares in the selected area.`
        );
      })
      .finally(() => setLoading(false));
  }, [context?.analysis_id]);

  if (!context) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl panel-glass rounded-2xl border border-orbit-cyan/40 shadow-2xl p-5 font-sans animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-orbit-cyan/20 border border-orbit-cyan/40 flex items-center justify-center text-orbit-cyan shadow-glow-cyan">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-telemetry uppercase text-orbit-cyan font-bold tracking-wider">
                AI MAP EXPLANATION
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Understanding the Active Map View
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

        {/* Body Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Activity className="w-6 h-6 animate-spin text-orbit-cyan" />
            <p className="text-xs font-telemetry text-slate-400">
              Synthesizing geospatial observation context...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-space-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {explanationText}
            </div>

            {/* Quick Map Key Reference */}
            <div className="grid grid-cols-3 gap-2 text-[11px] font-telemetry">
              <div className="p-2 rounded-lg bg-space-900 border border-slate-800 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-slate-300">Built-up Signal</span>
              </div>
              <div className="p-2 rounded-lg bg-space-900 border border-slate-800 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-300">Vegetation Health</span>
              </div>
              <div className="p-2 rounded-lg bg-space-900 border border-slate-800 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-slate-300">High Change</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-orbit-cyan text-space-950 font-bold text-xs rounded-lg font-telemetry hover:bg-orbit-cyan/90 transition-colors"
              >
                GOT IT, RETURN TO MAP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
