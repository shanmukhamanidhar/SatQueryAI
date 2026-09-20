import React from 'react';
import { 
  Trees, 
  Droplets, 
  Building2, 
  Wheat, 
  ArrowRight, 
  TrendingUp, 
  Sparkles 
} from 'lucide-react';

interface EnvironmentalExplorationProps {
  onSelectCategory: (categoryQuery: string, filterName?: string) => void;
}

export const EnvironmentalExploration: React.FC<EnvironmentalExplorationProps> = ({ 
  onSelectCategory 
}) => {
  const categories = [
    {
      id: 'vegetation',
      label: 'FORESTS & BIOMASS',
      title: 'Vegetation & Canopy Health',
      subtitle: 'Track deforestation, canopy disturbance, and ecological regeneration using Normalized Difference Vegetation Index (NDVI).',
      metric: 'NDVI Spectral Shift',
      thumbnail: '/thumbnails/category_vegetation.jpg',
      sensorTag: 'Copernicus Sentinel-2 • 10m',
      query: 'Vegetation loss in forest canopy',
      filter: 'Vegetation loss',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
      borderClass: 'border-slate-200 hover:border-emerald-400 dark:border-zinc-800 dark:hover:border-emerald-500/60',
      bgClass: 'bg-white hover:bg-emerald-50/20 dark:bg-zinc-900/80 dark:hover:bg-zinc-850',
    },
    {
      id: 'water',
      label: 'HYDROLOGY & WATER SECURITY',
      title: 'Water Bodies & Reservoirs',
      subtitle: 'Measure lake shrinkage, river channel dynamics, and wetland drying with the Normalized Difference Water Index (NDWI).',
      metric: 'NDWI Moisture Delta',
      thumbnail: '/thumbnails/category_water.jpg',
      sensorTag: 'Copernicus Sentinel-2 • 10m',
      query: 'Water reduction and reservoir changes',
      filter: 'Water reduction',
      colorClass: 'text-blue-600 dark:text-blue-400',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
      borderClass: 'border-slate-200 hover:border-blue-400 dark:border-zinc-800 dark:hover:border-blue-500/60',
      bgClass: 'bg-white hover:bg-blue-50/20 dark:bg-zinc-900/80 dark:hover:bg-zinc-850',
    },
    {
      id: 'urban',
      label: 'BUILT ENVIRONMENT',
      title: 'Urban Expansion & Growth',
      subtitle: 'Detect newly constructed concrete, asphalt corridors, and industrial footprints via Normalized Difference Built-Up Index (NDBI).',
      metric: 'NDBI Impervious Index',
      thumbnail: '/thumbnails/category_urban.jpg',
      sensorTag: 'Copernicus Sentinel-2 • 10m',
      query: 'Urban growth and infrastructure expansion',
      filter: 'Urban development',
      colorClass: 'text-orange-600 dark:text-orange-400',
      badgeClass: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50',
      borderClass: 'border-slate-200 hover:border-orange-400 dark:border-zinc-800 dark:hover:border-orange-500/60',
      bgClass: 'bg-white hover:bg-orange-50/20 dark:bg-zinc-900/80 dark:hover:bg-zinc-850',
    },
    {
      id: 'agriculture',
      label: 'CROPLAND MONITORING',
      title: 'Agricultural Productivity',
      subtitle: 'Monitor seasonal crop harvest cycles, field rotation, and arable soil transitions with multi-band surface reflectance.',
      metric: 'Multi-Band Reflectance',
      thumbnail: '/thumbnails/category_agriculture.jpg',
      sensorTag: 'Copernicus Sentinel-2 • 10m',
      query: 'Agricultural crop transitions and cultivated land',
      filter: 'Vegetation gain',
      colorClass: 'text-amber-600 dark:text-amber-400',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
      borderClass: 'border-slate-200 hover:border-amber-400 dark:border-zinc-800 dark:hover:border-amber-500/60',
      bgClass: 'bg-white hover:bg-amber-50/20 dark:bg-zinc-900/80 dark:hover:bg-zinc-850',
    },
  ];

  return (
    <section id="environmental-section" className="py-20 bg-slate-50 dark:bg-[#09090b] border-b border-slate-200 dark:border-zinc-800 relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EMPIRICAL MULTISPECTRAL PILLARS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Science-Backed Earth Exploration.
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2 max-w-xl">
              Inspect physical transitions through calibrated satellite indices and morphological change boundaries.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            <span>Filter directly into the satellite analytics engine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((c) => {
            return (
              <div
                key={c.id}
                onClick={() => onSelectCategory(c.query, c.filter)}
                className={`group cursor-pointer rounded-2xl p-6 border ${c.borderClass} ${c.bgClass} transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between`}
              >
                <div>
                  {/* Visual Satellite Thumbnail Header Strip */}
                  <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 border border-slate-200/90 dark:border-zinc-700/80 shadow-inner bg-slate-950">
                    <img 
                      src={c.thumbnail} 
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm ${c.badgeClass}`}>
                        {c.label}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-telemetry text-white/90">
                      <span className="bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 font-mono">
                        {c.sensorTag}
                      </span>
                      <span className="bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 font-mono text-emerald-400 font-bold">
                        Calibrated Optical RGB
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-2 font-sans group-hover:${c.colorClass} transition-colors`}>
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans max-w-md">
                    {c.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                    <TrendingUp className={`w-3.5 h-3.5 ${c.colorClass}`} />
                    <span>{c.metric}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <span>Analyze Category</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
