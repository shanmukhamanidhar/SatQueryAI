import React from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Droplets, 
  Trees, 
  Building2, 
  Crosshair, 
  ShieldAlert, 
  ArrowRight,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { AnalysisContext, ChangeRegion } from '../lib/types';

interface DisasterMonitoringProps {
  context: AnalysisContext | null;
  onSelectRegion: (region: ChangeRegion) => void;
  onExploreHotspots: () => void;
  onSelectCity?: (cityQuery: string) => void;
}

export const DisasterMonitoring: React.FC<DisasterMonitoringProps> = ({
  context,
  onSelectRegion,
  onExploreHotspots,
  onSelectCity,
}) => {
  const regions = context?.change_regions || [];
  
  const quickCities = [
    { name: "Visakhapatnam", query: "Analyze Visakhapatnam between 2021 and 2026" },
    { name: "Krishna River (Vijayawada)", query: "Krishna River in Vijayawada between 2021 and 2026" },
    { name: "Hyderabad", query: "Analyze Hyderabad, Telangana between 2021 and 2026" },
    { name: "Bengaluru", query: "Analyze Bengaluru, Karnataka between 2021 and 2026" },
    { name: "Gujarat Coast", query: "Analyze Gujarat, India between 2021 and 2026" },
    { name: "Mumbai", query: "Analyze Mumbai, Maharashtra between 2021 and 2026" },
    { name: "Tokyo", query: "Analyze Tokyo, Japan between 2021 and 2026" },
    { name: "London", query: "Analyze London, United Kingdom between 2021 and 2026" },
  ];

  return (
    <section id="monitoring-section" className="py-20 bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-rose-600 dark:text-rose-400 uppercase tracking-widest font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DYNAMIC ANOMALY DETECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Change Hotspots & Environmental Stress
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-xl">
              Automatic clustering of surface transitions using morphological analysis and connected-component vectorization.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="text-slate-700 dark:text-zinc-300 font-medium">
              {context ? `${regions.length} Detected Hotspots in ${context.location.name}` : 'Awaiting Target Analysis'}
            </span>
          </div>
        </div>

        {/* City Options Ribbon */}
        {onSelectCity && (
          <div className="mb-8 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider shrink-0 mr-1 flex items-center space-x-1.5 font-medium">
              <Radio className="w-3 h-3 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span>Explore Hotspots by City:</span>
            </span>
            {quickCities.map((city, idx) => {
              const isActive = context?.location.name.toLowerCase().includes(city.name.toLowerCase().split(' ')[0]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectCity(city.query)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-blue-600 border border-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Hotspots Grid */}
        {regions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.slice(0, 6).map((region) => {
              const isCrit = region.delta_ndvi < -0.12 || region.category.toLowerCase().includes('loss');
              const isUrb = region.delta_ndbi > 0.08 || region.category.toLowerCase().includes('urban');
              const statusColor = isCrit ? '#dc2626' : isUrb ? '#ea580c' : '#2563eb';

              return (
                <div
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="group cursor-pointer rounded-2xl p-5 bg-white dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-850 border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-zinc-700 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs shrink-0 border border-white/20"
                          style={{ backgroundColor: region.color || statusColor }}
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[180px]">
                          {region.user_label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                        {region.confidence_pct}% Conf
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans mb-4">
                      {region.simple_explanation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                    <div>
                      Area: <strong className="text-slate-900 dark:text-white">{region.area_hectares} ha</strong>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
                      <span>Inspect Hotspot</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-12 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
            <Radio className="w-10 h-10 text-slate-400 dark:text-zinc-600 animate-pulse" />
            <div className="max-w-md">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Target Area Loaded
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Run an observation query from the hero or launch the automated SIH demo to inspect live detected change polygons and environmental stress zones.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreHotspots}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-semibold transition-all shadow-xs"
            >
              Analyze Target Hotspots →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
