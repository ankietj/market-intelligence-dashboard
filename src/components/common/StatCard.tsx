import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: number;
  changeUnit?: string;
  trend?: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'UP' | 'DOWN' | 'NONE';
  description?: string;
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  change,
  changeUnit = '%',
  trend = 'NONE',
  description,
  badge,
}) => {
  const isPositive = (change !== undefined && change > 0) || trend === 'BULLISH' || trend === 'UP';
  const isNegative = (change !== undefined && change < 0) || trend === 'BEARISH' || trend === 'DOWN';

  const colorClass = isPositive
    ? 'text-emerald-400'
    : isNegative
    ? 'text-rose-400'
    : 'text-slate-200';

  return (
    <div className="terminal-card p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          {title}
        </span>
        {badge}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold font-mono-tabular text-slate-100">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {subValue && (
          <span className="text-xs text-slate-400 font-mono-tabular">
            {subValue}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs mt-1">
        {change !== undefined ? (
          <div className={`flex items-center gap-1 font-mono-tabular font-medium ${colorClass}`}>
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : isNegative ? (
              <ArrowDownRight className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>
              {change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2)}
              {changeUnit}
            </span>
          </div>
        ) : (
          <div className="text-slate-500 text-[11px]">{description || '—'}</div>
        )}
      </div>
    </div>
  );
};
