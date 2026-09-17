import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 36, showText = true }) => {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Faceted Shield Emblem Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.png"
          alt="Vansidian Logo"
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            // Fallback to SVG if image fails
            const target = e.currentTarget;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-white tracking-tight text-base flex items-center font-sans leading-none">
            Vansidian
          </span>
          <span className="text-[11px] text-[var(--text-muted)] mt-1">
            Private payroll
          </span>
        </div>
      )}
    </div>
  );
};
