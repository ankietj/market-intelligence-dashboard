# System Architecture & Data Topology

## 1. High-Level Architecture Overview

The **Public Market Intelligence Dashboard** is deliberately designed as a decoupled, 100% static client application. The private quantitative engines, execution models, and canonical databases remain isolated in private infrastructure.

```text
PRIVATE CANONICAL DATASTORE (DuckDB / Parquet / Google Drive)
                          │
                          ▼
PRIVATE SWING-TRADING-SYSTEM ENGINE
┌────────────────────────────────────────────────────────┐
│  • Specialist Agents (Sector, Macro, Breadth, Inst, Opt)│
│  • Critic Independent Verification Gatekeeper           │
│  • Forecast Ensemble & Pre-Open Auction Models          │
└────────────────────────────────────────────────────────┘
                          │
                          ▼ (Public Snapshot Exporter)
PUBLIC DATA SANITIZATION & INTEGRITY AUDIT
┌────────────────────────────────────────────────────────┐
│  • Strips local disk paths and private credentials     │
│  • Schema validation against public_snapshot.schema.json│
│  • SHA-256 cryptographic file checksum generation       │
└────────────────────────────────────────────────────────┘
                          │
                          ▼ (Commit & Manual Publish)
MARKET-INTELLIGENCE-DASHBOARD REPOSITORY
┌────────────────────────────────────────────────────────┐
│  • public/data/latest/ (11 validated JSON files)       │
│  • public/data/history/<date>/ (Historical snapshots)  │
│  • React / TypeScript / Vite application               │
└────────────────────────────────────────────────────────┘
                          │
                          ▼ (GitHub Actions workflow_dispatch)
GITHUB PAGES HOSTING (Static CDN)
┌────────────────────────────────────────────────────────┐
│  https://ankietj.github.io/market-intelligence-dashboard│
└────────────────────────────────────────────────────────┘
```

---

## 2. Decoupling & Security Boundaries

1. **Zero Database / Backend at Runtime:** The public site makes no database queries and maintains zero server-side state. All data is pre-computed and stored as immutable JSON snapshots.
2. **Private Repository Isolation:** The private repository (`swing-trading-system`) contains proprietary strategy logic, portfolio execution algorithms, and raw trade ledgers. None of these assets are exposed or linked to the public repository.
3. **Google Drive Isolation:** Google Drive Desktop (`G:\My Drive\Swing_Trading_System`) stores canonical price tables and raw research caches. It is never made public and is accessible only from authorized local sessions.

---

## 3. Data Flow & Snapshot Artifacts

Every published snapshot produces 11 core data files under `public/data/latest/`:

| File | Purpose | Underlying Source |
|---|---|---|
| `market_overview.json` | Headline index KPIs, regime tilt, top drivers & risks | `SpecialistOrchestrator` & `broad_market_daily.parquet` |
| `global_macro.json` | Brent Crude, USD/INR, 10Y Yield, DXY, GIFT Nifty proxy | `GlobalMacroAdapter` |
| `institutional_flows.json`| FII/DII cash turnover, Index Futures OI, squeeze alerts | `InstitutionalFlowAdapter` |
| `market_breadth.json` | 50 NIFTY stocks advance/decline, MA participation | `BreadthSpecialist` |
| `sector_rotation.json` | 19 sector relative strength scores, cyclical spread | `SectorSpecialist` |
| `stock_leadership.json` | Top gainers, losers, and volume breakouts | `stock_daily.parquet` |
| `derivatives.json` | Total PCR, Max Pain, Call Wall, Put Wall, ATM straddle | `NseOptionsAdapter` & `OptionsSpecialist` |
| `nifty_forecast.json` | EOD Post-Close forecast, directional probabilities, pivots | `ForecastEnsemble` |
| `pre_open.json` | 08:30 IST pre-open gap, auction bracket, execution rules | `PreOpenPipelineRunner` |
| `risk_events.json` | Systemic risk score, VIX threshold, upcoming events | `MacroSpecialist` |
| `daily_briefing.json` | 10-point cross-specialist synthesized briefing | `SpecialistOrchestrator` |
| `manifest.json` | Authoritative snapshot metadata, timestamp, file hashes | `PublicSnapshotExporter` |
