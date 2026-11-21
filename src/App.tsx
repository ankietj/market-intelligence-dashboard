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
  SourcesRegistryData,
  OperationalStatusData,
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
import { DataSourcesMethodology } from './components/sections/DataSourcesMethodology';
import { OperationalStatusSection } from './components/sections/OperationalStatusSection';
import { FundamentalIntelligenceSection } from './components/sections/FundamentalIntelligenceSection';
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
  Database,
  Activity,
  Scale,
} from 'lucide-react';

type ActiveTab = 
  | 'COMMAND_CENTRE'
  | 'GLOBAL_MACRO'
  | 'INSTITUTIONAL'
  | 'SECTOR_ROTATION'
  | 'DERIVATIVES'
  | 'FORECAST'
  | 'FUNDAMENTAL_INTELLIGENCE'
  | 'RISK_EVENTS'
  | 'DAILY_REPORT'
  | 'SOURCES'
  | 'OPERATIONAL_STATUS';

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
  const [sources, setSources] = useState<SourcesRegistryData | null>(null);
  const [opsStatus, setOpsStatus] = useState<OperationalStatusData | null>(null);
  const [fundamental, setFundamental] = useState<any>(null);

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
        srcReg,
        opStat,
        fundData,
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
        svc.getSourcesRegistry(),
        svc.getOperationalStatus(),
        svc.getFundamentalIntelligence().catch((e) => {
          console.warn('Fundamental intelligence not available:', e);
          return null;
        }),
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
      setSources(srcReg);
      setOpsStatus(opStat);
      setFundamental(fundData);
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

  const formatTimestamp = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }) + ' IST';
    } catch {
      return isoStr;
    }
  };

  const formatMarketDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        return dateObj.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getActiveTabMetadata = () => {
    switch (activeTab) {
      case 'COMMAND_CENTRE':
        return {
          title: 'Command Centre',
          dateUsed: overview?.market_data_as_of || overview?.market_date || manifest?.market_date || '—',
          publishedAt: overview?.published_at || overview?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Consolidated Canonical Intelligence Feeds',
        };
      case 'GLOBAL_MACRO':
        return {
          title: 'Global Macro & Commodities',
          dateUsed: macro?.market_data_as_of || macro?.market_date || manifest?.market_date || '—',
          publishedAt: macro?.published_at || macro?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'International FX & Commodity Exchanges',
        };
      case 'INSTITUTIONAL':
        return {
          title: 'Institutional Cash & F&O Flows',
          dateUsed: flows?.market_data_as_of || flows?.market_date || manifest?.market_date || '—',
          publishedAt: flows?.published_at || flows?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'NSE Official FII/DII Turnover & Participant Open Interest',
        };
      case 'SECTOR_ROTATION':
        return {
          title: '19-Sector Rotation & Breadth',
          dateUsed: sector?.market_data_as_of || sector?.market_date || manifest?.market_date || '—',
          publishedAt: sector?.published_at || sector?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'NSE Thematic & Sectoral Index Bhavcopies',
        };
      case 'DERIVATIVES':
        return {
          title: 'Derivatives & NIFTY Options Intelligence',
          dateUsed: derivatives?.market_data_as_of || derivatives?.market_date || manifest?.market_date || '—',
          publishedAt: derivatives?.published_at || derivatives?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'NSE NIFTY Options Chain (Calibrated Empirical Surface)',
        };
      case 'FORECAST':
        return {
          title: 'NIFTY Directional Forecast Ensemble',
          dateUsed: forecast?.market_data_as_of || forecast?.as_of_session_date || forecast?.market_date || manifest?.market_date || '—',
          publishedAt: forecast?.published_at || forecast?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Heuristic Multi-Factor Rule Scoring & 1-Sigma ATR Model',
        };
      case 'FUNDAMENTAL_INTELLIGENCE':
        return {
          title: 'Strategy Fundamental Intelligence',
          dateUsed: fundamental?.market_data_as_of || fundamental?.market_date || manifest?.market_date || '—',
          publishedAt: fundamental?.published_at || fundamental?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Volume Breakout Overlay & 7-Agent Interpretive Engine',
        };
      case 'RISK_EVENTS':
        return {
          title: 'Risk & Event Volatility Monitor',
          dateUsed: risk?.market_data_as_of || risk?.market_date || manifest?.market_date || '—',
          publishedAt: risk?.published_at || risk?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'India VIX Volatility Index & Institutional Crowding Monitor',
        };
      case 'DAILY_REPORT':
        return {
          title: 'Multi-Specialist Agent Daily Briefing',
          dateUsed: briefing?.market_data_as_of || briefing?.market_date || manifest?.market_date || '—',
          publishedAt: briefing?.published_at || briefing?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Specialist Agent Orchestration & Deterministic Synthesis',
        };
      case 'SOURCES':
        return {
          title: 'Data Sources & Methodology Registry',
          dateUsed: sources?.market_data_as_of || sources?.market_date || manifest?.market_date || '—',
          publishedAt: sources?.published_at || sources?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Authoritative Enterprise Data Governance Registry',
        };
      case 'OPERATIONAL_STATUS':
        return {
          title: 'Operational Status & Pipeline Telemetry',
          dateUsed: opsStatus?.market_data_as_of || opsStatus?.market_date || manifest?.market_date || '—',
          publishedAt: opsStatus?.published_at || opsStatus?.generated_at || manifest?.published_at || manifest?.generated_at || '—',
          sourceName: 'Automated Refresh Pipeline Telemetry & Health Checks',
        };
    }
  };

  const navItems = [
    { id: 'COMMAND_CENTRE', label: 'Command Centre', icon: LayoutDashboard },
    { id: 'GLOBAL_MACRO', label: 'Global & Macro', icon: Globe },
    { id: 'INSTITUTIONAL', label: 'Institutional Flows', icon: Building2 },
    { id: 'SECTOR_ROTATION', label: 'Sector Rotation', icon: PieChart },
    { id: 'DERIVATIVES', label: 'Derivatives & Options', icon: Target },
    { id: 'FORECAST', label: 'NIFTY Forecast', icon: Compass },
    { id: 'FUNDAMENTAL_INTELLIGENCE', label: 'Fundamentals', icon: Scale },
    { id: 'RISK_EVENTS', label: 'Risk & Events', icon: ShieldAlert },
    { id: 'DAILY_REPORT', label: 'Daily Briefing', icon: FileText },
    { id: 'SOURCES', label: 'Data Sources', icon: Database },
    { id: 'OPERATIONAL_STATUS', label: 'System Status', icon: Activity },
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
        sourceFreshness={manifest?.source_freshness}
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

      {/* 2.5 Active Tab Freshness & Publication Metadata Bar */}
      {(() => {
        const tabMeta = getActiveTabMetadata();
        return (
          <div className="border-b border-slate-800/80 bg-[#090d16] px-4 lg:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-200 tracking-wide">{tabMeta.title}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Date Used (Market As-Of):</span>
                  <span className="font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    {formatMarketDate(tabMeta.dateUsed)}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px] hidden md:inline">({tabMeta.sourceName})</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>When Published:</span>
                  <span className="font-mono font-medium text-slate-200">
                    {formatTimestamp(tabMeta.publishedAt)}
                  </span>
                </div>
                <span className="text-slate-700 hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold tracking-wide">
                    CANONICAL VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

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
        {activeTab === 'FUNDAMENTAL_INTELLIGENCE' && (
          <FundamentalIntelligenceSection data={fundamental} />
        )}
        {activeTab === 'RISK_EVENTS' && (
          <RiskEventsSection data={risk} />
        )}
        {activeTab === 'DAILY_REPORT' && (
          <DailyBriefingSection data={briefing} />
        )}
        {activeTab === 'SOURCES' && (
          <DataSourcesMethodology data={sources} />
        )}
        {activeTab === 'OPERATIONAL_STATUS' && (
          <OperationalStatusSection data={opsStatus} />
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
