import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', showTagline = false, lightMode = false }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Custom Leaf / Pulse Icon SVG */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#123D2A] text-[#B7E36B] shadow-sm">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.2] stroke-linecap-round stroke-linejoin-round">
          {/* Leaf Contour */}
          <path d="M12 21A9 9 0 0 1 7.5 5.5C13 4 17 5 20 2c1 3 1.8 7 0 11-1.5 3-4.5 8-8 8Z" />
          {/* Heartbeat / Pulse Line inside leaf */}
          <path d="M4 14h3.5l1.8-3.5 2.4 7 2-4.5H18" stroke="#B7E36B" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg font-extrabold tracking-tight font-sans ${lightMode ? 'text-white' : 'text-[#123D2A]'}`}>
            GREENPULSE
          </span>
          <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.2 rounded bg-[#16A36A]/10 text-[#16A36A]">
            AGRI-AI
          </span>
        </div>
        {showTagline && (
          <span className={`text-[11px] leading-tight font-medium ${lightMode ? 'text-white/70' : 'text-[#4B5E53]'}`}>
            Growing Smarter with Climate Intelligence
          </span>
        )}
      </div>
    </div>
  );
};
