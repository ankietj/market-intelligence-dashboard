import React from 'react';
import { InstitutionalFlowsData } from '../../types/market';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Zap, ArrowRightLeft } from 'lucide-react';

interface Props {
  data: InstitutionalFlowsData | null;
}

export const InstitutionalFlowsSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Institutional Intelligence...</div>;
  }

  const { cash_market, derivatives_positioning, contrarian_short_squeeze_alert, recent_flow_history } = data;

  return (
    <div className="space-y-6">
      {/* 1. Squeeze Alert Banner if Active */}
      {contrarian_short_squeeze_alert.active && (
        <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800/60 flex items-start gap-3">
          <div className="p-2 rounded bg-rose-500/20 text-rose-400 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-rose-300">
                CONTRARIAN SHORT-SQUEEZE ALERT TRIGGERED
              </span>
              <Badge variant="danger" size="sm">FII Longs: {contrarian_short_squeeze_alert.current_fii_long_pct}%</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {contrarian_short_squeeze_alert.implication} FIIs hold over 75% short positions in Index Futures. Any sustained gap-up or high-volume session breakout threatens aggressive stop-loss triggering.
            </p>
          </div>
        </div>
      )}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="FII Net Cash"
          value={`₹${cash_market.fii_net_cr > 0 ? '+' : ''}${cash_market.fii_net_cr.toFixed(1)} Cr`}
          subValue="Net Turnover"
          trend={cash_market.fii_net_cr >= 0 ? 'BULLISH' : 'BEARISH'}
          badge={<Badge variant={cash_market.fii_net_cr >= 0 ? 'success' : 'danger'} size="sm">FII</Badge>}
        />

        <StatCard
          title="DII Net Cash"
          value={`₹${cash_market.dii_net_cr > 0 ? '+' : ''}${cash_market.dii_net_cr.toFixed(1)} Cr`}
          subValue="Net Domestic"
          trend={cash_market.dii_net_cr >= 0 ? 'BULLISH' : 'BEARISH'}
          badge={<Badge variant={cash_market.dii_net_cr >= 0 ? 'success' : 'danger'} size="sm">DII</Badge>}
        />

        <StatCard
          title="FII Futures Long Ratio"
          value={`${derivatives_positioning.fii_long_pct.toFixed(1)}%`}
          subValue={`${derivatives_positioning.fii_index_fut_long.toLocaleString()} Longs`}
          trend={derivatives_positioning.fii_long_pct > 50 ? 'BULLISH' : 'BEARISH'}
          badge={<Badge variant={derivatives_positioning.fii_long_pct < 25 ? 'danger' : 'neutral'} size="sm">INDEX FUT</Badge>}
        />

        <StatCard
          title="Retail / Client Long Ratio"
          value={`${derivatives_positioning.client_long_pct.toFixed(1)}%`}
          subValue={`${derivatives_positioning.client_index_fut_long.toLocaleString()} Longs`}
          badge={<Badge variant="neutral" size="sm">CLIENT</Badge>}
        />
      </div>

      {/* 3. Positioning Skew Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FII vs Client Divergence Card */}
        <div className="terminal-card p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-sky-400" />
              Participant Index Futures Positioning
            </span>
            <Badge variant="neutral" size="sm">{derivatives_positioning.positioning_bias}</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">FII (Foreign Portfolio Investors)</span>
                <span className="text-rose-400 font-bold">{derivatives_positioning.fii_long_pct}% Long ({derivatives_positioning.fii_index_fut_short.toLocaleString()} Short)</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-sky-500" style={{ width: `${derivatives_positioning.fii_long_pct}%` }} />
                <div className="bg-rose-500" style={{ width: `${100 - derivatives_positioning.fii_long_pct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-300">Retail / High Net Worth Clients</span>
                <span className="text-emerald-400 font-bold">{derivatives_positioning.client_long_pct}% Long</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500" style={{ width: `${derivatives_positioning.client_long_pct}%` }} />
                <div className="bg-slate-700" style={{ width: `${100 - derivatives_positioning.client_long_pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5-Session Flow History Table */}
        <div className="terminal-card p-4">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-3">
            Recent Institutional Cash Flow History (INR Cr)
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">FII Cash</th>
                  <th className="pb-2 text-right">DII Cash</th>
                  <th className="pb-2 text-right">Net Liquidity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recent_flow_history.map((row) => {
                  const net = row.fii_cash + row.dii_cash;
                  return (
                    <tr key={row.date} className="hover:bg-slate-900/40">
                      <td className="py-2 text-slate-300">{row.date}</td>
                      <td className={`py-2 text-right ${row.fii_cash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.fii_cash > 0 ? '+' : ''}{row.fii_cash.toFixed(1)}
                      </td>
                      <td className={`py-2 text-right ${row.dii_cash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.dii_cash > 0 ? '+' : ''}{row.dii_cash.toFixed(1)}
                      </td>
                      <td className={`py-2 text-right font-bold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {net > 0 ? '+' : ''}{net.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
