# Public Data Contract & Provenance Specification

## 1. Schema Versioning

All published public JSON files adhere to **Schema Version 1.0**.

Every file contains top-level metadata:
```json
{
  "schema_version": "1.0",
  "market_date": "YYYY-MM-DD",
  "generated_at": "ISO-8601 Timestamp"
}
```

---

## 2. Metric Standards & Units

To ensure institutional analytical integrity:

1. **Currency:** Indian Rupees (INR), clearly formatted as `₹` with explicit suffixes (`Cr` for INR Crores).
2. **Commodities & FX:**
   - Brent Crude: USD per barrel (`$/bbl`).
   - USD/INR: Spot rate in INR.
   - US 10-Year Yield: Nominal yield percentage (`%`) with 1-day change in basis points (`bps`).
   - Dollar Index (DXY): Index points.
3. **Index Futures & Derivatives:**
   - Open Interest (OI): Number of contracts.
   - Put-Call Ratio (PCR): Dimensionless ratio ($\ge 0.0$).
   - Strike Prices: Rounded to the nearest 50-point exchange strike increment.
4. **Probabilities:**
   - Directional probabilities ($P_{\text{Up}}$, $P_{\text{Down}}$, $P_{\text{Sideways}}$) strictly sum to $1.0$ ($100\%$).
   - Stated as calibrated only when evaluated against historical Brier scores; otherwise denoted as rule heuristics.

---

## 3. Provenance & Point-in-Time Classifications

In strict accordance with the quantitative platform's rules:
- **`VERIFIED`**: Directly retrieved from authoritative exchange records or canonical Parquet datastores with full point-in-time adherence.
- **`ESTIMATED`**: Calculated via standard exchange schedule convention or statistical model.
- **`STALE`**: Observation timestamp older than expected session publishing cutoff.
- **`UNAVAILABLE`**: Explicitly declared when exchange data is offline or unobservable; never replaced with fabricated samples.

---

## 4. Allowlist & Privacy Rules

The public data contract strictly prohibits:
- Any file path containing local drive letters or usernames (`C:\Users\...`).
- Any API token, session token, or secret key.
- Raw un-aggregated tick data or personal tradebook records.
- Any unverified fundamental forecasts.
