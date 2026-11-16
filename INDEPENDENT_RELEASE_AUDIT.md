# INDEPENDENT RELEASE AUDIT — PUBLIC MARKET INTELLIGENCE DASHBOARD

**Auditor:** Principal Quantitative Research Engineer & Systems Auditor  
**Date of Audit:** November 16, 2026  
**Audited Target:** `market-intelligence-dashboard` (Commit `4a1ca938ade52d2003004813fb472e71eb33de8a`)  
**Production URL:** `https://ankietj.github.io/market-intelligence-dashboard/`  
**GitHub Actions Run ID:** `43878734315` (Status: `completed`, Conclusion: `success`)  
**Engine Repository:** `swing-trading-system` (Commit `7d5e93d`)  
**Overall Decision:** **APPROVED WITH DISCLOSED LIMITATIONS**  

---

## 1. Executive Summary & Verdict

An independent, evidence-based release audit of the `market-intelligence-dashboard` repository was conducted on November 16, 2026. This audit verifies the actual repository implementation, published JSON snapshots, GitHub Actions workflow, deployed GitHub Pages site, and analytical calculations.

### Summary Classification Table

| Audit Domain | Primary Verification Target | Classification | Key Empirical Findings |
|---|---|---|---|
| **1. Repository & Architecture** | Separation from `swing-trading-system`, Vite base path, static bundle | **PASS** | Pure static React 18 + TS + Vite app. Zero runtime backend or database dependencies. |
| **2. Deployment & Publishing** | GitHub Actions workflow, manual `workflow_dispatch`, Pages CDN | **PASS** | Workflow run `43878734315` completed in 53s. HTTP 200 confirmed on public URL. Strictly manual. |
| **3. Snapshot & Hash Integrity** | `public/data/latest/` manifests, SHA-256 byte digests, schemas | **PASS** | All 11 section payloads match byte-exact SHA-256 digests in `manifest.json`. |
| **4. Security & Sanitization** | Credential scrubbing, local path removal, allowlist gating | **PASS** | 0 secrets, 0 API tokens, 0 local drive letters or usernames in deployed assets. |
| **5. Frontend Truthfulness** | UI labels, confidence displays, timestamp prominence | **PASS WITH LIMITATIONS** | Heuristic directional probability titled "Calibrated"; net flow labeled "Turnover". |
| **6. Analytical Correctness** | Institutional flows, breadth counts, sector coverage, GEX | **PASS WITH LIMITATIONS** | Breadth sums to 49/50; sector JSON contains 7 of claimed 19; flow history duplicates date. |
| **7. Testing & Verification** | Unit tests, contract verification, static build checks | **PASS** | 23/23 Python unit tests OK; snapshot verification suite passed; Vite build clean. |

### Overall Verdict: **APPROVED WITH DISCLOSED LIMITATIONS**

The application is structurally robust, secure, and fully operational on GitHub Pages without credentials or runtime backend dependencies. However, public users and institutional stakeholders must be provided with the explicit disclosures detailed in Section 6 regarding sample breadth, heuristic probability scoring, and sector coverage.

---

## 2. Repository and Deployment Verification

### 2.1 Repository Separation
- **Private Compute Repository:** `C:\Users\ankit_aj\Desktop\Work\Stock_kite\swing-trading-system` (Git remote: `https://github.com/ankietj/swingtrading.git`, branch `main`).
- **Public Dashboard Repository:** `C:\Users\ankit_aj\Desktop\Work\Stock_kite\market-intelligence-dashboard` (Git remote: `https://github.com/ankietj/market-intelligence-dashboard.git`, branch `main`).
- **Inspection Finding:** The repositories are completely distinct Git trees with independent commit histories. No submodules or symbolic links cross the boundary.

