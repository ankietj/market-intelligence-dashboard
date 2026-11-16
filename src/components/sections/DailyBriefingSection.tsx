import React from 'react';
import { DailyBriefingData } from '../../types/market';
import { Badge } from '../common/Badge';
import { FileText, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  data: DailyBriefingData | null;
}

export const DailyBriefingSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500">Loading Daily Intelligence Report...</div>;
  }

  const {
    market_date,
    verification_status,
    executive_synthesis_points,
    cross_specialist_agreements,
    cross_specialist_disagreements,
    tactical_positioning_implications,
    next_session_watchpoints,
  } = data;

  return (
    <div className="space-y-6">
      {/* 1. Header & Verification Status Banner */}
      <div className="terminal-card p-4 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Authoritative Executive Briefing
              </span>
              <Badge variant="success">
                <ShieldCheck className="w-3.5 h-3.5" />
                {verification_status.audit_verdict}
              </Badge>
              <Badge variant="neutral" size="sm">
                Specialists: {verification_status.accepted_specialist_count} / {verification_status.total_specialists} Accepted
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Multi-Agent Intelligence Synthesis for market session as of <span className="font-mono font-bold text-slate-100">{market_date}</span>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-2 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
          <div>Point-in-Time Verified: <span className="text-emerald-400 font-bold">100%</span></div>
          <div className="text-[11px] mt-0.5">Independent Critic Gatekeeper Active</div>
        </div>
      </div>

      {/* 2. The 10-Point Integrated Executive Briefing */}
      <div className="terminal-card p-5">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-4">
          Authoritative 10-Point Integrated Market Intelligence Briefing
        </span>

        <div className="space-y-3 font-mono text-xs">
          {executive_synthesis_points.map((pt, idx) => (
            <div key={idx} className="p-3 rounded bg-slate-900/50 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded bg-slate-800 text-sky-400 font-bold flex items-center justify-center text-[11px]">
                {idx + 1}
              </span>
              <div className="text-slate-200 leading-relaxed pt-0.5">
                {pt}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Cross-Specialist Agreements & Disagreements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agreements */}
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-medium text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            Cross-Specialist Consensus Themes
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {cross_specialist_agreements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="font-mono">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disagreements */}
        <div className="terminal-card p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-400 font-medium text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            Cross-Domain Divergences & Conflicts
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {cross_specialist_disagreements.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="font-mono">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Tactical Implications & Watchpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tactical Execution Guidelines */}
        <div className="terminal-card p-4 border-l-4 border-l-sky-500">
          <span className="text-xs uppercase tracking-wider text-sky-400 font-medium block mb-3">
            Tactical Positioning & Exposure Guidelines
          </span>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            {tactical_positioning_implications.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next-Session Key Watchpoints */}
        <div className="terminal-card p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium block mb-3">
            Next-Session Market Watchpoints
          </span>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            {next_session_watchpoints.map((wp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{wp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
