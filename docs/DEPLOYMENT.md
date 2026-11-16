# GitHub Pages Deployment Guide

## 1. Prerequisites

1. A GitHub repository named `market-intelligence-dashboard` under your account (`ankietj`).
2. GitHub Pages enabled in the repository settings:
   - Go to **Settings** -> **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

---

## 2. Vite Base Path Configuration

In `vite.config.ts`, the base path must match the repository name:
```typescript
export default defineConfig({
  base: '/market-intelligence-dashboard/',
  // ...
});
```

This ensures all static CSS, JS chunks, images, and JSON endpoints resolve properly under `https://ankietj.github.io/market-intelligence-dashboard/`.

---

## 3. GitHub Actions Pages Permissions

Ensure the workflow file `.github/workflows/publish-dashboard.yml` has:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

This allows the runner to deploy directly to the GitHub Pages environment without external tokens.
