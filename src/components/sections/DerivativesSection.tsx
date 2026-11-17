import React from 'react';
import { DerivativesData, StrikeItem } from '../../types/market';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { Target, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  data: DerivativesData | null;
}

export const DerivativesSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Derivatives & Options Intelligence...</div>;
  }

  const {
    underlying_price = 0,
    atm_strike = 0,
    pcr_oi = 0,
    pcr_volume = 0,
    max_pain_strike = 0,
    call_wall = { strike: 0, open_interest: 0, distance_pts: 0, distance_pct: 0, role: '' },
    put_wall = { strike: 0, open_interest: 0, distance_pts: 0, distance_pct: 0, role: '' },
    atm_straddle = { iv_pct: 0, premium_pts: 0, implied_upper_breakeven: 0, implied_lower_breakeven: 0 },
    order_flow_imbalance = { net_ce_oi_change: 0, net_pe_oi_change: 0, bias: 'NEUTRAL' },
  } = data;

  const strikeList: StrikeItem[] = data.strike_table || data.strike_distribution || [];

  const pcrVariant = pcr_oi > 1.2 ? 'success' : pcr_oi < 0.75 ? 'danger' : 'warning';

  return (
    <div className="space-y-6">
      {/* 0. Section Date Used & Publication Metadata Banner */}
      <div className="terminal-card p-3.5 bg-slate-900/60 border-sky-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <span className="text-slate-400">Date Used (Market As-Of):</span>
          <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            {data.market_date || '—'}
          </span>
          <span className="text-slate-500 text-[11px]">(NSE Calibrated Volatility Surface)</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Published:</span>
          <span className="font-mono text-slate-200">
            {data.published_at || data.generated_at || '—'}
          </span>
          <span className="ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            CURRENT
          </span>
        </div>
      </div>

      {/* 1. Primary Derivatives KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Put-Call Ratio (OI)"
          value={pcr_oi.toFixed(2)}
          subValue={`Vol PCR: ${pcr_volume.toFixed(2)}`}
          trend={pcr_oi > 1.0 ? 'BULLISH' : 'BEARISH'}
          badge={<Badge variant={pcrVariant} size="sm">PCR</Badge>}
        />

        <StatCard
          title="Option Max Pain"
          value={max_pain_strike.toLocaleString()}
          subValue={`Spot: ${underlying_price.toLocaleString()}`}
          description={`Distance: ${(underlying_price - max_pain_strike > 0 ? '+' : '')}${(underlying_price - max_pain_strike).toFixed(1)} pts`}
          badge={<Badge variant="neutral" size="sm">PINNING</Badge>}
        />

        <StatCard
          title="Call Wall (Resistance)"
          value={call_wall.strike.toLocaleString()}
          subValue={`${call_wall.open_interest.toLocaleString()} OI`}
          change={call_wall.distance_pct}
          changeUnit="%"
          description={`+${call_wall.distance_pts.toFixed(1)} pts from spot`}
          trend="BEARISH"
          badge={<Badge variant="danger" size="sm">RESISTANCE</Badge>}
        />

        <StatCard
          title="Put Wall (Support)"
          value={put_wall.strike.toLocaleString()}
          subValue={`${put_wall.open_interest.toLocaleString()} OI`}
          change={-put_wall.distance_pct}
          changeUnit="%"
          description={`-${put_wall.distance_pts.toFixed(1)} pts from spot`}
          trend="BULLISH"
          badge={<Badge variant="success" size="sm">SUPPORT</Badge>}
        />
      </div>

      {/* 2. ATM Straddle & Expected Corridor Banner */}
      <div className="terminal-card p-4 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">ATM Straddle Pricing</span>
              <Badge variant="info">ATM Strike: {atm_strike.toLocaleString()}</Badge>
              <Badge variant="neutral" size="sm">ATM IV: {atm_straddle.iv_pct.toFixed(1)}%</Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Combined straddle premium of <span className="font-mono font-bold text-sky-400">±{atm_straddle.premium_pts.toFixed(1)} pts</span> projects an implied expiry corridor between <span className="font-mono text-emerald-400 font-bold">{atm_straddle.implied_lower_breakeven.toLocaleString()}</span> and <span className="font-mono text-rose-400 font-bold">{atm_straddle.implied_upper_breakeven.toLocaleString()}</span>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-2 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
          <div>Order-Flow Bias: <span className="text-slate-200 font-bold">{order_flow_imbalance.bias}</span></div>
          <div className="text-[11px] mt-0.5">Net CE Chg: {order_flow_imbalance.net_ce_oi_change.toLocaleString()} | Net PE Chg: {order_flow_imbalance.net_pe_oi_change.toLocaleString()}</div>
        </div>
      </div>

      {/* 3. Strike-Level Open Interest Distribution Table */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Open Interest Concentration & Strike Distribution
          </span>
          <span className="text-xs text-slate-500 font-mono">Spot: {underlying_price.toLocaleString()}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2 text-right">Call OI</th>
                <th className="pb-2 text-right">Call Chg</th>
                <th className="pb-2 text-right">Call LTP</th>
                <th className="pb-2 text-center font-bold text-slate-200">Strike Price</th>
                <th className="pb-2 text-left">Put LTP</th>
                <th className="pb-2 text-left">Put Chg</th>
                <th className="pb-2 text-left">Put OI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {strikeList.map((row) => {
                const isATM = row.strike === atm_strike;
                const isCallWall = row.strike === call_wall.strike;
                const isPutWall = row.strike === put_wall.strike;

                return (
                  <tr
                    key={row.strike}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      isATM ? 'bg-sky-950/20 font-bold' : ''
                    }`}
                  >
                    <td className={`py-2 text-right ${isCallWall ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                      {row.ce_oi.toLocaleString()}
                      {isCallWall && <span className="ml-1 text-[10px] text-rose-500">WALL</span>}
                    </td>
                    <td className={`py-2 text-right ${row.ce_change_oi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.ce_change_oi > 0 ? '+' : ''}{row.ce_change_oi.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-slate-400">
                      ₹{row.ce_ltp.toFixed(1)}
                    </td>
                    <td className="py-2 text-center font-bold text-slate-100">
                      <span className={`px-2 py-0.5 rounded ${isATM ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : ''}`}>
                        {row.strike.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2 text-left text-slate-400">
                      ₹{row.pe_ltp.toFixed(1)}
                    </td>
                    <td className={`py-2 text-left ${row.pe_change_oi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.pe_change_oi > 0 ? '+' : ''}{row.pe_change_oi.toLocaleString()}
                    </td>
                    <td className={`py-2 text-left ${isPutWall ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                      {row.pe_oi.toLocaleString()}
                      {isPutWall && <span className="ml-1 text-[10px] text-emerald-500">WALL</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
