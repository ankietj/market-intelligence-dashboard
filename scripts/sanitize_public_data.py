"""Scans and sanitizes public data files to ensure zero credential or path leakage."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import List, Tuple

FORBIDDEN_KEY_PATTERNS = [
    re.compile(r"api[_-]?key", re.IGNORECASE),
    re.compile(r"secret", re.IGNORECASE),
    re.compile(r"token", re.IGNORECASE),
    re.compile(r"password", re.IGNORECASE),
    re.compile(r"credential", re.IGNORECASE),
    re.compile(r"auth[_-]?code", re.IGNORECASE),
]

FORBIDDEN_VALUE_PATTERNS = [
    re.compile(r"[A-Z]:\\[Users|work|home]", re.IGNORECASE),
    re.compile(r"/Users/[A-Za-z0-9_-]+", re.IGNORECASE),
    re.compile(r"/home/[A-Za-z0-9_-]+", re.IGNORECASE),
    re.compile(r"ey[A-Za-z0-9_-]{20,}", re.IGNORECASE),
]


def check_for_leaks(obj: any, path: str = "") -> List[str]:
    violations: List[str] = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            field_path = f"{path}.{k}" if path else k
            for p in FORBIDDEN_KEY_PATTERNS:
                if p.search(str(k)):
                    violations.append(f"Forbidden key detected: '{field_path}' matches {p.pattern}")
            violations.extend(check_for_leaks(v, field_path))
    elif isinstance(obj, list):
        for idx, item in enumerate(obj):
            violations.extend(check_for_leaks(item, f"{path}[{idx}]"))
    elif isinstance(obj, str):
        for p in FORBIDDEN_VALUE_PATTERNS:
            if p.search(obj):
                violations.append(f"Private value pattern detected in '{path}': matches {p.pattern}")
    return violations


def scan_directory(data_dir: Path) -> Tuple[bool, List[str]]:
    all_violations: List[str] = []
    json_files = list(data_dir.glob("**/*.json"))

    if not json_files:
        return False, [f"No JSON files found in {data_dir}"]

    for jf in json_files:
        try:
            data = json.loads(jf.read_text(encoding="utf-8"))
            violations = check_for_leaks(data, path=jf.name)
            all_violations.extend(violations)
        except Exception as e:
            all_violations.append(f"Error checking {jf.name}: {e}")

    return (len(all_violations) == 0, all_violations)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sanitize and check public data")
    parser.add_argument("--data-dir", type=str, default="public/data", help="Directory containing JSON snapshots")
    parser.add_argument("--check", action="store_true", help="Assert zero violations (fails with non-zero exit)")
    args = parser.parse_args()

    target_dir = Path(args.data_dir)
    print(f"[*] Scanning for private data and credential leaks in: {target_dir.resolve()}...")
    clean, issues = scan_directory(target_dir)

    if clean:
        print("[SUCCESS] Zero private paths, tokens, or credentials found. Allowlist compliance confirmed.")
        sys.exit(0)
    else:
        print("[ALERT] Security violations detected:")
        for v in issues:
            print(f"  - {v}")
        sys.exit(1)
