#!/usr/bin/env python3
"""PostToolUse hook: auto-regen bảng "Tổng hợp module" trong todo-<module>.md.

Trigger: PostToolUse Edit/Write/MultiEdit trên `tasks/todo-<module>.md`.
KHÔNG trigger trên `tasks/todo.md` (master) để tránh nhầm scope.

Logic:
  1. Path filter: match `/tasks/todo-<module>.md` ONLY.
  2. Run `python3 tools/build-module-summaries.py --write` qua subprocess.
     Tool idempotent + chỉ write nếu content đổi → ko gây recursion (subprocess
     write trực tiếp filesystem, ko qua Edit tool → ko trigger PostToolUse).
  3. Exit 0 dù subprocess fail (informational, không block tester).

Áp dụng từ 2026-05-08 sau khi thêm bảng Tổng hợp module vào 20 file.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

MODULE_FILE_RE = re.compile(r"/tasks/todo-[\w-]+\.md$")

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = REPO_ROOT / "tools" / "build-module-summaries.py"


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    tool_name = payload.get("tool_name", "")
    if tool_name not in ("Edit", "Write", "MultiEdit"):
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")
    if not MODULE_FILE_RE.search(file_path):
        return 0

    if not SCRIPT.exists():
        print(f"[auto-regen-module-summary] script không tồn tại: {SCRIPT}", file=sys.stderr)
        return 0

    try:
        result = subprocess.run(
            ["/usr/bin/python3", str(SCRIPT), "--write"],
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            timeout=10,
        )
    except subprocess.TimeoutExpired:
        print("[auto-regen-module-summary] timeout 10s — skip", file=sys.stderr)
        return 0
    except Exception as e:
        print(f"[auto-regen-module-summary] failed: {e}", file=sys.stderr)
        return 0

    if result.returncode != 0:
        print(
            f"[auto-regen-module-summary] ⚠️ regen failed (rc={result.returncode}):\n"
            f"  stderr: {result.stderr.strip()[:200]}",
            file=sys.stderr,
        )
        return 0

    msg = result.stderr.strip() or "✅ module summary regenerated"
    module_name = Path(file_path).stem.replace("todo-", "")
    print(f"[auto-regen-module-summary] {module_name} edited → {msg}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
