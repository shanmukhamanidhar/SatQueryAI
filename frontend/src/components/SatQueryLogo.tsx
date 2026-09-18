import React from 'react';

interface SatQueryLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const SatQueryLogo: React.FC<SatQueryLogoProps> = ({ 
  size = 'md', 
  showText = true 
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;

  return (
    <div className="flex items-center space-x-2.5 group select-none">
      {/* Stylized Vector Satellite & Earth Emblem */}
      <div 
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#42E8D0]/30 to-[#4EA7FF]/20 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10"
        >
          {/* Earth Body */}
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="url(#earthGradient)"
            stroke="#42E8D0"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />

          {/* Earth Landform Contours */}
          <path
            d="M40 34C44 38 48 38 52 35C56 32 60 36 62 42C64 48 58 54 52 56C46 58 44 64 48 68"
            stroke="#42E8D0"
            strokeWidth="1.2"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* Elliptical Satellite Orbit */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="18"
            transform="rotate(-28 50 50)"
            stroke="url(#orbitGradient)"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />

          {/* Satellite Node at Orbit Apex */}
          <g transform="translate(82, 33)">
            <circle cx="0" cy="0" r="4.5" fill="#42E8D0" />
            <circle cx="0" cy="0" r="8" stroke="#42E8D0" strokeWidth="1" opacity="0.5" className="animate-ping" />
            {/* Satellite Solar Panels */}
            <line x1="-7" y1="0" x2="-4" y2="0" stroke="#55DDE0" strokeWidth="1.5" />
            <line x1="4" y1="0" x2="7" y2="0" stroke="#55DDE0" strokeWidth="1.5" />
          </g>

          {/* Gradient Definitions */}
          <defs>
            <radialGradient id="earthGradient" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#102536" />
              <stop offset="60%" stopColor="#081724" />
              <stop offset="100%" stopColor="#03070D" />
            </radialGradient>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#42E8D0" />
              <stop offset="50%" stopColor="#4EA7FF" />
              <stop offset="100%" stopColor="#8B6CFF" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1 leading-none">
            <span className="font-sans font-extrabold tracking-tight text-white text-base">
              SatQuery
            </span>
            <span className="font-sans font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#42E8D0] via-[#55DDE0] to-[#4EA7FF] text-base">
              AI
            </span>
          </div>
          <span className="text-[8.5px] font-mono tracking-widest text-[#42E8D0]/80 uppercase mt-0.5">
            SATELLITE INTELLIGENCE
          </span>
        </div>
      )}
    </div>
  );
};
