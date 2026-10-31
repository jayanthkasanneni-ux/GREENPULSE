import React from 'react';
import { Info } from 'lucide-react';

interface DemoDisclaimerProps {
  className?: string;
  text?: string;
}

export const DemoDisclaimer: React.FC<DemoDisclaimerProps> = ({
  className = '',
  text = 'Data shown is calibrated demonstration simulation data for decision-support modeling. Final field sowing must align with real-time IMD rain forecasts and local agricultural university advisories.',
}) => {
  return (
    <div className={`p-3 rounded-lg bg-[#F7F9F5] border border-[#123D2A]/10 text-xs text-[#4B5E53] flex items-start gap-2.5 ${className}`}>
      <Info className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
      <span className="leading-relaxed">{text}</span>
    </div>
  );
};
