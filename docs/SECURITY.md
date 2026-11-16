# Security & Data Sanitization Policy

## 1. Public Accessibility Gate

The `market-intelligence-dashboard` repository and its GitHub Pages deployment are completely public. Anyone with the URL can view all published assets.

Consequently, **security is enforced before publication**, at the exporter and GitHub Actions workflow level.

---

## 2. Mandatory Sanitization Checks

Every publication run must pass two automated gatekeeper scripts:

1. **`python scripts/validate_public_data.py`**
   - Validates JSON against `schemas/public_snapshot.schema.json`.
   - Confirms that all 11 section files exist.
   - Verifies SHA-256 cryptographic digests against `manifest.json`.
2. **`python scripts/sanitize_public_data.py --check`**
   - Scans every JSON file for forbidden key patterns (`api_key`, `token`, `secret`, `password`, `credential`, `auth_code`).
   - Scans every JSON value for private path patterns (`C:\Users\...`, `/home/...`).
   - Fails the build immediately if any violation is detected.

---

## 3. GitHub Actions Least-Privilege Permissions

The GitHub Actions workflow `.github/workflows/publish-dashboard.yml` operates under least privilege:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

- No write access to any other repositories.
- No repository administration permissions.
- Concurrency group `pages` with `cancel-in-progress: false` prevents corrupted or half-deployed static releases.

---

## 4. Rollback & Incident Response

If an erroneous or stale snapshot is published:
1. Re-run the manual publishing workflow with an updated snapshot.
2. Alternatively, restore the previous dated snapshot from `public/data/history/<date>/` and commit to `main`.
