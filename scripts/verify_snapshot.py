"""End-to-end verification script for public snapshot release readiness."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main():
    root = Path(__file__).resolve().parent.parent
    scripts_dir = root / "scripts"

    print("=" * 65)
    print("  MARKET INTELLIGENCE DASHBOARD - RELEASE VERIFICATION SUITE")
    print("=" * 65)

    # 1. Run Data Validation
    val_cmd = [sys.executable, str(scripts_dir / "validate_public_data.py"), "--data-dir", str(root / "public/data/latest")]
    print("\n[Step 1/2] Running Schema & Checksum Validation...")
    res1 = subprocess.run(val_cmd, cwd=str(root))
    if res1.returncode != 0:
        print("[FAIL] Schema and checksum validation failed.")
        sys.exit(1)

    # 2. Run Sanitization & Leak Check
    san_cmd = [sys.executable, str(scripts_dir / "sanitize_public_data.py"), "--data-dir", str(root / "public/data"), "--check"]
    print("\n[Step 2/2] Running Security & Privacy Sanitization Audit...")
    res2 = subprocess.run(san_cmd, cwd=str(root))
    if res2.returncode != 0:
        print("[FAIL] Sanitization audit detected credential or private path leaks.")
        sys.exit(1)

    print("\n" + "=" * 65)
    print(" [PASSED] Public snapshot meets all data contracts and security gates.")
    print("=" * 65)


if __name__ == "__main__":
    main()
