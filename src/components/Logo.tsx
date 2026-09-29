import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, showText = true, showTagline = true }) => {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Faceted Shield Emblem Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src="/vansidian-logo-v2.png"
          alt="Vansidian Logo"
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to SVG if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`${showTagline ? 'text-base font-semibold tracking-tight' : 'text-xl font-bold tracking-[-.025em]'} flex items-center font-sans leading-none text-white`}>
            Vansidian
          </span>
          {showTagline && <span className="mt-1 text-[11px] text-[var(--text-muted)]">Private payroll</span>}
        </div>
      )}
    </div>
  );
};
