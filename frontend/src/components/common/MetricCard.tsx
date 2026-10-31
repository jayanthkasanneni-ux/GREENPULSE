import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  highlightColor?: 'forest' | 'emerald' | 'amber' | 'rose' | 'neutral';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  highlightColor = 'forest',
}) => {
  const iconBgClasses = {
    forest: 'bg-[#123D2A]/5 text-[#123D2A]',
    emerald: 'bg-[#16A36A]/10 text-[#16A36A]',
    amber: 'bg-amber-500/10 text-amber-700',
    rose: 'bg-rose-500/10 text-rose-700',
    neutral: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="bg-white rounded-xl border border-[#123D2A]/10 p-5 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-[#4B5E53] tracking-wide uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-lg ${iconBgClasses[highlightColor]} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-[#1C2922] tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-[#73877B]">
            {unit}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-[#73877B]">
          {subtitle && <span className="truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-medium tabular-nums ml-auto ${
                trend.direction === 'up'
                  ? 'text-[#16A36A]'
                  : trend.direction === 'down'
                  ? 'text-amber-700'
                  : 'text-slate-500'
              }`}
            >
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
