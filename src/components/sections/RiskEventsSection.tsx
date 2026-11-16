import React from 'react';
import { RiskEventsData } from '../../types/market';
import { Badge } from '../common/Badge';
import { ShieldAlert, AlertTriangle, Calendar, Activity, Zap } from 'lucide-react';

interface Props {
  data: RiskEventsData | null;
}

export const RiskEventsSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Risk & Event Monitor...</div>;
  }

  const { macro_risk_level, volatility_monitor, institutional_crowding, gamma_flip_levels, upcoming_catalysts } = data;

  return (
    <div className="space-y-6">
      {/* 1. Macro Risk Level Banner */}
      <div className="terminal-card p-4 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Systemic Risk Monitor</span>
              <Badge variant={macro_risk_level === 'CRITICAL' ? 'danger' : macro_risk_level === 'ELEVATED' ? 'warning' : 'info'}>
                {macro_risk_level} RISK
              </Badge>
              <Badge variant="neutral" size="sm">VIX Regime: {volatility_monitor.vix_regime}</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Active volatility monitoring: {volatility_monitor.guideline}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Volatility & Gamma Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* VIX Threshold Monitor */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-sky-400" />
              India VIX Threshold Gate
            </span>
            <Badge variant="neutral" size="sm">{volatility_monitor.vix_regime}</Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 my-1">
            {volatility_monitor.vix_level.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 font-mono">
            De-risking Trigger Barrier: <span className="text-rose-400 font-bold">{volatility_monitor.risk_threshold.toFixed(1)}</span>
          </p>
        </div>

        {/* Institutional Crowding Indicator */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              FII Derivatives Crowding
            </span>
            <Badge variant={institutional_crowding.alert === 'NORMAL' ? 'neutral' : 'danger'} size="sm">
              {institutional_crowding.alert}
            </Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 my-1">
            {institutional_crowding.fii_long_pct.toFixed(1)}% Longs
          </div>
          <p className="text-xs text-slate-400">
            {institutional_crowding.fii_long_pct < 25 
              ? 'Acute short crowding elevates squeeze probability.'
              : 'Institutional positioning is reasonably balanced.'}
          </p>
        </div>

        {/* Key Gamma Barriers */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Key Gamma Flip Barriers
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono mt-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Call Wall Ceiling:</span>
              <span className="text-rose-400 font-bold">{gamma_flip_levels.call_wall_resistance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Put Wall Floor:</span>
              <span className="text-emerald-400 font-bold">{gamma_flip_levels.put_wall_support.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max Pain Gravitation:</span>
              <span className="text-sky-400 font-bold">{gamma_flip_levels.max_pain.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Macro Catalysts Table */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-400" />
            Upcoming Scheduled Macro Catalysts & Market Events
          </span>
          <span className="text-xs text-slate-500 font-mono">Verified High-Impact Events</span>
        </div>

        <div className="divide-y divide-slate-800/60 font-mono text-xs">
          {upcoming_catalysts.map((cat, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Badge variant={cat.impact === 'HIGH' ? 'danger' : 'warning'} size="sm">
                  {cat.impact}
                </Badge>
                <span className="text-slate-200 font-medium">{cat.event}</span>
              </div>
              <div className="text-slate-400 text-right">
                {cat.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
