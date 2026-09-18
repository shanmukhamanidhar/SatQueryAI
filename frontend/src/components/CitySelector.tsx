import React, { useState } from 'react';
import { MapPin, Globe2, Compass, Sparkles, Building2, Droplets, Trees, Factory, ArrowRight, Satellite } from 'lucide-react';

interface CityOption {
  id: string;
  name: string;
  region: string;
  country: string;
  query: string;
  category: 'urban' | 'water' | 'forest' | 'coastal';
  tag: string;
  focus: string;
  years: string;
}

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
  const [filterTab, setFilterTab] = useState<'all' | 'india' | 'global' | 'environmental'>('all');

  const cities: CityOption[] = [
    {
      id: 'visakhapatnam',
      name: 'Visakhapatnam',
      region: 'Andhra Pradesh',
      country: 'India',
      query: 'Analyze Visakhapatnam between 2021 and 2026',
      category: 'coastal',
      tag: 'COASTAL & PORT',
      focus: 'Harbour expansion, industrial corridors & coastal urban growth',
      years: '2021–2026',
    },
    {
      id: 'vijayawada',
      name: 'Krishna River',
      region: 'Vijayawada, Andhra Pradesh',
      country: 'India',
      query: 'Krishna River in Vijayawada between 2021 and 2026',
      category: 'water',
      tag: 'RIVER HYDROLOGY',
      focus: 'Prakasam Barrage floodplain, sediment shifts & river channel dynamics',
      years: '2021–2026',
    },
    {
      id: 'hyderabad',
      name: 'Hyderabad',
      region: 'Telangana',
      country: 'India',
      query: 'Analyze Hyderabad, Telangana between 2021 and 2026',
      category: 'urban',
      tag: 'IT CORRIDOR',
      focus: 'HITEC City, Financial District & Outer Ring Road rapid infrastructure',
      years: '2021–2026',
    },
    {
      id: 'bengaluru',
      name: 'Bengaluru',
      region: 'Karnataka',
      country: 'India',
      query: 'Analyze Bengaluru, Karnataka between 2021 and 2026',
      category: 'urban',
      tag: 'SILICON VALLEY',
      focus: 'Tech parks, Bellandur lake catchment & peripheral urban sprawl',
      years: '2021–2026',
    },
    {
      id: 'gujarat',
      name: 'Gujarat Coast',
      region: 'Gujarat',
      country: 'India',
      query: 'Analyze Gujarat, India between 2021 and 2026',
      category: 'coastal',
      tag: 'COASTAL SALINITY',
      focus: 'Gulf of Khambhat mudflats, port infrastructure & cropland shifts',
      years: '2021–2026',
    },
    {
      id: 'mumbai',
      name: 'Mumbai Coast',
      region: 'Maharashtra',
      country: 'India',
      query: 'Analyze Mumbai, Maharashtra between 2021 and 2026',
      category: 'coastal',
      tag: 'COASTAL RECLAMATION',
      focus: 'Coastal Road project, harbour development & mangrove buffer zones',
      years: '2021–2026',
    },
    {
      id: 'delhi',
      name: 'Delhi NCR',
      region: 'National Capital Region',
      country: 'India',
      query: 'Analyze Delhi, India between 2021 and 2026',
      category: 'urban',
      tag: 'METROPOLITAN',
      focus: 'Yamuna river corridor, expressways & peri-urban agricultural conversion',
      years: '2021–2026',
    },
    {
      id: 'dubai',
      name: 'Dubai',
      region: 'Emirate of Dubai',
      country: 'United Arab Emirates',
      query: 'Analyze Dubai, UAE between 2021 and 2026',
      category: 'urban',
      tag: 'DESERT METROPOLIS',
      focus: 'Island developments, desert urban sprawl & mega-infrastructure',
      years: '2021–2026',
    },
    {
      id: 'tokyo',
      name: 'Tokyo Bay',
      region: 'Kanto',
      country: 'Japan',
      query: 'Analyze Tokyo, Japan between 2021 and 2026',
      category: 'urban',
      tag: 'MEGACITY',
      focus: 'Tokyo Bay land reclamation, coastal logistics & urban density',
      years: '2021–2026',
    },
    {
      id: 'london',
      name: 'London',
      region: 'Greater London',
      country: 'United Kingdom',
      query: 'Analyze London, United Kingdom between 2021 and 2026',
      category: 'water',
      tag: 'THAMES CORRIDOR',
      focus: 'Thames estuary development, brownfield transformation & green belts',
      years: '2021–2026',
    },
    {
      id: 'amazon',
      name: 'Amazon Basin',
      region: 'Para',
      country: 'Brazil',
      query: 'Analyze Para, Brazil between 2021 and 2026',
      category: 'forest',
      tag: 'RAINFOREST CANOPY',
      focus: 'Tropical deforestation frontier, logging tracks & agricultural boundary',
      years: '2021–2026',
    },
    {
      id: 'sydney',
      name: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      query: 'Analyze Sydney, Australia between 2021 and 2026',
      category: 'coastal',
      tag: 'HARBOUR METRO',
      focus: 'Western Sydney Airport aerotropolis & coastal catchment areas',
      years: '2021–2026',
    },
  ];

  const filteredCities = cities.filter((city) => {
    if (filterTab === 'india') return city.country === 'India';
    if (filterTab === 'global') return city.country !== 'India';
    if (filterTab === 'environmental') return city.category === 'water' || city.category === 'forest';
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-[#4EA7FF]" />;
      case 'forest':
        return <Trees className="w-3.5 h-3.5 text-[#35D6A1]" />;
      case 'coastal':
        return <Compass className="w-3.5 h-3.5 text-[#42E8D0]" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-[#FFB454]" />;
    }
  };

  const isCurrentActive = (city: CityOption) => {
    if (!activeLocationName) return false;
    const normActive = activeLocationName.toLowerCase();
    return normActive.includes(city.name.toLowerCase()) || normActive.includes(city.id);
  };

  return (
    <div className="w-full mb-8 select-none">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-[#42E8D0]" />
          <h3 className="text-sm font-bold text-white tracking-wide font-sans">
            Choose an Earth Observation Location
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            ({filteredCities.length} locations)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#06101A] border border-[#0C1C2A] text-xs font-mono">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'all'
                  ? 'bg-[#42E8D0]/15 text-[#42E8D0] font-bold border border-[#42E8D0]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Cities
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('india')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'india'
                  ? 'bg-[#42E8D0]/15 text-[#42E8D0] font-bold border border-[#42E8D0]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              India Focus
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('global')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'global'
                  ? 'bg-[#42E8D0]/15 text-[#42E8D0] font-bold border border-[#42E8D0]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Global
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('environmental')}
              className={`px-3 py-1 rounded-lg transition-all ${
                filterTab === 'environmental'
                  ? 'bg-[#42E8D0]/15 text-[#42E8D0] font-bold border border-[#42E8D0]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Nature & Water
            </button>
          </div>

          {/* Raw Satellite Studio Option Button */}
          {onOpenRawSatellite && (
            <button
              type="button"
              onClick={onOpenRawSatellite}
              className="px-3 py-1 rounded-xl bg-gradient-to-r from-orbit-cyan/20 to-emerald-500/20 hover:from-orbit-cyan/35 hover:to-emerald-500/35 border border-orbit-cyan/50 text-orbit-cyan hover:text-white text-xs font-mono font-bold transition-all shadow-[0_0_12px_rgba(0,240,255,0.2)] flex items-center space-x-1.5"
              title="Compare raw optical satellite images side-by-side with timeline choice"
            >
              <Satellite className="w-3.5 h-3.5 text-orbit-cyan animate-pulse" />
              <span>RAW SATELLITE (SIDE-BY-SIDE)</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable City Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filteredCities.map((city) => {
          const active = isCurrentActive(city);

          return (
            <div
              key={city.id}
              onClick={() => {
                if (!isAnalyzing) {
                  onSelectCity(city.query);
                }
              }}
              className={`group cursor-pointer p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                active
                  ? 'bg-[#081724] border-[#42E8D0] shadow-[0_0_20px_rgba(66,232,208,0.25)] ring-1 ring-[#42E8D0]/30'
                  : 'bg-[#06101A]/80 hover:bg-[#0C1C2A] border-[#0C1C2A] hover:border-[#42E8D0]/50'
              } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                {/* Card Tag & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center space-x-1.5 text-[9.5px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {getCategoryIcon(city.category)}
                    <span>{city.tag}</span>
                  </span>
                  {active && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#42E8D0]/20 text-[#42E8D0] border border-[#42E8D0]/40 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#42E8D0] animate-ping" />
                      <span>LOADED</span>
                    </span>
                  )}
                </div>

                {/* City Title */}
                <h4 className="text-sm font-bold text-white group-hover:text-[#42E8D0] transition-colors leading-tight mb-0.5 font-sans">
                  {city.name}
                </h4>
                <div className="text-[11px] text-slate-400 mb-2">
                  {city.region}, {city.country}
                </div>

                {/* Focus description */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                  {city.focus}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-3 pt-2 border-t border-[#0C1C2A] flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Pass: {city.years}</span>
                <span className="text-[#42E8D0] font-semibold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
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
