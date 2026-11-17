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
} from '../types/market';

/**
 * Resolves the base URL for fetching data under GitHub Pages or local Vite.
 */
function getBasePath(): string {
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? base : `${base}/`;
}

/**
 * Fetch a JSON file safely with appropriate base path resolution and error trapping.
 */
async function fetchJson<T>(relativePath: string): Promise<T> {
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  const fullUrl = `${getBasePath()}${cleanPath}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Cache-Control': 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${fullUrl}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export class MarketDataService {
  private static instance: MarketDataService;
  private manifestCache: SnapshotManifest | null = null;

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  public async getManifest(historyDate?: string): Promise<SnapshotManifest> {
    const path = historyDate 
      ? `data/history/${historyDate}/manifest.json`
      : 'data/latest/manifest.json';
    const manifest = await fetchJson<SnapshotManifest>(path);
    if (!historyDate) {
      this.manifestCache = manifest;
    }
    return manifest;
  }

  public async getMarketOverview(historyDate?: string): Promise<MarketOverviewData> {
    const path = historyDate
      ? `data/history/${historyDate}/market_overview.json`
      : 'data/latest/market_overview.json';
    return fetchJson<MarketOverviewData>(path);
  }

  public async getGlobalMacro(historyDate?: string): Promise<GlobalMacroData> {
    const path = historyDate
      ? `data/history/${historyDate}/global_macro.json`
      : 'data/latest/global_macro.json';
    return fetchJson<GlobalMacroData>(path);
  }

  public async getInstitutionalFlows(historyDate?: string): Promise<InstitutionalFlowsData> {
    const path = historyDate
      ? `data/history/${historyDate}/institutional_flows.json`
      : 'data/latest/institutional_flows.json';
    return fetchJson<InstitutionalFlowsData>(path);
  }

  public async getMarketBreadth(historyDate?: string): Promise<MarketBreadthData> {
    const path = historyDate
      ? `data/history/${historyDate}/market_breadth.json`
      : 'data/latest/market_breadth.json';
    return fetchJson<MarketBreadthData>(path);
  }

  public async getSectorRotation(historyDate?: string): Promise<SectorRotationData> {
    const path = historyDate
      ? `data/history/${historyDate}/sector_rotation.json`
      : 'data/latest/sector_rotation.json';
    return fetchJson<SectorRotationData>(path);
  }

  public async getStockLeadership(historyDate?: string): Promise<StockLeadershipData> {
    const path = historyDate
      ? `data/history/${historyDate}/stock_leadership.json`
      : 'data/latest/stock_leadership.json';
    return fetchJson<StockLeadershipData>(path);
  }

  public async getDerivatives(historyDate?: string): Promise<DerivativesData> {
    const path = historyDate
      ? `data/history/${historyDate}/derivatives.json`
      : 'data/latest/derivatives.json';
    return fetchJson<DerivativesData>(path);
  }

  public async getNiftyForecast(historyDate?: string): Promise<NiftyForecastData> {
    const path = historyDate
      ? `data/history/${historyDate}/nifty_forecast.json`
      : 'data/latest/nifty_forecast.json';
    return fetchJson<NiftyForecastData>(path);
  }

  public async getPreOpen(historyDate?: string): Promise<PreOpenData> {
    const path = historyDate
      ? `data/history/${historyDate}/pre_open.json`
      : 'data/latest/pre_open.json';
    return fetchJson<PreOpenData>(path);
  }

  public async getRiskEvents(historyDate?: string): Promise<RiskEventsData> {
    const path = historyDate
      ? `data/history/${historyDate}/risk_events.json`
      : 'data/latest/risk_events.json';
    return fetchJson<RiskEventsData>(path);
  }

  public async getDailyBriefing(historyDate?: string): Promise<DailyBriefingData> {
    const path = historyDate
      ? `data/history/${historyDate}/daily_briefing.json`
      : 'data/latest/daily_briefing.json';
    return fetchJson<DailyBriefingData>(path);
  }

  public async getSourcesRegistry(historyDate?: string): Promise<SourcesRegistryData> {
    const path = historyDate
      ? `data/history/${historyDate}/sources_registry.json`
      : 'data/latest/sources_registry.json';
    return fetchJson<SourcesRegistryData>(path);
  }

  public async getOperationalStatus(historyDate?: string): Promise<OperationalStatusData> {
    const path = historyDate
      ? `data/history/${historyDate}/operational_status.json`
      : 'data/latest/operational_status.json';
    return fetchJson<OperationalStatusData>(path);
  }

  public getCachedManifest(): SnapshotManifest | null {
    return this.manifestCache;
  }
}