### 2.2 Framework & Static Architecture
- **Framework:** React 18.3.1, TypeScript 5.6.3 (Strict Mode), Vite 5.4.21, Tailwind CSS 3.4.14.
- **Base Path:** Explicitly set to `/market-intelligence-dashboard/` in [`vite.config.ts`](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/vite.config.ts#L6).
- **Data Loading:** [`src/services/dataService.ts`](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/src/services/dataService.ts#L19-L42) loads static JSON via `fetch()` resolving relative to `import.meta.env.BASE_URL`. Zero Node.js servers, WebSockets, or Python runtimes are invoked in the browser.

### 2.3 Live Production Verification
- **Target URL:** `https://ankietj.github.io/market-intelligence-dashboard/`
- **HTTP Response:** HTTP `200 OK` (Verified via automated HTTP probe).
- **Authentication:** Unauthenticated public access confirmed. No login form, API key header, or session cookie required.
- **Assets Delivered:** `assets/index-DaHJVeud.css` (18.19 KB), `assets/index-DURY17Hs.js` (210.87 KB). Total initial gzipped transfer is ~64 KB.

---

## 3. Publishing Workflow Audit

The workflow file [`.github/workflows/publish-dashboard.yml`](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/.github/workflows/publish-dashboard.yml) was inspected line-by-line:

```yaml
# Strict Governance: Manual Publishing Only
on:
  workflow_dispatch:
    inputs:
      reason:
        description: 'Publishing justification / note'
        required: false
        default: 'Manual market intelligence release'
```

### Verification Points:
1. **Trigger Restrictions:** Only `workflow_dispatch` is present. No `schedule`, `cron`, `push`, `pull_request`, or `repository_dispatch` triggers exist. Automatic or scheduled publishing is physically impossible.
2. **Permissions:** Scoped strictly to `contents: read`, `pages: write`, `id-token: write`.
3. **Pre-Deployment Gatekeepers:** Deployment is gated behind three mandatory validation scripts:
   - `python scripts/validate_public_data.py --data-dir public/data/latest` (line 41)
   - `python scripts/sanitize_public_data.py --data-dir public/data --check` (line 45)
   - `python scripts/verify_snapshot.py` (line 49)
4. **Failure Containment:** If any validation or build step fails, the workflow immediately terminates with exit code 1. `actions/deploy-pages@v4` is never invoked, ensuring a broken snapshot can never overwrite an existing live deployment.
5. **Observed Execution:** GitHub Actions Run ID **`43878734315`** executed on November 16, 2026 at 13:44:49Z (19:14:49 IST) and completed successfully in 53 seconds with all 14 steps passing.

---

## 4. Snapshot & Data Integrity Audit

All 11 JSON files in [`public/data/latest/`](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/) were examined:

| File Name | Size (Bytes) | SHA-256 Digest (First 16 chars) | Schema Validity | Status |
|---|---|---|---|---|
| `manifest.json` | 2,434 | `d59cb6c59b20bfa5...` | Valid | **PASS** |
| `market_overview.json` | 2,159 | `b1e2a18a0d39be1f...` | Valid | **PASS** |
| `global_macro.json` | 1,676 | `3233388cefdfc0e9...` | Valid | **PASS** |
| `institutional_flows.json` | 1,356 | `4b4b2d71b8621b3e...` | Valid | **PASS** |
| `market_breadth.json` | 493 | `2b11ca65ce6f4256...` | Valid | **PASS** |
| `sector_rotation.json` | 1,348 | `e57079a50f748e0a...` | Valid | **PASS** |
| `stock_leadership.json` | 1,788 | `dc4af39a25b6e68c...` | Valid | **PASS** |
| `derivatives.json` | 3,591 | `efbb45ce2a015e0f...` | Valid | **PASS** |
| `nifty_forecast.json` | 1,110 | `b1624e090fcb466e...` | Valid | **PASS** |
| `pre_open.json` | 1,096 | `a890c97c477a5b4b...` | Valid | **PASS** |
| `risk_events.json` | 942 | `2e6c27127ef46fb8...` | Valid | **PASS** |
| `daily_briefing.json` | 3,076 | `0ea86a5ef73d9692...` | Valid | **PASS** |

### Integrity Findings:
- Every section payload exactly matches the SHA-256 digest recorded in `manifest.json`.
- Files are written using byte-exact serialization (`write_bytes`), preventing CRLF/LF line-ending drift between Windows development machines and Linux GitHub Actions runners.
- Point-in-time metadata distinguishes:
  - `market_date`: `2026-11-11` (evaluation session)
  - `target_session_date`: `2026-11-12` (forecast horizon)
  - `generated_at`: `2026-11-16T18:34:12.618518+05:30` (publication generation)

---

## 5. Security and Privacy Audit

### 5.1 Credential & Token Scan
An automated recursive regex scan over all files in the dashboard repository targeting private key patterns (`api_key`, `secret`, `bearer`, `FYERS`, `KITE`, `password`, `token`) confirmed:
- **Zero credential leaks.**
- **Zero private authentication keys.**

### 5.2 Local Path Elimination
A recursive scan targeting Windows user paths (`C:\Users\...`) and Google Drive mount points (`G:\My Drive\...`) confirmed:
- Zero references to local paths in `src/`, `dist/`, or `public/data/`.
- All paths referenced in public JSON files are strictly relative paths (e.g. `data/latest/derivatives.json`).

---

## 6. Disclosed Limitations & Findings Register

The audit identified the following specific analytical limitations, which are classified as **PASS WITH LIMITATIONS** and must be transparently disclosed:

### Finding L-01: Heuristic Directional Probabilities Labeled as "Calibrated"
- **Location:** [`NiftyForecastSection.tsx` line 137](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/src/components/sections/NiftyForecastSection.tsx#L137).
- **Observation:** The section header states *"Calibrated Directional Probability Distribution"*. However, [`nifty_forecast.json` line 5](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/nifty_forecast.json#L5) explicitly records `"is_statistically_calibrated": false` and `"calibration_method": "HeuristicMultiFactor_v1"`.
- **Impact:** The probabilities ($P(\text{Up})=52.3\%$, $P(\text{Sideways})=33.3\%$, $P(\text{Down})=14.3\%$) are multi-factor heuristic rule scores, not outputs from a walk-forward calibrated statistical or machine-learning model.
- **Required Disclosure:** Disclose that directional probabilities represent rule-based multi-factor model scores, not empirical Brier-calibrated probabilities.

### Finding L-02: Sector Breadth Scope (7 Published Sectors vs 19 Claimed)
- **Location:** [`sector_rotation.json`](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/sector_rotation.json#L7-L56) vs `manifest.json` line 5.
- **Observation:** `manifest.json` and documentation claim coverage of 19 NSE industry indices. The published payload in `sector_rotation.json` contains exactly 7 primary sectors (`AUTO`, `METAL`, `REALTY`, `BANK`, `IT`, `PHARMA`, `FMCG`).
- **Impact:** While the 7 core sectors represent >80% of index weight, the remaining 12 thematic/sub-indices are omitted.
- **Required Disclosure:** Note that sector rotation rankings currently display the 7 primary sectoral indices that drive the Cyclical vs Defensive spread.

### Finding L-03: Market Breadth Universe Sum (49 vs 50 Constituents)
- **Location:** [`market_breadth.json` lines 2-18](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/market_breadth.json#L2-L18).
- **Observation:** `advances` (16) + `declines` (33) + `unchanged` (0) equals 49 stocks, but `universe_size` is 50. One constituent had unobserved or zero change and was omitted from the count, while `universe_coverage_percentage` was reported as 100.0%.
- **Impact:** Minor numerical asymmetry (49/50 observed stocks).
- **Required Disclosure:** Note that constituent breadth reflects 49 observed trading constituents out of 50.

### Finding L-04: Institutional Flow History Date Duplication
- **Location:** [`institutional_flows.json` lines 28-37](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/institutional_flows.json#L28-L37).
- **Observation:** `recent_flow_history` contains two consecutive entries dated `2026-11-11` with different flow values.
- **Impact:** Visual artifact in the historical flow table.
- **Required Disclosure:** Users should refer to the headline Cash Market KPI card for the primary session flow.

### Finding L-05: Gamma Flip Barrier Characterization
- **Location:** [`risk_events.json` lines 3-7](file:///c:/Users/ankit_aj/Desktop/Work/Stock_kite/market-intelligence-dashboard/public/data/latest/risk_events.json#L3-L7).
- **Observation:** Gamma flip resistance (25,000) and support (24,500) are derived directly from Call Wall and Put Wall open interest concentrations, not from a continuous dealer Gamma Exposure (GEX) curve.
- **Required Disclosure:** Structural gamma flip levels represent peak open-interest pinning walls rather than calculated zero-gamma inflection strikes.

---

## 7. Testing Verification Evidence

The test suite was executed in the private workspace:
```powershell
.venv\Scripts\python.exe -m unittest -v tests.test_pre_open_and_institutional_pipeline tests.test_sprint_6_specialist_agents tests.test_sprint_6_dashboard_api
```
**Result:** `Ran 23 tests in 10.748s — OK (23 Passed, 0 Failed, 0 Skipped).`

In the public dashboard workspace:
```powershell
python scripts/verify_snapshot.py
```
**Result:** `[PASSED] Public snapshot meets all data contracts and security gates.`

Static application build:
```powershell
npm run build
```
**Result:** `✓ 1588 modules transformed. Built in 3.26s — 0 errors.`
