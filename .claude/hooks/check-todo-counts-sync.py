#!/usr/bin/env python3
"""PreToolUse hook: enforce todo.md bảng tổng phải khớp với chi tiết task.

Trigger: Edit/Write/MultiEdit on tasks/todo.md.
Logic:
  1. Đọc full content sau khi áp Edit (cho Edit/MultiEdit) hoặc content mới (Write).
  2. Parse bảng `## Tiến độ Round 6` — extract row `**Tổng Round 6**` counts (✅ 🟢 🔵 ⚠️ 🚫 ⏳).
  3. Parse section `## Round 6 — Active task tracker` đến hết file (hoặc đến `# 📚 Round 5`),
     đếm icon trong task lines `- <icon> **R6.X.Y**`.
  4. So sánh. Nếu mismatch hoặc tổng ≠ sum → exit 2 với chi tiết.

Áp dụng từ 2026-05-02 sau drift bảng tổng (R6.4.A3 ✅ chi tiết nhưng bảng tổng ⚠️;
R6.4.A4/A5/B2/C1 dep PASS nhưng vẫn ⏳).

Exit 2 = block + show stderr to Claude.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

TARGET_FILES = ("todo.md",)
ICONS = ("✅", "🟢", "🔵", "⚠️", "🚫", "⏳")

# Match table summary row: `| **Tổng Round 6** | | **50** | **28** | **9** | **0** | **2** | **0** | **11** | ...`
SUMMARY_ROW = re.compile(
    r"\|\s*\*\*Tổng Round 6\*\*\s*\|[^|]*\|\s*\*\*(\d+)\*\*\s*"
    r"\|\s*\*\*(\d+)\*\*\s*"  # ✅
    r"\|\s*\*\*(\d+)\*\*\s*"  # 🟢
    r"\|\s*\*\*(\d+)\*\*\s*"  # 🔵
    r"\|\s*\*\*(\d+)\*\*\s*"  # ⚠️
    r"\|\s*\*\*(\d+)\*\*\s*"  # 🚫
    r"\|\s*\*\*(\d+)\*\*\s*"  # ⏳
)

# Match task line: `- ✅ **R6.4.A1** ...` or `- 🟢 **R6.4.B5b** ...`
TASK_LINE = re.compile(r"^\s*-\s+(✅|🟢|🔵|⚠️|🚫|⏳)\s+\*\*(R6\.[0-9A-Za-z.\-]+)\*\*")

ACTIVE_SECTION_START = "## Round 6 — Active task tracker"
ACTIVE_SECTION_END_PATTERNS = ("# 📚 Round 5", "## Tiến độ Round 5")


def is_target_file(path: str) -> bool:
    return path.endswith("/todo.md") or path.endswith("\\todo.md") or Path(path).name == "todo.md"


def apply_edit(original: str, old: str, new: str, replace_all: bool) -> str:
    if replace_all:
        return original.replace(old, new)
    return original.replace(old, new, 1) if old in original else original + "\n" + new


def get_full_content(tool_name: str, tool_input: dict) -> "str | None":
    file_path = tool_input.get("file_path", "")
    if not is_target_file(file_path):
        return None

    if tool_name == "Write":
        return tool_input.get("content", "")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            original = f.read()
    except FileNotFoundError:
        return tool_input.get("new_string", "") if tool_name == "Edit" else ""

    if tool_name == "Edit":
        return apply_edit(
            original,
            tool_input.get("old_string", ""),
            tool_input.get("new_string", ""),
            tool_input.get("replace_all", False),
        )
    if tool_name == "MultiEdit":
        result = original
        for e in tool_input.get("edits", []):
            result = apply_edit(
                result,
                e.get("old_string", ""),
                e.get("new_string", ""),
                e.get("replace_all", False),
            )
        return result
    return None


def parse_summary(content: str) -> dict | None:
    m = SUMMARY_ROW.search(content)
    if not m:
        return None
    total, done, ready, doing, partial, blocked, waiting = map(int, m.groups())
    return {
        "total": total,
        "✅": done,
        "🟢": ready,
        "🔵": doing,
        "⚠️": partial,
        "🚫": blocked,
        "⏳": waiting,
    }


def count_actual_icons(content: str) -> dict:
    start = content.find(ACTIVE_SECTION_START)
    if start == -1:
        # No active section — skip check
        return {}
    section = content[start:]
    for end_marker in ACTIVE_SECTION_END_PATTERNS:
        idx = section.find(end_marker)
        if idx != -1:
            section = section[:idx]
            break

    counts = {icon: 0 for icon in ICONS}
    seen_ids = set()
    for line in section.splitlines():
        m = TASK_LINE.match(line)
        if not m:
            continue
        icon, task_id = m.group(1), m.group(2)
        if task_id in seen_ids:
            continue
        seen_ids.add(task_id)
        counts[icon] += 1
    counts["total"] = sum(counts[icon] for icon in ICONS)
    return counts


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {})
    if tool_name not in ("Edit", "Write", "MultiEdit"):
        return 0

    content = get_full_content(tool_name, tool_input)
    if content is None:
        return 0

    summary = parse_summary(content)
    if not summary:
        return 0  # No summary table — nothing to check

    actual = count_actual_icons(content)
    if not actual:
        return 0  # No active section — nothing to check

    mismatches = []
    for icon in ICONS:
        if summary[icon] != actual[icon]:
            mismatches.append(f"  {icon}: bảng tổng={summary[icon]} ≠ chi tiết={actual[icon]}")
    if summary["total"] != actual["total"]:
        mismatches.append(f"  Tổng: bảng tổng={summary['total']} ≠ chi tiết={actual['total']}")

    sum_of_icons = sum(summary[icon] for icon in ICONS)
    if sum_of_icons != summary["total"]:
        mismatches.append(
            f"  Bảng tổng nội bộ sai: {summary['✅']}+{summary['🟢']}+{summary['🔵']}+{summary['⚠️']}+{summary['🚫']}+{summary['⏳']}={sum_of_icons} ≠ Tổng {summary['total']}"
        )

    if mismatches:
        sys.stderr.write(
            "❌ todo.md bảng tổng KHÔNG khớp chi tiết task list:\n"
            + "\n".join(mismatches)
            + "\n\nFix: recount icon từ section '## Round 6 — Active task tracker' và update bảng `Tổng Round 6` cho khớp.\n"
            + "Đồng thời update 3 section 'Đã xong / Sẵn sàng / Chờ upstream' nếu cần.\n"
        )
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
