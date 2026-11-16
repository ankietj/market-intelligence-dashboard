# Manual Publishing Guide 🚀

## 1. Governance Policy: Manual Publishing Only

The Market Intelligence Dashboard uses **strictly manual publishing**. There are no automated cron jobs, scheduled midnight triggers, or unmonitored intraday refreshes.

Every release requires deliberate human initiation.

---

## 2. Step-by-Step Publishing Workflow

### Step 1: Export Snapshot from Local Intelligence Platform
In `swing-trading-system`:
```bash
# Generate and sanitize latest public snapshot into market-intelligence-dashboard
python -m market_intelligence.export.public_snapshot_exporter --export-dir "../market-intelligence-dashboard/public/data"
```

### Step 2: Verify Snapshot Integrity Locally
In `market-intelligence-dashboard`:
```bash
python scripts/verify_snapshot.py
```
Ensure output reports:
`[PASSED] Public snapshot meets all data contracts and security gates.`

### Step 3: Commit and Push Snapshot to Main
```bash
git add public/data/
git commit -m "data: publish market intelligence snapshot for YYYY-MM-DD"
git push origin main
```

### Step 4: Trigger GitHub Pages Deployment
1. Open the repository on GitHub:
   `https://github.com/ankietj/market-intelligence-dashboard`
2. Click on the **Actions** tab.
3. In the left sidebar, select **Publish Market Intelligence Dashboard**.
4. Click the **Run workflow** dropdown button on the right.
5. (Optional) Provide a publication note (e.g., `Post-market close briefing for 2026-11-16`).
6. Click **Run workflow**.

---

## 3. Monitoring Publication Results

1. The workflow will run in ~1-2 minutes:
   - Validates JSON schema and file checksums.
   - Runs privacy and security audits.
   - Compiles static React/TypeScript assets (`npm run build`).
   - Deploys the `dist/` directory to GitHub Pages.
2. Once the green checkmark appears, open the public URL:
   👉 **[https://ankietj.github.io/market-intelligence-dashboard/](https://ankietj.github.io/market-intelligence-dashboard/)**
3. Verify that the header displays the expected market date and snapshot ID.
