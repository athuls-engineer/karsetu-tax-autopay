import React, { useId } from 'react';

interface KarSetuLogoProps {
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export const KarSetuLogo: React.FC<KarSetuLogoProps> = ({
  size = 38,
  className = '',
  showBadge = true,
}) => {
  const rawId = useId();
  // Sanitize React useId for safe SVG ID naming
  const id = 'ks_' + rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform hover:scale-105 duration-300 drop-shadow-md select-none"
      >
        <defs>
          {/* Sovereign Midnight Navy Container Gradient */}
          <linearGradient id={`${id}_bg`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="45%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Upper Bridge Cable / Ascending "K" Arm (Brilliant White to Electric Cyan) */}
          <linearGradient id={`${id}_upper`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Lower Bridge Cable / Foundation Arch (Brilliant White to Emerald Green) */}
          <linearGradient id={`${id}_lower`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Sovereign Pylon Mast Gradient */}
          <linearGradient id={`${id}_pylon`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* High-Speed Clearance Deck Gradient (Cyan to Amber Gold to Emerald) */}
          <linearGradient id={`${id}_deck`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>

          {/* Subtle Outer Rim Stroke */}
          <linearGradient id={`${id}_rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
            <stop offset="50%" stopColor="rgba(56, 189, 248, 0.4)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
          </linearGradient>
        </defs>

        {/* 1. Base Squircle Vessel - High Contrast on both white & black */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="16"
          fill={`url(#${id}_bg)`}
          stroke={`url(#${id}_rim)`}
          strokeWidth="1.5"
        />

        {/* 2. Architectural Bridge Cable Geometry Grid (Subtle) */}
        <path
          d="M12 48 Q32 38 52 48"
          stroke="#38BDF8"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
        />
        <path
          d="M12 16 Q32 26 52 16"
          stroke="#38BDF8"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
        />

        {/* 3. The Left Anchor Pillar of the Setu (Vertical Mast of "K") */}
        <rect
          x="15"
          y="15"
          width="7"
          height="34"
          rx="3.5"
          fill={`url(#${id}_pylon)`}
        />
        {/* Top Pylon Beacon */}
        <circle cx="18.5" cy="18.5" r="1.5" fill="#FFFFFF" />

        {/* 4. Upper Bridge Beam / Ascending "K" Arm (Ascending Financial Trajectory) */}
        <path
          d="M23 29 C27 28 31 23 45 15"
          stroke={`url(#${id}_upper)`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 5. Lower Bridge Arch / Anchoring "K" Leg (Safety Net & Rock-Solid Compliance) */}
        <path
          d="M23 35 C27 36 31 41 45 49"
          stroke={`url(#${id}_lower)`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 6. Central High-Speed Clearance Deck (Citizen-to-Treasury Highway) */}
        <path
          d="M11 32 H53"
          stroke={`url(#${id}_deck)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 7. Apex Clearance Node (Sky/Cyan Terminal) */}
        <circle
          cx="45"
          cy="15"
          r="3.5"
          fill="#38BDF8"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle
          cx="45"
          cy="15"
          r="1.2"
          fill="#FFFFFF"
        />

        {/* 8. Treasury Settlement Node (Emerald Terminal) */}
        <circle
          cx="45"
          cy="49"
          r="3.5"
          fill="#10B981"
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
        <circle
          cx="45"
          cy="49"
          r="1.2"
          fill="#FFFFFF"
        />

        {/* 9. Central Bridge Keystone (Golden Interchange) */}
        <circle
          cx="23"
          cy="32"
          r="2.5"
          fill="#F59E0B"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      </svg>

      {/* 10. Live Sovereign Pulse Beacon (Outer Status Ring) */}
      {showBadge && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-[#020617] shadow-xs" />
        </span>
      )}
    </div>
  );
};
