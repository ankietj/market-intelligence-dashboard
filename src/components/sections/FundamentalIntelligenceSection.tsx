import React, { useState } from 'react';
import { FundamentalIntelligenceData, FundamentalCandidateItem } from '../../types/market';
import { Badge } from '../common/Badge';
import { 
  Building2, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight,
  Scale,
  Lock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  data: FundamentalIntelligenceData | null;
}

export const FundamentalIntelligenceSection: React.FC<Props> = ({ data }) => {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        Loading Strategy-Triggered Fundamental Intelligence...
      </div>
    );
  }

  const {
    market_date,
    strategy_name,
    is_investable,
    summary,
    candidates,
    authenticity_tier_status,
    provenance_statement,
  } = data;

  const selectedCandidate: FundamentalCandidateItem | undefined = selectedTicker
    ? candidates.find((c) => c.ticker === selectedTicker)
    : candidates[0];

  const getAlignmentBadge = (alignment: string) => {
    switch (alignment) {
      case 'ALIGNED':
        return <Badge variant="success">ALIGNED</Badge>;
      case 'CONFLICTED':
        return <Badge variant="warning">CONFLICTED</Badge>;
      case 'FUNDAMENTAL_CAUTION':
        return <Badge variant="warning">CAUTION</Badge>;
      case 'FUNDAMENTAL_VETO':
        return <Badge variant="danger">VETOED</Badge>;
      case 'INSUFFICIENT_DATA':
      default:
        return <Badge variant="neutral">INSUFFICIENT DATA</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return <Badge variant="success">COMPLETE</Badge>;
      case 'PARTIAL':
        return <Badge variant="info">PARTIAL</Badge>;
      case 'INSUFFICIENT_DATA':
        return <Badge variant="neutral">INSUFFICIENT</Badge>;
      case 'QUARANTINED':
        return <Badge variant="warning">QUARANTINED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="terminal-card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">
                  Strategy-Triggered Fundamental Intelligence
                </h2>
                <Badge variant="info" size="sm">{strategy_name}</Badge>
                <Badge variant="danger" size="sm">
                  <Lock className="w-3 h-3 mr-1 inline" />
                  is_investable = {String(is_investable).toLowerCase()}
                </Badge>
                <Badge variant="neutral" size="sm">Session: {market_date}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Automated 7-agent fundamental evaluation of candidates identified by Volume Breakout strategy.
                Evaluates business quality, earnings quality, financial health, governance, and valuation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-slate-500 mr-1.5">Candidates Assessed:</span>
              <span className="font-bold text-sky-400">{summary.total_candidates}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[11px] font-medium text-slate-400">Total Candidates</div>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">{summary.total_candidates}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Volume Breakout triggers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[11px] font-medium text-emerald-400">Signals Aligned</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{summary.aligned_count}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Technical + Fundamental agree</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[11px] font-medium text-amber-400">Fundamental Caution</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">{summary.caution_count}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Valuation/quality friction</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="text-[11px] font-medium text-rose-400">Governance Vetoes</div>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">{summary.veto_count}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Disqualifying forensic flags</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-[11px] font-medium text-slate-400">Statement Coverage</div>
          <div className="text-xl font-bold font-mono text-sky-400 mt-1">
            {summary.insufficient_data_count} <span className="text-xs font-normal text-slate-500">Quarantined</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Authenticity gate enforced</div>
        </div>
      </div>

      {/* 3. Candidate Grid & Drilldown View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Breakout Candidate Queue</span>
            <span className="text-[11px] text-slate-500 font-normal">Click candidate to inspect</span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {candidates.map((c) => {
              const isSelected = selectedCandidate?.ticker === c.ticker;
              return (
                <div
                  key={c.ticker}
                  onClick={() => setSelectedTicker(c.ticker)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-sky-500/60 shadow-lg shadow-sky-500/5'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-100">{c.ticker}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                        {c.canonical_sector}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getAlignmentBadge(c.signal_alignment)}
                      <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? 'rotate-90 text-sky-400' : ''}`} />
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[9px]">Rel Volume</span>
                      <span className="text-emerald-400 font-semibold">{c.technical.relative_volume?.toFixed(2)}x</span>
                    </div>
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[9px]">Breakout Str</span>
                      <span className="text-slate-200">+{c.technical.breakout_strength?.toFixed(2)}%</span>
                    </div>
                    <div className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                      <span className="text-slate-500 block text-[9px]">Promoter %</span>
                      <span className="text-sky-300 font-semibold">
                        {c.fundamental?.governance?.promoter_holding_pct != null 
                          ? `${c.fundamental.governance.promoter_holding_pct.toFixed(1)}%` 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Candidate Detail Pane (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCandidate ? (
            <div className="terminal-card p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-5">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-lg font-bold font-mono text-slate-100">{selectedCandidate.ticker}</h3>
                    <span className="text-xs text-slate-400">({selectedCandidate.company_name})</span>
                    {getStatusBadge(selectedCandidate.fundamental_status)}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Sector: <span className="text-slate-200 font-medium capitalize">{selectedCandidate.canonical_sector}</span>
                    {selectedCandidate.isin && ` • ISIN: ${selectedCandidate.isin}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`http://localhost:5174/?ticker=${selectedCandidate.ticker}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                    title="Open Standalone Valuation Terminal for this company"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Deep-Dive Valuation ↗</span>
                  </a>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Signal Alignment</span>
                    {getAlignmentBadge(selectedCandidate.signal_alignment)}
                  </div>
                </div>
              </div>

              {/* Technical Context Summary */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Strategy Signal & Technical Setup
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Close at Signal</span>
                    <span className="text-slate-100 font-bold">₹{selectedCandidate.technical.price_at_signal?.toLocaleString('en-IN') ?? 'N/A'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Relative Volume</span>
                    <span className="text-emerald-400 font-bold">{selectedCandidate.technical.relative_volume?.toFixed(2)}x</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Breakout Strength</span>
                    <span className="text-slate-200 font-bold">+{selectedCandidate.technical.breakout_strength?.toFixed(2)}%</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Strategy Rank</span>
                    <span className="text-sky-400 font-bold">#{selectedCandidate.technical.strategy_rank ?? 1}</span>
                  </div>
                </div>
              </div>

              {/* Governance & Ownership (Verified Exchange Disclosures) */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-sky-400" />
                  Governance & Ownership Disclosures (Verified Authentic)
                </h4>
                <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Promoter Holding</span>
                      <span className="text-slate-200 font-bold text-sm">
                        {selectedCandidate.fundamental?.governance?.promoter_holding_pct != null
                          ? `${selectedCandidate.fundamental.governance.promoter_holding_pct.toFixed(2)}%`
                          : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Promoter Pledge</span>
                      <span className="text-slate-200 font-bold text-sm">
                        {selectedCandidate.fundamental?.governance?.promoter_pledge_pct != null
                          ? `${selectedCandidate.fundamental.governance.promoter_pledge_pct.toFixed(2)}%`
                          : '0.00% / None reported'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Governance Veto</span>
                      <span className={selectedCandidate.governance_veto ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {selectedCandidate.governance_veto ? 'TRIGGERED (VETO)' : 'CLEAR (NO VETO)'}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    Source: <span className="text-slate-300">NSE Shareholding Pattern Disclosures</span> • Strict PIT publication verified
                  </div>
                </div>
              </div>

              {/* 7-Agent Synthesis & Thesis Rationales */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Multi-Agent Thesis Analysis & Critic Gate
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase block mb-1">
                      Thesis Support from Fundamentals
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {selectedCandidate.thesis_support || 'Fundamental financial data insufficient for thesis support.'}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase block mb-1">
                      Thesis Invalidation Risks
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {selectedCandidate.thesis_risks || 'Standard swing breakout risks apply. Monitor volume confirmation and stop level.'}
                    </p>
                  </div>

                  {selectedCandidate.fundamental?.evidence?.known_limitations && selectedCandidate.fundamental.evidence.known_limitations.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px]">
                      <span className="font-semibold text-amber-300 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        Data Provenance & Quarantine Constraints:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                        {selectedCandidate.fundamental.evidence.known_limitations.map((lim, idx) => (
                          <li key={idx}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono">Select a candidate to view assessment details.</div>
          )}
        </div>
      </div>

      {/* 4. Methodology & Authenticity Governance Footer */}
      <div className="terminal-card p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <FileSpreadsheet className="w-4 h-4 text-sky-400" />
          Data Provenance and Regulatory Compliance
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          {provenance_statement}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[10px]">
          <div className="text-slate-400">
            <span className="text-slate-500">Tier 2 Exchange Data:</span> {authenticity_tier_status.tier_2_verified_exchange}
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500">Quarantined Statements:</span> {authenticity_tier_status.quarantined_datasets.join(', ')}
          </div>
          <div className="text-slate-400">
            <span className="text-slate-500">Governance Integrity:</span> {authenticity_tier_status.governance_verification}
          </div>
        </div>
      </div>
    </div>
  );
};
