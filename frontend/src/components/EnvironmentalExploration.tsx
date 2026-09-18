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
      color: 'from-[#35D6A1]/25 to-transparent',
      borderColor: 'border-[#35D6A1]/30 hover:border-[#35D6A1]',
      badgeColor: 'bg-[#35D6A1]/15 text-[#35D6A1] border-[#35D6A1]/30',
      icon: Trees,
      query: 'Vegetation loss in forest canopy',
      filter: 'Vegetation loss',
      bgGraphic: 'linear-gradient(135deg, rgba(53, 214, 161, 0.15) 0%, rgba(3, 7, 13, 0.95) 75%)'
    },
    {
      id: 'water',
      label: 'HYDROLOGY & WATER SECURITY',
      title: 'Water Bodies & Reservoirs',
      subtitle: 'Measure lake shrinkage, river channel dynamics, and wetland drying with the Normalized Difference Water Index (NDWI).',
      metric: 'NDWI Moisture Delta',
      color: 'from-[#4EA7FF]/25 to-transparent',
      borderColor: 'border-[#4EA7FF]/30 hover:border-[#4EA7FF]',
      badgeColor: 'bg-[#4EA7FF]/15 text-[#4EA7FF] border-[#4EA7FF]/30',
      icon: Droplets,
      query: 'Water reduction and reservoir changes',
      filter: 'Water reduction',
      bgGraphic: 'linear-gradient(135deg, rgba(78, 167, 255, 0.15) 0%, rgba(3, 7, 13, 0.95) 75%)'
    },
    {
      id: 'urban',
      label: 'BUILT ENVIRONMENT',
      title: 'Urban Expansion & Growth',
      subtitle: 'Detect newly constructed concrete, asphalt corridors, and industrial footprints via Normalized Difference Built-Up Index (NDBI).',
      metric: 'NDBI Impervious Index',
      color: 'from-[#FFB454]/25 to-transparent',
      borderColor: 'border-[#FFB454]/30 hover:border-[#FFB454]',
      badgeColor: 'bg-[#FFB454]/15 text-[#FFB454] border-[#FFB454]/30',
      icon: Building2,
      query: 'Urban growth and infrastructure expansion',
      filter: 'Urban development',
      bgGraphic: 'linear-gradient(135deg, rgba(255, 180, 84, 0.15) 0%, rgba(3, 7, 13, 0.95) 75%)'
    },
    {
      id: 'agriculture',
      label: 'CROPLAND MONITORING',
      title: 'Agricultural Productivity',
      subtitle: 'Monitor seasonal crop harvest cycles, field rotation, and arable soil transitions with multi-band surface reflectance.',
      metric: 'Multi-Band Reflectance',
      color: 'from-[#55DDE0]/25 to-transparent',
      borderColor: 'border-[#55DDE0]/30 hover:border-[#55DDE0]',
      badgeColor: 'bg-[#55DDE0]/15 text-[#55DDE0] border-[#55DDE0]/30',
      icon: Wheat,
      query: 'Agricultural crop transitions and cultivated land',
      filter: 'Vegetation gain',
      bgGraphic: 'linear-gradient(135deg, rgba(85, 221, 224, 0.15) 0%, rgba(3, 7, 13, 0.95) 75%)'
    },
  ];

  return (
    <section id="environmental-section" className="py-20 bg-[#06101A] border-b border-[#0C1C2A] relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-[#35D6A1] uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENVIRONMENTAL INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Healthier Planet is a Shared Journey.
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-xl">
              Explore the empirical scientific data behind the rapid environmental and physical changes shaping our world.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span>Filter or query directly into the map engine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCategory(c.query, c.filter)}
                className={`group cursor-pointer rounded-2xl p-7 border ${c.borderColor} transition-all duration-300 hover:-translate-y-1 relative overflow-hidden backdrop-blur-xl shadow-xl flex flex-col justify-between`}
                style={{ background: c.bgGraphic }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${c.badgeColor}`}>
                      {c.label}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-200 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#42E8D0]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 font-sans group-hover:text-[#42E8D0] transition-colors">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-md">
                    {c.subtitle}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-[#35D6A1]" />
                    <span>{c.metric}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200 group-hover:text-[#42E8D0] transition-colors">
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
