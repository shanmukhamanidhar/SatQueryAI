import React, { useState, useMemo } from 'react';
import { MapPin, Globe2, Compass, Sparkles, Building2, Droplets, Trees, ArrowRight, Satellite, Search } from 'lucide-react';
import { AVAILABLE_LOCATIONS, AvailableLocation } from '../lib/availableLocations';

interface CitySelectorProps {
  activeLocationName?: string;
  onSelectCity: (query: string) => void;
  isAnalyzing: boolean;
  onOpenRawSatellite?: () => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  activeLocationName = '',
  onSelectCity,
  isAnalyzing,
  onOpenRawSatellite,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'states' | 'uts' | 'global'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredCities = useMemo(() => {
    return AVAILABLE_LOCATIONS.filter((city) => {
      if (filterTab === 'all' && !(city.isState || city.isUT)) return false;
      if (filterTab === 'states' && !city.isState) return false;
      if (filterTab === 'uts' && !city.isUT) return false;
      if (filterTab === 'global' && (city.isState || city.isUT)) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          city.name.toLowerCase().includes(q) ||
          city.region.toLowerCase().includes(q) ||
          city.country.toLowerCase().includes(q) ||
          city.tag.toLowerCase().includes(q) ||
          city.focus.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filterTab, searchTerm]);

  const getCategoryTheme = (city: AvailableLocation) => {
    if (city.isState) {
      return {
        icon: <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50',
      };
    }
    if (city.isUT) {
      return {
        icon: <Compass className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
        badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/50',
      };
    }
    switch (city.category) {
      case 'water':
        return {
          icon: <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
          badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50',
        };
      case 'forest':
        return {
          icon: <Trees className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/50',
        };
      case 'coastal':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
          badge: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900/50',
        };
      default:
        return {
          icon: <Building2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />,
          badge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900/50',
        };
    }
  };

  const isCurrentActive = (city: AvailableLocation) => {
    if (!activeLocationName) return false;
    const normActive = activeLocationName.toLowerCase();
    return normActive.includes(city.name.toLowerCase()) || normActive.includes(city.id);
  };

  return (
    <div className="w-full mb-8 select-none">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide font-sans">
            India-Wide Satellite Observation Registry
          </h3>
          <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
            ({filteredCities.length} locations)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search state, UT, city..."
              className="pl-8 pr-3 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 w-44 sm:w-56"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono">
            {[
              { id: 'all', label: 'All India (36)' },
              { id: 'states', label: 'States (28)' },
              { id: 'uts', label: 'UTs (8)' },
              { id: 'global', label: 'Global (6)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                  filterTab === tab.id
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Raw Satellite Studio Option Button */}
          {onOpenRawSatellite && (
            <button
              type="button"
              onClick={onOpenRawSatellite}
              className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-bold transition-all shadow-xs flex items-center space-x-1.5"
              title="Compare raw optical satellite images side-by-side"
            >
              <Satellite className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>RAW SATELLITE</span>
            </button>
          )}
        </div>
      </div>

      {/* City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredCities.map((city) => {
          const active = isCurrentActive(city);
          const theme = getCategoryTheme(city);

          return (
            <div
              key={city.id}
              onClick={() => {
                if (!isAnalyzing) {
                  onSelectCity(city.query);
                }
              }}
              className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                active
                  ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/30'
                  : 'bg-white dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-800/80 border-slate-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-zinc-700 shadow-xs'
              } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                {/* Card Tag & Category Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold tracking-wider uppercase border ${theme.badge}`}>
                    {theme.icon}
                    <span>{city.tag}</span>
                  </span>
                  {active && (
                    <span className="px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold bg-blue-600 text-white shadow-xs flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>ACTIVE</span>
                    </span>
                  )}
                </div>

                {/* City Title */}
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-0.5 font-sans">
                  {city.name}
                </h4>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2 font-medium">
                  {city.region}, {city.country}
                </div>

                {/* Focus description */}
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans">
                  {city.focus}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[10.5px] font-mono text-slate-500 dark:text-zinc-400">
                <span>Pass: {city.years}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                  <span>Analyze</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
