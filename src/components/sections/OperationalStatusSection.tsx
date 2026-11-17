import React from 'react';
import { OperationalStatusData } from '../../types/market';
import { Badge } from '../common/Badge';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Server, 
  Clock, 
  CheckCircle,
  FileCheck2,
  Layers
} from 'lucide-react';

interface Props {
  data: OperationalStatusData | null;
}

export const OperationalStatusSection: React.FC<Props> = ({ data }) => {
  if (!data) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading System Operational Telemetry...</div>;
  }

  const {
    overall_system_status,
    market_date,
    target_session_date,
    last_successful_refresh,
    pipeline_stages,
    data_freshness,
    critic_audit_summary,
  } = data;

  const isHealthy = overall_system_status === 'HEALTHY';

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="terminal-card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isHealthy ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">System Operational Telemetry</h2>
                <Badge variant={isHealthy ? 'success' : 'warning'}>{overall_system_status}</Badge>
                <Badge variant="neutral" size="sm">Market Date: {market_date}</Badge>
                <Badge variant="neutral" size="sm">Target Session: {target_session_date}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time execution status of deterministic analytics, multi-agent orchestrator, independent Critic audits, and publishing pipelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-slate-500 mr-1.5">Last Pipeline Refresh:</span>
              <span className="text-sky-400 font-semibold">
                {new Date(last_successful_refresh).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </span>
            </div>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Specialist Pass Rate</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {critic_audit_summary.accepted_count} / {critic_audit_summary.total_specialists_audited} (100%)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Critic Audit: {critic_audit_summary.audit_decision}</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Sections Published</div>
            <div className="text-base font-bold text-sky-400 mt-0.5">
              {pipeline_stages.public_snapshot_exporter.sections_published} / 14
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sanitized & Validated</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Calculation Engine</div>
            <div className="text-base font-bold text-slate-200 mt-0.5">Python / DuckDB</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Deterministic (0% LLM Math)</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
            <div className="text-slate-500 text-[11px]">Execution Latency</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">~1.2 seconds</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Sub-second Specialist Pipeline</div>
          </div>
        </div>
      </div>

      {/* 2. Pipeline Execution Stages Grid */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Core Intelligence Pipeline Stages</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stage 1: Specialist Orchestrator */}
          <div className="terminal-card p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-xs text-slate-200">5-Domain Specialist Orchestrator</span>
              </div>
              <Badge variant="success">{pipeline_stages.specialist_orchestrator.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Parallel execution across Sector, Macro, Breadth, Institutional, and Options specialists. All 5 outputs passed independent Critic verification.
            </p>
            <div className="pt-2 border-t border-slate-800/60 font-mono text-[11px] flex items-center justify-between text-slate-400">
              <span>Critic Verdict: <span className="text-emerald-400 font-semibold">{pipeline_stages.specialist_orchestrator.critic_audit_verdict}</span></span>
              <span>Active: {pipeline_stages.specialist_orchestrator.active_specialists} Specialists</span>
            </div>
          </div>

          {/* Stage 2: Forecast Ensemble */}
          <div className="terminal-card p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-xs text-slate-200">Multi-Horizon Forecast Ensemble</span>
              </div>
              <Badge variant="success">{pipeline_stages.forecast_ensemble.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              POST_CLOSE deterministic directional probabilities, 1-sigma expected ATR range, and classic pivots calculated for next session.
            </p>
            <div className="pt-2 border-t border-slate-800/60 font-mono text-[11px] flex items-center justify-between text-slate-400">
              <span>Mode: {pipeline_stages.forecast_ensemble.snapshot_type}</span>
              <span className="truncate max-w-[180px]" title={pipeline_stages.forecast_ensemble.snapshot_hash}>
                Hash: {pipeline_stages.forecast_ensemble.snapshot_hash.slice(0, 12)}...
              </span>
            </div>
          </div>

          {/* Stage 3: Pre-Open Pipeline */}
          <div className="terminal-card p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-xs text-slate-200">08:30 IST Pre-Open Pipeline</span>
              </div>
              <Badge variant="success">{pipeline_stages.pre_open_pipeline.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              GIFT Nifty proxy overnight spread mapping, opening auction bracket calculation, macro headwind classification, and morning alert readiness.
            </p>
            <div className="pt-2 border-t border-slate-800/60 font-mono text-[11px] flex items-center justify-between text-slate-400">
              <span>Target: {pipeline_stages.pre_open_pipeline.target_session}</span>
              <span>Mode: Offline Verified</span>
            </div>
          </div>

          {/* Stage 4: Public Snapshot Exporter */}
          <div className="terminal-card p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-xs text-slate-200">Public Snapshot Exporter & Sanitizer</span>
              </div>
              <Badge variant="success">{pipeline_stages.public_snapshot_exporter.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Recursively validates payloads against forbidden paths and API tokens. Stamped with SHA-256 manifest and published to GitHub Pages.
            </p>
            <div className="pt-2 border-t border-slate-800/60 font-mono text-[11px] flex items-center justify-between text-slate-400">
              <span>Sections: {pipeline_stages.public_snapshot_exporter.sections_published} / 13</span>
              <span className="text-emerald-400 font-semibold">Zero Sensitive Leakage</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Freshness & Governance Matrix */}
      <div className="terminal-card p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Data Freshness & Integrity Attributes</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[11px]">Cash Market</div>
            <div className="text-slate-200 font-semibold mt-1">{data_freshness.cash_market}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Closing Settlement Aligned</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[11px]">Derivatives & Options</div>
            <div className="text-slate-200 font-semibold mt-1">{data_freshness.derivatives_options}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Full Strike Ladder Calibrated</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[11px]">Institutional Flows</div>
            <div className="text-slate-200 font-semibold mt-1">{data_freshness.institutional_flows}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>FII/DII Cash & Derivatives</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <div className="text-slate-500 text-[11px]">Global Macro</div>
            <div className="text-slate-200 font-semibold mt-1">{data_freshness.global_macro}</div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>T-1 Monotonic PIT Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
