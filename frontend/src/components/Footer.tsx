import React from 'react';
import { Globe2, ShieldCheck, Database, Sparkles, ExternalLink, Cpu } from 'lucide-react';
import { SatQueryLogo } from './SatQueryLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#03070D] border-t border-[#0C1C2A] py-12 select-none text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <SatQueryLogo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Autonomous satellite remote sensing intelligence platform powered by Copernicus Sentinel-2 STAC, multi-band spectral processing, and Google Gemini spatial reasoning.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-[#42E8D0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#42E8D0] animate-pulse" />
              <span>OPERATIONAL SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Col 2: Telemetry & Sensors */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold">
              Spaceborne Sensors
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#42E8D0]" />
                <span>Copernicus Sentinel-2A / 2B L2A</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA7FF]" />
                <span>10m GSD Bands (B02, B03, B04, B08)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B6CFF]" />
                <span>20m SWIR Bands (B11, B12)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D6A1]" />
                <span>Esri World Imagery Wayback Archive</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Spectral Science */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold">
              Scientific Processing
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>NDVI — Vegetation Index (NIR - Red) / (NIR + Red)</li>
              <li>NDBI — Built-Up Index (SWIR - NIR) / (SWIR + NIR)</li>
              <li>NDWI — Water Body Index (Green - NIR) / (Green + NIR)</li>
              <li>Morphological Vector Clustered Polygons</li>
            </ul>
          </div>

          {/* Col 4: Platform Intelligence */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-bold">
              Artificial Intelligence
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Google Gemini Spatial Intelligence with dual REST transport. Autonomous natural-language query resolution, geocoding bounding box optimization, and verifiable evidence generation.
            </p>
            <div className="pt-2 text-[10.5px] font-mono text-[#35D6A1]">
              Smart India Hackathon Edition
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#0C1C2A] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} SatQueryAI. All Rights Reserved. Built for Autonomous Earth Observation.
          </div>
          <div className="flex items-center space-x-4">
            <span>Copernicus Open Access Hub</span>
            <span>•</span>
            <span>REST Spatial Pipeline</span>
            <span>•</span>
            <span>Zero-Click Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
