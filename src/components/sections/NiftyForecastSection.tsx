import React, { useState } from 'react';
import { NiftyForecastData, PreOpenData } from '../../types/market';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Compass, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  forecast: NiftyForecastData | null;
  preOpen: PreOpenData | null;
}

export const NiftyForecastSection: React.FC<Props> = ({ forecast, preOpen }) => {
  const [activeTab, setActiveTab] = useState<'PRE_OPEN' | 'POST_CLOSE'>('PRE_OPEN');

  if (!forecast && !preOpen) {
    return <div className="p-8 text-center text-slate-500">Loading NIFTY Forecast & Pre-Open Intelligence...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('PRE_OPEN')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'PRE_OPEN'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pre-Open Forecast (08:30 IST)</span>
          <Badge variant="info" size="sm">Version 2</Badge>
        </button>

        <button
          onClick={() => setActiveTab('POST_CLOSE')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'POST_CLOSE'
              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Post-Close Baseline Forecast</span>
          <Badge variant="neutral" size="sm">Version 1</Badge>
        </button>
      </div>

      {activeTab === 'PRE_OPEN' && preOpen && (
        <div className="space-y-6">
          {/* Pre-Open Opening Projection Header */}
          <div className="terminal-card p-4 bg-slate-900/60 border-l-4 border-l-sky-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Target Session Open</span>
                <Badge variant={preOpen.gap_classification === 'GAP_UP' ? 'success' : preOpen.gap_classification === 'GAP_DOWN' ? 'danger' : 'neutral'}>
                  {preOpen.gap_classification} ({preOpen.overnight_gap_points > 0 ? '+' : ''}{preOpen.overnight_gap_points.toFixed(1)} pts)
                </Badge>
                <Badge variant="neutral" size="sm">Headwind: {preOpen.macro_headwind_level}</Badge>
              </div>
              <div className="flex items-baseline gap-3 mt-1.5">
                <span className="text-3xl font-bold font-mono text-slate-100">
                  ~{preOpen.expected_open.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Auction Bracket: <span className="text-sky-400 font-bold">{preOpen.auction_bracket_low.toLocaleString()} — {preOpen.auction_bracket_high.toLocaleString()}</span>
                </span>
              </div>
            </div>

            <div className="text-xs font-mono px-3 py-2 rounded bg-slate-950/80 border border-slate-800">
              <div className="text-slate-400">Session Master Pivot:</div>
              <div className="text-lg font-bold text-slate-100 mt-0.5">{preOpen.key_inflection_level.toLocaleString()}</div>
            </div>
          </div>

          {/* Actionable Auction Execution Rules */}
          <div className="terminal-card p-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-3">
              Pre-Market Auction Action Rules (09:00 - 09:30 IST)
            </span>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {preOpen.auction_action_rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <span className="font-mono leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'POST_CLOSE' && forecast && (
        <div className="space-y-6">
          {/* Post-Close KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Directional Outlook"
              value={forecast.directional_probability.bias}
              subValue={`Rule Score: ${(forecast.directional_probability.rule_score * 100).toFixed(0)}%`}
              trend={forecast.directional_probability.bias as any}
              badge={<Badge variant="info" size="sm">POST-CLOSE</Badge>}
            />

            <StatCard
              title="Expected Range"
              value={`±${forecast.expected_range.range_points.toFixed(0)} pts`}
              subValue={`${forecast.expected_range.low.toLocaleString()} — ${forecast.expected_range.high.toLocaleString()}`}
              description={`14-Day ATR: ${forecast.expected_range.atr_14.toFixed(1)}`}
              badge={<Badge variant="neutral" size="sm">1-SIGMA</Badge>}
            />

            <StatCard
              title="Bullish Target (R1)"
              value={forecast.technical_levels.classic_pivots.r1.toLocaleString()}
              description={`Upper: ${forecast.technical_levels.classic_pivots.r2.toLocaleString()}`}
              trend="UP"
              badge={<Badge variant="success" size="sm">R1</Badge>}
            />

            <StatCard
              title="Bearish Target (S1)"
              value={forecast.technical_levels.classic_pivots.s1.toLocaleString()}
              description={`Invalidation: ${forecast.scenarios.invalidation_level.toLocaleString()}`}
              trend="DOWN"
              badge={<Badge variant="danger" size="sm">S1</Badge>}
            />
          </div>

          {/* Probabilities and Pivot Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Probability Calibration */}
            <div className="terminal-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-3">
                Calibrated Directional Probability Distribution
              </span>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400">P(Up &gt; +0.15%):</span>
                    <span className="font-bold text-emerald-400">{(forecast.directional_probability.p_up * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${forecast.directional_probability.p_up * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">P(Sideways [-0.15%, +0.15%]):</span>
                    <span className="font-bold text-slate-200">{(forecast.directional_probability.p_sideways * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full" style={{ width: `${forecast.directional_probability.p_sideways * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-rose-400">P(Down &lt; -0.15%):</span>
                    <span className="font-bold text-rose-400">{(forecast.directional_probability.p_down * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${forecast.directional_probability.p_down * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Pivot Matrix */}
            <div className="terminal-card p-4">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-3">
                Classic Floor Trader Pivots
              </span>

              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-rose-400">S2</div>
                  <div className="font-bold mt-1 text-slate-200">{forecast.technical_levels.classic_pivots.s2.toFixed(0)}</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-rose-300">S1</div>
                  <div className="font-bold mt-1 text-slate-200">{forecast.technical_levels.classic_pivots.s1.toFixed(0)}</div>
                </div>
                <div className="p-2 rounded bg-sky-950/40 border border-sky-800/40">
                  <div className="text-[10px] text-sky-400 font-bold">PIVOT</div>
                  <div className="font-bold mt-1 text-sky-300">{forecast.technical_levels.classic_pivots.pivot.toFixed(0)}</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-emerald-300">R1</div>
                  <div className="font-bold mt-1 text-slate-200">{forecast.technical_levels.classic_pivots.r1.toFixed(0)}</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-emerald-400">R2</div>
                  <div className="font-bold mt-1 text-slate-200">{forecast.technical_levels.classic_pivots.r2.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
