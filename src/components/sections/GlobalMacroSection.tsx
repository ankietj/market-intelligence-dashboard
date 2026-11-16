import React from 'react';
import { GlobalMacroData } from '../../types/market';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Globe, Info } from 'lucide-react';

interface Props {
  data: GlobalMacroData | null;
}

export const GlobalMacroSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Global & Macro Intelligence...</div>;
  }

  const { indicators, macro_risk_score, macro_risk_tilt, headwind_level, global_indices } = data;

  const riskVariant = macro_risk_score > 0.6 ? 'danger' : macro_risk_score > 0.4 ? 'warning' : 'success';

  return (
    <div className="space-y-6">
      {/* 1. Macro Risk Header Card */}
      <div className="terminal-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Global Macro Risk Regime</span>
              <Badge variant={riskVariant}>{headwind_level} HEADWIND</Badge>
              <Badge variant="neutral" size="sm">Tilt: {macro_risk_tilt}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Derived risk score: <span className="font-mono font-bold text-slate-200">{(macro_risk_score * 100).toFixed(0)} / 100</span> based on currency, crude, yields, and dollar index momentum.
            </p>
          </div>
        </div>

        {/* GIFT Nifty Proxy Notice */}
        <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800 text-xs max-w-md">
          <div className="flex items-center gap-1.5 text-sky-400 font-medium mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>GIFT NIFTY Proxy Indication</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {indicators.gift_nifty_proxy.disclaimer}
          </p>
        </div>
      </div>

      {/* 2. Primary International Risk Factors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          title="Brent Crude"
          value={`$${indicators.brent_crude.price_usd.toFixed(2)}`}
          change={indicators.brent_crude.change_1d_pct}
          changeUnit="%"
          subValue={indicators.brent_crude.unit}
          badge={<Badge variant="neutral" size="sm">{indicators.brent_crude.source}</Badge>}
        />

        <StatCard
          title="USD / INR"
          value={`₹${indicators.usd_inr.rate.toFixed(2)}`}
          change={indicators.usd_inr.change_1d_pct}
          changeUnit="%"
          subValue={indicators.usd_inr.unit}
          badge={<Badge variant="neutral" size="sm">{indicators.usd_inr.source}</Badge>}
        />

        <StatCard
          title="US 10Y Yield"
          value={`${indicators.us_10y_yield.yield_pct.toFixed(2)}%`}
          change={indicators.us_10y_yield.change_1d_bps}
          changeUnit=" bps"
          subValue="Yield"
          badge={<Badge variant="neutral" size="sm">{indicators.us_10y_yield.source}</Badge>}
        />

        <StatCard
          title="Dollar Index (DXY)"
          value={indicators.dxy_index.level.toFixed(2)}
          change={indicators.dxy_index.change_1d_pct}
          changeUnit="%"
          subValue="Points"
          badge={<Badge variant="neutral" size="sm">{indicators.dxy_index.source}</Badge>}
        />

        <StatCard
          title="GIFT NIFTY Spread"
          value={`${indicators.gift_nifty_proxy.implied_spread_points > 0 ? '+' : ''}${indicators.gift_nifty_proxy.implied_spread_points.toFixed(1)}`}
          change={indicators.gift_nifty_proxy.implied_spread_points}
          changeUnit=" pts"
          subValue="Opening Gap"
          badge={<Badge variant="info" size="sm">PRE-OPEN</Badge>}
        />
      </div>

      {/* 3. Global Equities Cross-Section */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            International Benchmark Performance
          </span>
          <span className="text-xs text-slate-500 font-mono">Cross-Market Cues</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {global_indices.map((idx) => {
            const isUp = idx.change_pct > 0;
            return (
              <div key={idx.name} className="p-3 rounded bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{idx.name}</span>
                  <Badge variant="neutral" size="sm">{idx.region}</Badge>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-base font-bold font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isUp ? `+${idx.change_pct.toFixed(2)}%` : `${idx.change_pct.toFixed(2)}%`}
                  </span>
                  <span className="text-[10px] text-slate-500">{idx.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
