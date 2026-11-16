import React from 'react';
import { SectorRotationData, StockLeadershipData } from '../../types/market';
import { Badge } from '../common/Badge';
import { PieChart, Flame, TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  sectorData: SectorRotationData | null;
  stockData: StockLeadershipData | null;
}

export const SectorRotationSection: React.FC<Props> = ({ sectorData, stockData }) => {
  if (!sectorData || !stockData) {
    return <div className="p-8 text-center text-slate-500">Loading Sector & Stock Leadership...</div>;
  }

  const { spread_cyclical_defensive, leading_sector, sectors, rotation_takeaway } = sectorData;
  const { top_gainers, top_losers, volume_breakouts } = stockData;

  const isCyclicalDominant = spread_cyclical_defensive > 0;

  return (
    <div className="space-y-6">
      {/* 1. Sector Rotation Overview Card */}
      <div className="terminal-card p-4 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Sector Leadership</span>
              <Badge variant="success">Primary: {leading_sector}</Badge>
              <Badge variant={isCyclicalDominant ? 'info' : 'warning'} size="sm">
                Cyclical Spread: {spread_cyclical_defensive > 0 ? '+' : ''}{spread_cyclical_defensive.toFixed(2)}%
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {rotation_takeaway}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full Sector Ranking Table */}
      <div className="terminal-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Tracked Sector Indices Performance & Relative Strength
          </span>
          <span className="text-xs text-slate-500 font-mono">Ranked by Relative Strength (RS)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2">Sector Name</th>
                <th className="pb-2 text-center">Classification</th>
                <th className="pb-2 text-right">1-Day Change</th>
                <th className="pb-2 text-right">RS Score vs NIFTY</th>
                <th className="pb-2 text-center">Momentum Quadrant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sectors.map((sec) => {
                const isPositive = sec.change_pct > 0;
                const momentumVariant = 
                  sec.momentum === 'LEADING' ? 'success' :
                  sec.momentum === 'IMPROVING' ? 'info' :
                  sec.momentum === 'WEAKENING' ? 'warning' : 'danger';

                return (
                  <tr key={sec.name} className="hover:bg-slate-900/40">
                    <td className="py-2.5 font-medium text-slate-200">{sec.name}</td>
                    <td className="py-2.5 text-center">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {sec.type}
                      </span>
                    </td>
                    <td className={`py-2.5 text-right font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? `+${sec.change_pct.toFixed(2)}%` : `${sec.change_pct.toFixed(2)}%`}
                    </td>
                    <td className={`py-2.5 text-right ${sec.rs_vs_nifty >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sec.rs_vs_nifty > 0 ? `+${sec.rs_vs_nifty.toFixed(2)}` : sec.rs_vs_nifty.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-center">
                      <Badge variant={momentumVariant} size="sm">
                        {sec.momentum}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Stock Leadership: Gainers, Losers, & Volume Surges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Gainers */}
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Top Constituent Gainers
          </div>
          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {top_gainers.map((stock) => (
              <div key={stock.symbol} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">{stock.symbol}</span>
                  <span className="text-slate-500 ml-2 text-[11px]">{stock.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold">+{stock.change_pct.toFixed(2)}%</span>
                  <span className="text-slate-400 ml-2 text-[11px]">₹{stock.close.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-medium text-xs uppercase tracking-wider">
            <TrendingDown className="w-4 h-4" />
            Lagging Constituents (Laggards)
          </div>
          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {top_losers.map((stock) => (
              <div key={stock.symbol} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">{stock.symbol}</span>
                  <span className="text-slate-500 ml-2 text-[11px]">{stock.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-bold">{stock.change_pct.toFixed(2)}%</span>
                  <span className="text-slate-400 ml-2 text-[11px]">₹{stock.close.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volume Surges */}
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-400 font-medium text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            Volume Surges (vs 20D Avg)
          </div>
          <div className="divide-y divide-slate-800/60 font-mono text-xs">
            {volume_breakouts.map((stock) => (
              <div key={stock.symbol} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200">{stock.symbol}</span>
                  <span className="text-amber-400/90 ml-2 text-[11px]">{stock.relative_volume.toFixed(1)}x Vol</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-300 font-bold">₹{stock.breakout_level.toLocaleString()}</span>
                  <Badge variant={stock.status === 'CONFIRMED' ? 'success' : 'neutral'} size="sm" className="ml-2">
                    {stock.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
