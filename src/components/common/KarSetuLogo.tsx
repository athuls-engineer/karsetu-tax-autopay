import React from 'react';

interface KarSetuLogoProps {
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export const KarSetuLogo: React.FC<KarSetuLogoProps> = ({
  size = 40,
  className = '',
  showBadge = true,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-300 drop-shadow-md"
      >
        <defs>
          {/* Sovereign Vault Gradient */}
          <linearGradient id="ksBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1938" />
            <stop offset="50%" stopColor="#082154" />
            <stop offset="100%" stopColor="#020B1E" />
          </linearGradient>

          {/* Core Setu Arch Gradient (Electric Blue -> Cyan -> Emerald) */}
          <linearGradient id="ksBridgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Pillar Gradient (Sovereign Indigo) */}
          <linearGradient id="ksPillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Deck Horizontal Ray Gradient */}
          <linearGradient id="ksDeckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Outer Border Rim */}
          <linearGradient id="ksRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.25)" />
          </linearGradient>

          {/* Glow Filter */}
          <filter id="ksGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Squircle Vessel */}
        <rect
          x="2.5"
          y="2.5"
          width="59"
          height="59"
          rx="18"
          fill="url(#ksBaseGrad)"
          stroke="url(#ksRimGrad)"
          strokeWidth="1.5"
        />

        {/* 2. Precision Architectural Grid & Radiance Lines */}
        <path
          d="M20 18 L46 44 M20 44 L46 18"
          stroke="white"
          strokeOpacity="0.04"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx="32" cy="32" r="22" stroke="white" strokeOpacity="0.03" strokeWidth="1" />

        {/* 3. The Left Anchor Pillar of the Setu (Vertical Mast of "K") */}
        <rect
          x="15"
          y="15"
          width="7"
          height="34"
          rx="3.5"
          fill="url(#ksPillarGrad)"
        />
        {/* Pillar Highlight Bead */}
        <circle cx="18.5" cy="19" r="1.5" fill="#E0F2FE" />

        {/* 4. Suspension Cable Lines (Structural Bridge Geometry) */}
        <line x1="18.5" y1="20" x2="43" y2="20" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1.5 1.5" />
        <line x1="18.5" y1="44" x2="43" y2="44" stroke="#10B981" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="1.5 1.5" />

        {/* 5. Upper Bridge Beam / Ascending "K" Arm (The Trajectory) */}
        <path
          d="M23 29.5 C25 29.5 28 27.5 32 23 L44 17"
          stroke="url(#ksBridgeGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ksGlow)"
        />

        {/* 6. Lower Bridge Arch / Anchoring "K" Leg (The Foundation) */}
        <path
          d="M23 34.5 C26 34.5 29 36.5 33 41 L43 47"
          stroke="url(#ksBridgeGrad)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ksGlow)"
        />

        {/* 7. Central High-Speed Deck Span (The Citizen-Treasury Rail) */}
        <path
          d="M13 32 H49"
          stroke="url(#ksDeckGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 8. Cryptographic Clearance Node (Golden Keystone) */}
        <circle
          cx="44"
          cy="17"
          r="3"
          fill="#38BDF8"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle
          cx="44"
          cy="17"
          r="1.2"
          fill="#FFFFFF"
        />

        {/* 9. Treasury Settlement Point (Emerald Terminal) */}
        <circle
          cx="43"
          cy="47"
          r="2.5"
          fill="#34D399"
          stroke="#064E3B"
          strokeWidth="1"
        />
      </svg>

      {/* 10. Live Sovereign Pulse Beacon (Outer Status Ring) */}
      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-[#020B1E]" />
        </span>
      )}
    </div>
  );
};
