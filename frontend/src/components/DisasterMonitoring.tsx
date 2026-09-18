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

  // Categorize real regions into critical, warning, and environmental
  const criticalHotspots = regions.filter(r => 
    r.category.toLowerCase().includes('loss') || 
    r.category.toLowerCase().includes('deforest') || 
    r.delta_ndvi < -0.12
  );

  const urbanHotspots = regions.filter(r => 
    r.category.toLowerCase().includes('urban') || 
    r.category.toLowerCase().includes('built') ||
    r.delta_ndbi > 0.07
  );

  const waterHotspots = regions.filter(r => 
    r.category.toLowerCase().includes('water')
  );

  return (
    <section id="monitoring-section" className="py-20 bg-[#03070D] border-b border-[#0C1C2A] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#FF5C62] uppercase tracking-widest font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DYNAMIC ANOMALY DETECTION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Change Hotspots & Environmental Stress
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Automatic clustering of anomalous surface transitions using morphological analysis and connected-component vectorization.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-[#FF5C62] animate-ping" />
            <span className="text-slate-300">
              {context ? `${regions.length} Detected Hotspots in ${context.location.name}` : 'Awaiting Target Analysis'}
            </span>
          </div>
        </div>

        {/* City Options Ribbon */}
        {onSelectCity && (
          <div className="mb-8 p-3 rounded-2xl bg-[#06101A] border border-[#0C1C2A] flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center space-x-1.5">
              <Radio className="w-3 h-3 text-[#42E8D0] animate-pulse" />
              <span>Explore Hotspots by City:</span>
            </span>
            {quickCities.map((city, idx) => {
              const isActive = context?.location.name.toLowerCase().includes(city.name.toLowerCase().split(' ')[0]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectCity(city.query)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-[#42E8D0]/20 border border-[#42E8D0] text-white font-bold shadow-sm'
                      : 'bg-[#081724] hover:bg-[#0C1C2A] border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Real Hotspots Grid */}
        {regions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.slice(0, 6).map((region, idx) => {
              const isCrit = region.delta_ndvi < -0.12 || region.category.toLowerCase().includes('loss');
              const isUrb = region.delta_ndbi > 0.08 || region.category.toLowerCase().includes('urban');
              const statusColor = isCrit ? '#FF5C62' : isUrb ? '#FFB454' : '#42E8D0';

              return (
                <div
                  key={region.id}
                  onClick={() => onSelectRegion(region)}
                  className="group cursor-pointer rounded-2xl p-5 bg-[#0C1C2A]/70 hover:bg-[#102536] border border-slate-800 hover:border-[#42E8D0]/50 transition-all duration-200 backdrop-blur-xl shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs text-slate-950 shadow-sm shrink-0"
                          style={{ backgroundColor: region.color || statusColor }}
                        >
                          {region.indicator_number || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#42E8D0] transition-colors truncate max-w-[180px]">
                          {region.user_label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#35D6A1] bg-[#35D6A1]/10 px-2 py-0.5 rounded-md border border-[#35D6A1]/20">
                        {region.confidence_pct}% Conf
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                      {region.simple_explanation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <div>
                      Area: <strong className="text-white">{region.area_hectares} ha</strong>
                    </div>
                    <div className="flex items-center space-x-1 text-[#42E8D0] group-hover:translate-x-1 transition-transform">
                      <span>Inspect Hotspot</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-10 bg-[#0C1C2A]/40 border border-slate-800/80 text-center flex flex-col items-center justify-center space-y-4">
            <Radio className="w-10 h-10 text-slate-600 animate-pulse" />
            <div className="max-w-md">
              <h3 className="text-base font-bold text-slate-200 mb-1">
                No Target Area Loaded
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Run an observation query from the hero or launch the automated SIH demo to inspect live detected change polygons and environmental stress zones.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreHotspots}
              className="px-4 py-2 rounded-xl bg-[#0C1C2A] hover:bg-[#102536] border border-[#42E8D0]/40 text-[#42E8D0] text-xs font-mono font-semibold transition-all"
            >
              Analyze Target Hotspots →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
