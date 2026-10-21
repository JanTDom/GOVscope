import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext: string;
  trend?: 'neutral' | 'positive' | 'critical';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend = 'neutral',
}) => {
  const getTrendStyle = () => {
    switch (trend) {
      case 'critical':
        return 'border-red-900/50 bg-red-950/20 text-red-400';
      case 'positive':
        return 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400';
      default:
        return 'border-slate-800 bg-slate-900/50 text-slate-400';
    }
  };

  return (
    <div className={`rounded-lg border p-4 shadow-sm ${getTrendStyle()}`}>
      <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-white font-mono">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{subtext}</div>
    </div>
  );
};
