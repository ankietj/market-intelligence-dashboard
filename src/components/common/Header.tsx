import React from 'react';
import { ShieldCheck, Calendar, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Badge } from './Badge';

interface HeaderProps {
  marketDate: string;
  targetSessionDate: string;
  generatedAt: string;
  snapshotId: string;
  sourceFreshness?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  marketDate,
  targetSessionDate,
  generatedAt,
  snapshotId,
  sourceFreshness,
  onRefresh,
  isRefreshing,
}) => {
  const formattedTime = generatedAt ? new Date(generatedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  }) + ' IST' : '—';

  return (
    <header className="border-b border-slate-800 bg-[#0d121f]/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Branding & Core Market Dates */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold text-lg shadow-sm">
            MI
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base lg:text-lg font-bold tracking-tight text-slate-100 font-mono">
                MARKET INTELLIGENCE TERMINAL
              </h1>
              <Badge variant="info" size="sm">NIFTY 50</Badge>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Public Research & Institutional Positioning</span>
              <span>•</span>
              <span className="text-slate-400 font-mono text-[11px]">Snapshot: {snapshotId}</span>
            </p>
          </div>
        </div>

        {/* Right: Operational Badges & Timestamps */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">Market:</span>
            <span className="font-mono font-medium text-slate-200">{marketDate}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Target Session:</span>
            <span className="font-mono font-medium text-emerald-400">{targetSessionDate}</span>
          </div>

          <Badge variant="success" size="sm">
            <ShieldCheck className="w-3 h-3" />
            CRITIC VERIFIED
          </Badge>

          {sourceFreshness && (
            <Badge variant={sourceFreshness === 'CURRENT' ? 'success' : 'warning'} size="sm">
              DATA: {sourceFreshness}
            </Badge>
          )}

          <Badge variant="neutral" size="sm">
            MANUAL PUBLISH
          </Badge>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
              title="Reload published snapshot"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          )}

          <a
            href="https://github.com/ankietj/market-intelligence-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-sky-400 text-xs transition-colors ml-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
        <span>Published At: {formattedTime}</span>
        <span className="hidden sm:inline">Static JSON Data • Zero Runtime Backend • Point-in-Time Verified</span>
      </div>
    </header>
  );
};
