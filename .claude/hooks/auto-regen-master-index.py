#!/usr/bin/env python3
"""PostToolUse hook: auto-regen bảng Module index trong tasks/todo.md.

Trigger: PostToolUse Edit/Write/MultiEdit trên `tasks/todo-<module>.md`.
KHÔNG trigger trên `tasks/todo.md` (master) để tránh recursion vô hạn.

Logic:
  1. Path filter: match `/tasks/todo-<module>.md` ONLY.
  2. Run `python3 tools/build-master-index.py --write` qua subprocess.
  3. Exit 0 dù subprocess fail (informational, không block tester).

Áp dụng từ 2026-05-08 sau khi tách todo.md → 20 module file.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

# Match ONLY module file `todo-<module>.md`, KHÔNG match master `todo.md`.
# Lý do: build-master-index.py ghi vào todo.md → nếu hook trigger trên master sẽ recurse.
MODULE_FILE_RE = re.compile(r"/tasks/todo-[\w-]+\.md$")

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPT = REPO_ROOT / "tools" / "build-master-index.py"


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
        print(f"[auto-regen-master-index] script không tồn tại: {SCRIPT}", file=sys.stderr)
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
        print("[auto-regen-master-index] timeout 10s — skip", file=sys.stderr)
        return 0
    except Exception as e:
        print(f"[auto-regen-master-index] failed: {e}", file=sys.stderr)
        return 0

    if result.returncode != 0:
        print(
            f"[auto-regen-master-index] ⚠️ regen failed (rc={result.returncode}):\n"
            f"  stderr: {result.stderr.strip()[:200]}",
            file=sys.stderr,
        )
        return 0

    # Silent success — chỉ in nếu có thay đổi
    msg = result.stderr.strip() or "✅ master regenerated"
    module_name = Path(file_path).stem.replace("todo-", "")
    print(f"[auto-regen-master-index] {module_name} edited → {msg}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
