import React from 'react';
import { MarketOverviewData, NiftyForecastData, MarketBreadthData } from '../../types/market';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { TrendingUp, ShieldAlert, CheckCircle2, AlertTriangle, Compass, Layers } from 'lucide-react';

interface Props {
  data: MarketOverviewData | null;
  forecast: NiftyForecastData | null;
  breadth?: MarketBreadthData | null;
}

export const MarketCommandCentre: React.FC<Props> = ({ data, forecast, breadth }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Market Command Centre...</div>;
  }

  const { headline_regime, indices, breadth_summary, institutional_summary, top_drivers_positive, top_risks_negative, overall_takeaway } = data;

  const isRiskOn = headline_regime.overall_tilt === 'RISK_ON';

  return (
    <div className="space-y-6">
      {/* 1. Executive Status Banner */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isRiskOn 
          ? 'bg-emerald-950/20 border-emerald-800/40' 
          : 'bg-amber-950/20 border-amber-800/40'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isRiskOn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Current Market Regime</span>
              <Badge variant={isRiskOn ? 'success' : 'warning'}>
                {headline_regime.overall_tilt}
              </Badge>
              <Badge variant="info" size="sm">
                VIX: {headline_regime.vix_level.toFixed(2)} ({headline_regime.volatility_regime})
              </Badge>
            </div>
            <p className="text-sm font-medium text-slate-200 mt-1">
              {overall_takeaway}
            </p>
          </div>
        </div>

        {forecast && (
          <div className="flex items-center gap-3 px-3 py-2 rounded bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">Next Session Outlook:</span>
            <Badge variant={forecast.directional_probability.bias === 'BULLISH' ? 'success' : 'danger'}>
              {forecast.directional_probability.bias}
            </Badge>
            <span className="font-mono text-slate-300">
              P(Up): {(forecast.directional_probability.p_up * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* 2. Headline Core Indices KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indices.map((idx) => (
          <StatCard
            key={idx.symbol}
            title={idx.symbol}
            value={idx.close}
            change={idx.change_pct}
            subValue={`${idx.change_pts > 0 ? '+' : ''}${idx.change_pts.toFixed(1)} pts`}
            trend={idx.trend as any}
            badge={<Badge variant={idx.trend === 'BULLISH' ? 'success' : 'neutral'} size="sm">{idx.name.split(' ')[0]}</Badge>}
          />
        ))}
      </div>

      {/* 3. Secondary Metrics: Breadth & Institutional Liquidity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Market Breadth Card */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" />
              NIFTY 50 Constituent Breadth
            </span>
            <Badge variant={breadth_summary.advance_percentage >= 50 ? 'success' : 'danger'} size="sm">
              {breadth_summary.advance_percentage.toFixed(1)}% Advancing
            </Badge>
          </div>

          {/* Advance/Decline Visual Bar */}
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex mb-2">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${breadth_summary.advance_percentage}%` }}
              title={`Advances: ${breadth_summary.advances}`}
            />
            <div
              className="bg-rose-500 transition-all duration-500"
              style={{ width: `${100 - breadth_summary.advance_percentage}%` }}
              title={`Declines: ${breadth_summary.declines}`}
            />
          </div>

          <div className="flex justify-between text-xs font-mono">
            <span className="text-emerald-400">{breadth_summary.advances} Advancing</span>
            <span className="text-slate-500">Coverage: {breadth_summary.coverage_percentage}%</span>
            <span className="text-rose-400">{breadth_summary.declines} Declining</span>
          </div>

          {breadth && (
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
              <span>DMA Breadth:</span>
              <span className="text-slate-200">{breadth.moving_averages.pct_above_20dma.toFixed(0)}% &gt; 20D</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200">{breadth.moving_averages.pct_above_50dma.toFixed(0)}% &gt; 50D</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-200">{breadth.moving_averages.pct_above_200dma.toFixed(0)}% &gt; 200D</span>
            </div>
          )}
        </div>

        {/* Institutional Positioning Card */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Institutional Positioning & Flows
            </span>
            <Badge variant={institutional_summary.fii_long_ratio_pct < 25 ? 'danger' : 'neutral'} size="sm">
              {institutional_summary.positioning_bias}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[11px]">FII Long Ratio</div>
              <div className="text-base font-bold font-mono mt-0.5 text-slate-100">
                {institutional_summary.fii_long_ratio_pct.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400">Index Futures</div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[11px]">FII Net Cash</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${institutional_summary.fii_net_cash_cr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{institutional_summary.fii_net_cash_cr > 0 ? '+' : ''}{institutional_summary.fii_net_cash_cr.toFixed(0)} Cr
              </div>
              <div className="text-[10px] text-slate-400">Cash Turnover</div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
              <div className="text-slate-400 text-[11px]">DII Net Cash</div>
              <div className={`text-base font-bold font-mono mt-0.5 ${institutional_summary.dii_net_cash_cr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{institutional_summary.dii_net_cash_cr > 0 ? '+' : ''}{institutional_summary.dii_net_cash_cr.toFixed(0)} Cr
              </div>
              <div className="text-[10px] text-slate-400">Domestic Inflows</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Top Drivers & Downside Risks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Drivers */}
        <div className="terminal-card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Top Positive Market Drivers
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {top_drivers_positive.map((driver, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Negative Risks */}
        <div className="terminal-card p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-medium text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            Top Systematic Risks & Catalysts
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {top_risks_negative.map((risk, i) => (
              <li key={i} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
