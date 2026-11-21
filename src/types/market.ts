/**
 * Authoritative TypeScript Data Contracts for Public Market Intelligence Snapshot.
 * Matches schemas/public_snapshot.schema.json.
 */

export interface SnapshotManifest {
  schema_version: string;
  snapshot_id: string;
  market_date: string;
  target_session_date: string;
  generated_at: string;
  data_as_of: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: 'CURRENT' | 'STALE' | 'DEGRADED';
  coverage_status?: Record<string, string>;
  authenticity_status?: Record<string, string>;
  publication_type: string;
  source_status: Record<string, string>;
  coverage: {
    nifty_constituents: number;
    sectors: number;
    options_strikes: number;
  };
  data_quality: {
    all_checks_passed: boolean;
    sanitization_verified: boolean;
    critic_audited: boolean;
    freshness_verified?: boolean;
  };
  sections: Record<string, string>;
  file_hashes: Record<string, string>;
}

export interface MarketIndexItem {
  symbol: string;
  name: string;
  close: number;
  change_pts: number;
  change_pct: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'BENIGN';
}

export interface MarketOverviewData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  headline_regime: {
    overall_tilt: string;
    volatility_regime: string;
    vix_level: number;
    cyclical_defensive_spread: number;
  };
  indices: MarketIndexItem[];
  breadth_summary: {
    advances: number;
    declines: number;
    advance_percentage: number;
    coverage_percentage: number;
  };
  institutional_summary: {
    fii_long_ratio_pct: number;
    fii_net_cash_cr: number;
    dii_net_cash_cr: number;
    positioning_bias: string;
  };
  top_drivers_positive: string[];
  top_risks_negative: string[];
  overall_takeaway: string;
  data_provenance: {
    source: string;
    verification_status: string;
    pit_enforced: boolean;
  };
}

export interface GlobalMacroData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  macro_risk_score: number;
  macro_risk_tilt: string;
  headwind_level: string;
  indicators: {
    brent_crude: {
      price_usd: number;
      change_1d_pct: number;
      unit: string;
      source: string;
    };
    usd_inr: {
      rate: number;
      change_1d_pct: number;
      unit: string;
      source: string;
    };
    us_10y_yield: {
      yield_pct: number;
      change_1d_bps: number;
      unit: string;
      source: string;
    };
    dxy_index: {
      level: number;
      change_1d_pct: number;
      unit: string;
      source: string;
    };
    gift_nifty_proxy: {
      implied_spread_points: number;
      unit: string;
      methodology: string;
      disclaimer: string;
    };
  };
  global_indices: Array<{
    name: string;
    region: string;
    change_pct: number;
    status: string;
  }>;
}

export interface InstitutionalFlowsData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  cash_market: {
    fii_net_cr: number;
    dii_net_cr: number;
    total_institutional_net_cr: number;
    unit: string;
  };
  derivatives_positioning: {
    fii_index_fut_long: number;
    fii_index_fut_short: number;
    fii_long_short_ratio: number;
    fii_long_pct: number;
    client_index_fut_long: number;
    client_index_fut_short: number;
    client_long_short_ratio: number;
    client_long_pct: number;
    positioning_bias: string;
  };
  contrarian_short_squeeze_alert: {
    active: boolean;
    threshold_pct: number;
    current_fii_long_pct: number;
    implication: string;
  };
  recent_flow_history: Array<{
    date: string;
    fii_cash: number;
    dii_cash: number;
  }>;
}

export interface MarketBreadthData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  advances: number;
  declines: number;
  unchanged: number;
  advance_percentage: number;
  universe_coverage_percentage: number;
  universe_size: number;
  moving_averages: {
    pct_above_20dma: number;
    pct_above_50dma: number;
    pct_above_200dma: number;
  };
  concentration_spread: number;
  divergence_signal: string;
  breadth_regime: string;
}

export interface SectorItem {
  name: string;
  change_pct: number;
  rs_vs_nifty: number;
  momentum: 'LEADING' | 'IMPROVING' | 'WEAKENING' | 'LAGGING';
  type: 'CYCLICAL' | 'DEFENSIVE';
}

export interface SectorRotationData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  spread_cyclical_defensive: number;
  leading_sector: string;
  sectors: SectorItem[];
  rotation_takeaway: string;
}

export interface StockLeaderItem {
  symbol: string;
  name: string;
  close: number;
  change_pct: number;
  turnover_cr: number;
}

