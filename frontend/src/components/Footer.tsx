import React from 'react';
import { SatQueryLogo } from './SatQueryLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-50 dark:bg-[#09090b] border-t border-slate-200 dark:border-zinc-800 py-12 select-none text-slate-600 dark:text-zinc-400 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-3">
            <SatQueryLogo size="md" />
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed pt-2">
              Autonomous satellite remote sensing intelligence platform powered by Copernicus Sentinel-2 STAC, multi-band spectral processing, and spatial reasoning.
            </p>
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>OPERATIONAL SYSTEM ONLINE</span>
            </div>
          </div>

          {/* Col 2: Telemetry & Sensors */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Spaceborne Sensors
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>Copernicus Sentinel-2A / 2B L2A</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>10m GSD Bands (B02, B03, B04, B08)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>20m SWIR Bands (B11, B12)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Esri World Imagery Archive</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Spectral Science */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Scientific Processing
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <li>NDVI — Vegetation Index (NIR - Red) / (NIR + Red)</li>
              <li>NDBI — Built-Up Index (SWIR - NIR) / (SWIR + NIR)</li>
              <li>NDWI — Water Body Index (Green - NIR) / (Green + NIR)</li>
              <li>Morphological Vector Clustered Polygons</li>
            </ul>
          </div>

          {/* Col 4: Platform Intelligence */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Autonomous Intelligence
            </h4>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Spatial Intelligence with dual REST transport. Autonomous natural-language query resolution, geocoding bounding box optimization, and verifiable evidence generation.
            </p>
            <div className="pt-2 text-[10.5px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Smart India Hackathon Edition
            </div>
          </div>

          {/* Col 5: Developed By (Team Credits) */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              DEVELOPED BY
            </h4>
            <div className="space-y-2 pt-0.5">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  B. Viharika
                </div>
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-medium">
                  Team Lead
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                  B. Kamal Misra
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                  Team Member
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                  P. Sam
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                  Team Member
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                  K. S. Pradheet
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                  Team Member
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                  S. Shanmukha Manidhar
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                  Team Member
                </div>
              </div>
              <div>
                <div className="font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                  M. Krishna Prasanth
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                  Team Member
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-500 gap-3">
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
