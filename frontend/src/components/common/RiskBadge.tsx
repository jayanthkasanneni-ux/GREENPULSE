import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '', showIcon = true }) => {
  const configs = {
    low: {
      label: 'Low Climate Risk',
      textColor: 'text-emerald-800',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-700',
    },
    moderate: {
      label: 'Moderate Climate Risk',
      textColor: 'text-amber-800',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-700',
    },
    high: {
      label: 'High Climate Risk',
      textColor: 'text-rose-800',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      icon: AlertOctagon,
      iconColor: 'text-rose-700',
    },
  };

  const config = configs[level] || configs.low;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 ${config.iconColor} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
