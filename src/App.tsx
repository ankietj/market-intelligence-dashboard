import React, { useEffect, useState } from 'react';
import { MarketDataService } from './services/dataService';
import {
  SnapshotManifest,
  MarketOverviewData,
  GlobalMacroData,
  InstitutionalFlowsData,
  MarketBreadthData,
  SectorRotationData,
  StockLeadershipData,
  DerivativesData,
  NiftyForecastData,
  PreOpenData,
  RiskEventsData,
  DailyBriefingData,
} from './types/market';
import { Header } from './components/common/Header';
import { MarketCommandCentre } from './components/sections/MarketCommandCentre';
import { GlobalMacroSection } from './components/sections/GlobalMacroSection';
import { InstitutionalFlowsSection } from './components/sections/InstitutionalFlowsSection';
import { SectorRotationSection } from './components/sections/SectorRotationSection';
import { DerivativesSection } from './components/sections/DerivativesSection';
import { NiftyForecastSection } from './components/sections/NiftyForecastSection';
import { RiskEventsSection } from './components/sections/RiskEventsSection';
import { DailyBriefingSection } from './components/sections/DailyBriefingSection';
import {
  LayoutDashboard,
  Globe,
  Building2,
  PieChart,
  Target,
  Compass,
  ShieldAlert,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

type ActiveTab = 
  | 'COMMAND_CENTRE'
  | 'GLOBAL_MACRO'
  | 'INSTITUTIONAL'
  | 'SECTOR_ROTATION'
  | 'DERIVATIVES'
  | 'FORECAST'
  | 'RISK_EVENTS'
  | 'DAILY_REPORT';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('COMMAND_CENTRE');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [manifest, setManifest] = useState<SnapshotManifest | null>(null);
  const [overview, setOverview] = useState<MarketOverviewData | null>(null);
  const [macro, setMacro] = useState<GlobalMacroData | null>(null);
  const [flows, setFlows] = useState<InstitutionalFlowsData | null>(null);
  const [breadth, setBreadth] = useState<MarketBreadthData | null>(null);
  const [sector, setSector] = useState<SectorRotationData | null>(null);
  const [stock, setStock] = useState<StockLeadershipData | null>(null);
  const [derivatives, setDerivatives] = useState<DerivativesData | null>(null);
  const [forecast, setForecast] = useState<NiftyForecastData | null>(null);
  const [preOpen, setPreOpen] = useState<PreOpenData | null>(null);
  const [risk, setRisk] = useState<RiskEventsData | null>(null);
  const [briefing, setBriefing] = useState<DailyBriefingData | null>(null);

  const loadAllData = async () => {
    try {
      setError(null);
      const svc = MarketDataService.getInstance();

      const [
        man,
        ov,
        gm,
        fl,
        br,
        sec,
        stk,
        der,
        fc,
        po,
        rk,
        db,
      ] = await Promise.all([
        svc.getManifest(),
        svc.getMarketOverview(),
        svc.getGlobalMacro(),
        svc.getInstitutionalFlows(),
        svc.getMarketBreadth(),
        svc.getSectorRotation(),
        svc.getStockLeadership(),
        svc.getDerivatives(),
        svc.getNiftyForecast(),
        svc.getPreOpen(),
        svc.getRiskEvents(),
        svc.getDailyBriefing(),
      ]);

      setManifest(man);
      setOverview(ov);
      setMacro(gm);
      setFlows(fl);
      setBreadth(br);
      setSector(sec);
      setStock(stk);
      setDerivatives(der);
      setForecast(fc);
      setPreOpen(po);
      setRisk(rk);
      setBriefing(db);
    } catch (err: any) {
      console.error('Failed to load published snapshot:', err);
      setError(err?.message || 'Error loading market intelligence snapshot.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const navItems = [
    { id: 'COMMAND_CENTRE', label: 'Command Centre', icon: LayoutDashboard },
    { id: 'GLOBAL_MACRO', label: 'Global & Macro', icon: Globe },
    { id: 'INSTITUTIONAL', label: 'Institutional Flows', icon: Building2 },
    { id: 'SECTOR_ROTATION', label: 'Sector Rotation', icon: PieChart },
    { id: 'DERIVATIVES', label: 'Derivatives & Options', icon: Target },
    { id: 'FORECAST', label: 'NIFTY Forecast', icon: Compass },
    { id: 'RISK_EVENTS', label: 'Risk & Events', icon: ShieldAlert },
    { id: 'DAILY_REPORT', label: 'Daily Briefing', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin mb-4" />
        <h2 className="text-base font-mono text-slate-200">Loading Market Intelligence Snapshot...</h2>
        <p className="text-xs text-slate-500 mt-1">Retrieving validated public JSON artifacts</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col items-center justify-center p-4">
        <div className="terminal-card p-6 max-w-md text-center border-rose-900/60 bg-rose-950/20">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-100 mb-1">Failed to Load Public Snapshot</h2>
          <p className="text-xs text-slate-300 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col">
      {/* 1. Header */}
      <Header
        marketDate={manifest?.market_date || '—'}
        targetSessionDate={manifest?.target_session_date || '—'}
        generatedAt={manifest?.generated_at || ''}
        snapshotId={manifest?.snapshot_id || 'LATEST'}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      {/* 2. Navigation Bar */}
      <nav className="border-b border-slate-800 bg-[#0d121f] px-4 lg:px-8 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {activeTab === 'COMMAND_CENTRE' && (
          <MarketCommandCentre data={overview} forecast={forecast} breadth={breadth} />
        )}
        {activeTab === 'GLOBAL_MACRO' && (
          <GlobalMacroSection data={macro} />
        )}
        {activeTab === 'INSTITUTIONAL' && (
          <InstitutionalFlowsSection data={flows} />
        )}
        {activeTab === 'SECTOR_ROTATION' && (
          <SectorRotationSection sectorData={sector} stockData={stock} />
        )}
        {activeTab === 'DERIVATIVES' && (
          <DerivativesSection data={derivatives} />
        )}
        {activeTab === 'FORECAST' && (
          <NiftyForecastSection forecast={forecast} preOpen={preOpen} />
        )}
        {activeTab === 'RISK_EVENTS' && (
          <RiskEventsSection data={risk} />
        )}
        {activeTab === 'DAILY_REPORT' && (
          <DailyBriefingSection data={briefing} />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a0f] py-6 px-4 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-slate-400 font-medium font-mono">
              Market Intelligence Dashboard • Version 1.0.0
            </span>
            <p className="text-[11px] text-slate-500 max-w-2xl">
              Public market intelligence and institutional research platform. Published manually via GitHub Actions workflow. Data is sanitized, verified against point-in-time exchange constraints, and presented for informational and research purposes only. Not investment or trading advice.
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="text-emerald-400">● 100% Critic Audited</span>
            <span className="text-slate-400">Host: GitHub Pages</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