export interface StockLeadershipData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  top_gainers: StockLeaderItem[];
  top_losers: StockLeaderItem[];
  volume_breakouts: Array<{
    symbol: string;
    relative_volume: number;
    breakout_level: number;
    status: string;
  }>;
}

export interface StrikeItem {
  strike: number;
  ce_oi: number;
  pe_oi: number;
  ce_change_oi: number;
  pe_change_oi: number;
  ce_ltp: number;
  pe_ltp: number;
}

export interface DerivativesData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  underlying_price: number;
  atm_strike: number;
  pcr_oi: number;
  pcr_volume: number;
  max_pain_strike: number;
  call_wall: {
    strike: number;
    open_interest: number;
    distance_pts: number;
    distance_pct: number;
    role: string;
  };
  put_wall: {
    strike: number;
    open_interest: number;
    distance_pts: number;
    distance_pct: number;
    role: string;
  };
  atm_straddle: {
    iv_pct: number;
    premium_pts: number;
    implied_upper_breakeven: number;
    implied_lower_breakeven: number;
  };
  order_flow_imbalance: {
    net_ce_oi_change: number;
    net_pe_oi_change: number;
    bias: string;
  };
  strike_table?: StrikeItem[];
  strike_distribution?: StrikeItem[];
}

export interface NiftyForecastData {
  schema_version: string;
  market_date?: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  as_of_session_date: string;
  target_session_date: string;
  generated_at: string;
  snapshot_type: string;
  reference_close: number;
  directional_probability: {
    bias: string;
    p_up: number;
    p_down: number;
    p_sideways: number;
    rule_score: number;
    is_statistically_calibrated: boolean;
  };
  expected_range: {
    low: number;
    high: number;
    range_points: number;
    atr_14: number;
    confidence_interval: string;
  };
  technical_levels: {
    master_pivot: number;
    classic_pivots: {
      r2: number;
      r1: number;
      pivot: number;
      s1: number;
      s2: number;
    };
    support_zone: [number, number];
    resistance_zone: [number, number];
  };
  scenarios: {
    bullish_target: number;
    bearish_target: number;
    invalidation_level: number;
  };
  snapshot_hash: string;
}

export interface PreOpenData {
  schema_version: string;
  market_date?: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  target_session_date: string;
  generated_at: string;
  snapshot_type: string;
  expected_open: number;
  gap_classification: string;
  overnight_gap_points: number;
  auction_bracket_low: number;
  auction_bracket_high: number;
  key_inflection_level: number;
  macro_headwind_level: string;
  derivatives_boundaries: {
    call_wall_strike: number;
    put_wall_strike: number;
    options_pcr: number;
    options_max_pain: number;
  };
  auction_action_rules: string[];
  report_hash: string;
}

export interface RiskEventsData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  generated_at: string;
  macro_risk_level: string;
  volatility_monitor: {
    vix_level: number;
    vix_regime: string;
    risk_threshold: number;
    guideline: string;
  };
  institutional_crowding: {
    alert: string;
    fii_long_pct: number;
  };
  gamma_flip_levels: {
    put_wall_support: number;
    call_wall_resistance: number;
    max_pain: number;
  };
  upcoming_catalysts: Array<{
    event: string;
    date: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  data_freshness_warnings: string[];
}

export interface DailyBriefingData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  generated_at: string;
  verification_status: {
    all_specialists_passed: boolean;
    accepted_specialist_count: number;
    total_specialists: number;
    audit_verdict: string;
  };
  executive_synthesis_points: string[];
  cross_specialist_agreements: string[];
  cross_specialist_disagreements: string[];
  tactical_positioning_implications: string[];
  next_session_watchpoints: string[];
}

export interface SourceRegistryItem {
  id: string;
  name: string;
  category: string;
  provider: string;
  cadence: string;
  latency: string;
  status: string;
  verification: string;
  methodology: string;
}

export interface SourcesRegistryData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  generated_at: string;
  sources_count: number;
  sources: SourceRegistryItem[];
}

