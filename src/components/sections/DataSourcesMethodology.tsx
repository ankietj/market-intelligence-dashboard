import React, { useState } from 'react';
import { SourcesRegistryData, SourceRegistryItem } from '../../types/market';
import { Badge } from '../common/Badge';
import { Database, Search, ShieldCheck, CheckCircle2, Clock, Cpu } from 'lucide-react';

interface Props {
  data: SourcesRegistryData | null;
}

export const DataSourcesMethodology: React.FC<Props> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!data) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading Data Sources & Methodology Registry...</div>;
  }

  const categories = ['ALL', ...Array.from(new Set(data.sources.map(s => s.category)))];

  const filteredSources = data.sources.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = 
      (s.name || '').toLowerCase().includes(query) ||
      (s.provider || '').toLowerCase().includes(query) ||
      (s.id || '').toLowerCase().includes(query) ||
      (s.methodology || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const operationalCount = data.sources.filter(s => s.status === 'OPERATIONAL').length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="terminal-card p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-wide">Data Sources & Quantitative Methodology</h2>
                <Badge variant="success">{operationalCount} Feeds Operational</Badge>
                <Badge variant="neutral" size="sm">Market Date: {data.market_date}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Full transparency into exchange feeds, clearing house records, feature pipelines, update cadences, and cryptographic verification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              Generated: {new Date(data.generated_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">100% Deterministic Calculations</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Zero numerical math delegated to LLMs. All metrics computed by deterministic Python services and DuckDB algorithms.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Cryptographic Provenance</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Every observation is stamped with an immutable SHA-256 hash. Data pipelines enforce zero lookahead bias.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-slate-200">Point-in-Time Causal Isolation</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Historical research and next-session outlooks strictly respect exchange release schedules (T-1 causal rules).</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sources, providers, or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      {/* 3. Data Sources Table */}
      <div className="terminal-card overflow-hidden bg-slate-900/50 border border-slate-800 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Feed / Identifier</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Primary Provider</th>
                <th className="py-3 px-4 font-semibold">Update Cadence & Latency</th>
                <th className="py-3 px-4 font-semibold">Verification & Integrity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredSources.map((src: SourceRegistryItem) => (
                <tr key={src.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-semibold text-slate-200">{src.name}</div>
                    <div className="font-mono text-[11px] text-sky-400 mt-0.5">{src.id}</div>
                    <div className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed max-w-sm">
                      {src.methodology}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <Badge variant="neutral" size="sm">{src.category}</Badge>
                  </td>
                  <td className="py-3.5 px-4 align-top font-sans text-slate-300">
                    {src.provider}
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <div className="text-slate-200">{src.cadence}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">{src.latency}</div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-sans text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>{src.verification}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      src.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : src.status === 'DEGRADED'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      <CheckCircle2 className="w-3 h-3" />
                      {src.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSources.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            No data sources matched your filter or search query.
          </div>
        )}
      </div>
    </div>
  );
};
