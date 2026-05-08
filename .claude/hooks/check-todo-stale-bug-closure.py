#!/usr/bin/env python3
"""PostToolUse hook: warn task ⚠️/🚫 có dòng `**Bug:**` đã N/N đóng → cân nhắc flip ✅.

Trigger: After Edit/Write/MultiEdit on tasks/todo.md.

Logic warn-only (KHÔNG auto-flip):
  1. Read file todo.md.
  2. Tìm task line: `- <⚠️|🚫> **R{X}.{Y}** ...`.
  3. Scan ≤15 lines tiếp (hoặc dừng ở task line sau) tìm `**Bug:**` line.
  4. Parse pattern `(\d+)/(\d+)\s*đóng` trên dòng Bug.
  5. Nếu X == Y (all closed) AND total > 0 → flag warning.
  6. Print stderr; exit 0 (không block).

Lý do warn-only: quyết flip ⚠️→✅ subjective:
  - Bug Closed nhưng Kết quả còn FAIL/Sai spec component khác → giữ ⚠️
  - Minor defer remaining → flip ✅ kèm note OK
  - Tester quyết, hook chỉ remind theo principle "tester tự quyết" trong CLAUDE.md.

Áp dụng từ 2026-05-08 sau gap phát hiện R7.0.2 + R7.0.6 + R7.7.8c + R7.7.8e
  stale ⚠️ qua nhiều round dù bugs all Closed.
"""
from __future__ import annotations

import json
import re
import sys

ICONS_TO_CHECK = ("⚠️", "🚫")
TASK_ID_RE = r"R\d+\.[0-9A-Za-z.\-]+"
SCAN_MAX_LINES = 15  # scan max N lines after task header tìm **Bug:** line


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
    if not (file_path.endswith("/todo.md") or "/tasks/todo.md" in file_path):
        return 0

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception:
        return 0

    icon_alt = "|".join(re.escape(i) for i in ICONS_TO_CHECK)
    task_pat = re.compile(
        rf"^-\s+({icon_alt})\s+(?:<a id=\"[^\"]+\"></a>)?\*\*({TASK_ID_RE})\*\*"
    )
    # Match any task line (any icon) — dùng để dừng scan khi gặp task tiếp theo
    any_task_pat = re.compile(
        rf"^-\s+(?:✅|🟢|🔵|⚠️|🚫|⏳)\s+(?:<a id=\"[^\"]+\"></a>)?\*\*{TASK_ID_RE}\*\*"
    )
    bug_pat = re.compile(r"\*\*Bug:\*\*[^\n]*?(\d+)\s*/\s*(\d+)\s*đóng", re.IGNORECASE)

    lines = text.split("\n")
    flagged = []

    for i, line in enumerate(lines):
        m = task_pat.match(line)
        if not m:
            continue
        icon = m.group(1)
        task_id = m.group(2)

        # Scan các dòng tiếp theo tìm **Bug:** line
        for j in range(i + 1, min(i + 1 + SCAN_MAX_LINES, len(lines))):
            sub = lines[j]
            # Dừng nếu gặp task line khác
            if any_task_pat.match(sub):
                break
            bm = bug_pat.search(sub)
            if bm:
                closed = int(bm.group(1))
                total = int(bm.group(2))
                if total > 0 and closed == total:
                    flagged.append((task_id, icon, closed, total))
                break  # mỗi task chỉ check Bug line đầu tiên

    if not flagged:
        return 0

    msg = [
        f"[check-todo-stale-bug-closure] ⚠️ {len(flagged)} task có ALL bugs đóng nhưng icon chưa flip:"
    ]
    for tid, icon, closed, total in flagged:
        msg.append(
            f"  {icon} {tid}: {closed}/{total} bugs đóng "
            f"→ cân nhắc flip ✅ (nếu Kết quả PASS) hoặc giữ ⚠️ (nếu Kết quả còn FAIL/Sai spec)."
        )
    msg += [
        "",
        "Rule: bug Closed nhưng icon ⚠️/🚫 → tester verify Kết quả + flip nếu PASS clean.",
        "Skip flip nếu Kết quả còn FAIL/Sai spec/Open Major thật, hoặc cần re-test trước.",
        "(Hook warn-only — KHÔNG auto-flip. 'Minor defer = ✅ OK' là judgment subjective.)",
    ]
    print("\n".join(msg), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
