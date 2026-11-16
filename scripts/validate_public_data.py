"""Validates public data snapshots against contracts, schemas, and checksums."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Dict, List, Any

REQUIRED_SECTION_FILES = [
    "market_overview.json",
    "global_macro.json",
    "institutional_flows.json",
    "market_breadth.json",
    "sector_rotation.json",
    "stock_leadership.json",
    "derivatives.json",
    "nifty_forecast.json",
    "pre_open.json",
    "risk_events.json",
    "daily_briefing.json",
]


def validate_snapshot(data_dir: Path) -> Tuple[bool, List[str]]:
    errors: List[str] = []

    # 1. Manifest Existence
    manifest_file = data_dir / "manifest.json"
    if not manifest_file.exists():
        errors.append(f"Missing required manifest file at {manifest_file}")
        return False, errors

    try:
        manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    except Exception as e:
        errors.append(f"Failed to parse manifest.json: {e}")
        return False, errors

    # 2. Check required manifest keys
    for req_key in [
        "schema_version",
        "snapshot_id",
        "market_date",
        "target_session_date",
        "generated_at",
        "sections",
        "file_hashes",
    ]:
        if req_key not in manifest:
            errors.append(f"Manifest missing required key: {req_key}")

    # 3. Check section files existence and SHA-256 hashes
    file_hashes = manifest.get("file_hashes", {})
    for sec_file in REQUIRED_SECTION_FILES:
        fp = data_dir / sec_file
        if not fp.exists():
            errors.append(f"Missing required section file: {sec_file}")
            continue

        try:
            content = fp.read_bytes()
            actual_sha = hashlib.sha256(content).hexdigest()
            # If present in manifest file_hashes, verify match
            if sec_file in file_hashes:
                expected_sha = file_hashes[sec_file]
                if actual_sha != expected_sha:
                    errors.append(f"SHA-256 mismatch for {sec_file}: expected {expected_sha[:12]}, got {actual_sha[:12]}")
            
            # Verify valid JSON
            parsed = json.loads(content.decode("utf-8"))
            if not isinstance(parsed, dict):
                errors.append(f"Section {sec_file} root must be a JSON object.")
        except Exception as e:
            errors.append(f"Error reading/parsing {sec_file}: {e}")

    # 4. Check Date formats
    date_regex = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    if "market_date" in manifest and not date_regex.match(manifest["market_date"]):
        errors.append(f"Invalid market_date format: {manifest['market_date']}")
    if "target_session_date" in manifest and not date_regex.match(manifest["target_session_date"]):
        errors.append(f"Invalid target_session_date format: {manifest['target_session_date']}")

    return (len(errors) == 0, errors)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Validate Public Market Intelligence Data")
    parser.add_argument("--data-dir", type=str, default="public/data/latest", help="Path to latest data directory")
    args = parser.parse_args()

    target_dir = Path(args.data_dir)
    print(f"[*] Validating public snapshot in: {target_dir.resolve()}...")
    success, issues = validate_snapshot(target_dir)

    if success:
        print("[SUCCESS] All 11 public data files and manifest successfully verified against contract.")
        sys.exit(0)
    else:
        print("[FAILURE] Snapshot validation encountered errors:")
        for err in issues:
            print(f"  - {err}")
        sys.exit(1)