export interface OperationalStatusData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  published_at?: string;
  source_freshness?: string;
  target_session_date: string;
  generated_at: string;
  overall_system_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  last_successful_refresh: string;
  pipeline_stages: {
    pre_open_pipeline: {
      status: string;
      target_session: string;
      execution_mode: string;
      report_hash: string;
    };
    specialist_orchestrator: {
      status: string;
      active_specialists: number;
      accepted_specialists: number;
      all_passed: boolean;
      critic_audit_verdict: string;
    };
    forecast_ensemble: {
      status: string;
      snapshot_type: string;
      snapshot_hash: string;
    };
    public_snapshot_exporter: {
      status: string;
      sections_published: number;
      sanitization_verified: boolean;
    };
  };
  data_freshness: {
    cash_market: string;
    derivatives_options: string;
    institutional_flows: string;
    global_macro: string;
  };
  data_quality_warnings: string[];
  critic_audit_summary: {
    total_specialists_audited: number;
    accepted_count: number;
    all_passed: boolean;
    audit_decision: string;
  };
}

export interface CandidateTechnicalContext {
  breakout_strength?: number | null;
  relative_volume?: number | null;
  rs_percentile?: number | null;
  strategy_rank?: number | null;
  strategy_score?: number | null;
  price_at_signal?: number | null;
}

export interface CandidateFundamentalAssessment {
  assessment_id: string;
  security_id: string;
  ticker: string;
  isin: string;
  company_name: string;
  sector_key: string;
  canonical_sector: string;
  as_of_date: string;
  strategy_signal_date: string;
  strategy_id: string;
  status: 'COMPLETE' | 'PARTIAL' | 'INSUFFICIENT_DATA' | 'QUARANTINED' | 'ERROR' | string;
  authenticity_summary: string;
  composite_score?: number | null;
  score_grade?: string | null;
  score_coverage_pct: number;
  score_indicative_only: boolean;
  score_suppressed_by_gate: boolean;
  governance_veto: boolean;
  governance_veto_reason?: string;
  signal_alignment: string;
  alignment_rationale?: string;
  thesis_support?: string;
  thesis_risks?: string;
  missing_evidence?: string;
  business_quality?: {
    status: string;
    revenue_cagr_pct?: number | null;
    pat_cagr_pct?: number | null;
    ebitda_margin_pct?: number | null;
    roce_pct?: number | null;
    sector_note?: string;
    limitations?: string[];
  };
  earnings_quality?: {
    status: string;
    cfo_to_pat_ratio?: number | null;
    fcf_margin_pct?: number | null;
    accrual_ratio?: number | null;
    forensic_flags?: string[];
    limitations?: string[];
  };
  balance_sheet?: {
    status: string;
    net_debt_to_ebitda?: number | null;
    current_ratio?: number | null;
    is_net_cash?: boolean | null;
    limitations?: string[];
  };
  governance?: {
    status: string;
    promoter_holding_pct?: number | null;
    promoter_pledge_pct?: number | null;
    governance_veto: boolean;
    material_events?: string[];
    limitations?: string[];
  };
  valuation?: {
    status: string;
    pe_x?: number | null;
    pb_x?: number | null;
    ev_ebitda_x?: number | null;
    sector_note?: string;
    limitations?: string[];
  };
  evidence?: {
    coverage_pct: number;
    data_confidence: string;
    intake_gate_status: string;
    known_limitations: string[];
    metrics_missing: string[];
  };
  is_investable: boolean;
}

export interface FundamentalCandidateItem {
  ticker: string;
  company_name: string;
  isin: string;
  canonical_sector: string;
  signal_date: string;
  fundamental_status: string;
  signal_alignment: 'ALIGNED' | 'CONFLICTED' | 'FUNDAMENTAL_CAUTION' | 'FUNDAMENTAL_VETO' | 'INSUFFICIENT_DATA' | string;
  governance_veto: boolean;
  governance_veto_reason: string;
  technical: CandidateTechnicalContext;
  fundamental: CandidateFundamentalAssessment | null;
  thesis_support: string;
  thesis_risks: string;
  technical_fundamental_agreement: string;
  disagreement_detail: string;
  missing_evidence: string;
  is_investable: boolean;
}

export interface FundamentalIntelligenceData {
  schema_version: string;
  market_date: string;
  market_data_as_of?: string;
  evaluation_as_of?: string;
  generated_at: string;
  published_at?: string;
  source_freshness?: string;
  strategy_id: string;
  strategy_name: string;
  is_investable: boolean;
  summary: {
    total_candidates: number;
    aligned_count: number;
    caution_count: number;
    veto_count: number;
    insufficient_data_count: number;
  };
  candidates: FundamentalCandidateItem[];
  authenticity_tier_status: {
    tier_1_verified_primary: string;
    tier_2_verified_exchange: string;
    tier_3_verified_secondary: string;
    quarantined_datasets: string[];
    governance_verification: string;
  };
  provenance_statement: string;
  disclaimer: string;
}
