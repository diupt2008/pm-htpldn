#!/usr/bin/env python3
"""PreToolUse hook: enforce ✅ task = 100% scope done (không PARTIAL/DEFER).

Trigger: Edit/Write/MultiEdit on tasks/todo.md.

Logic:
  1. Lấy full content sau apply edit.
  2. Trong section `## Round 6 — Active task tracker`, tìm task lines `- ✅ **R6.X.Y** ...`.
  3. Đọc dòng `**Kết quả:**` ngay sau (1-5 dòng kế).
  4. BLOCK nếu Kết quả chứa keyword PARTIAL hoặc DEFER (case-insensitive, word boundary).

Lý do: ✅ = 100% scope done. Có PARTIAL/DEFER = TC chưa chạy được, task chưa
hoàn thành → phải ⚠️ (theo convention R6.7.10/R6.7.17).

Áp dụng từ 2026-05-05 sau Strict Pass Review:
  3 task fake-✅ (R6.7.1/R6.7.4/R6.4.A1.5) đã flip ⚠️ — đều có PARTIAL/DEFER
  trong Kết quả nhưng vẫn đánh ✅ vì "không bug".

Exit 2 = block + show stderr to Claude.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

DONE_TASK_LINE = re.compile(r"^\s*-\s+✅\s+\*\*(R6\.[0-9A-Za-z.\-]+)\*\*")
NEXT_TASK_LINE = re.compile(r"^\s*-\s+(✅|🟢|🔵|⚠️|🚫|⏳)\s+\*\*R6")
RESULT_KEY = "**Kết quả"
FORBIDDEN = re.compile(r"\b(PARTIAL|DEFER)\b", re.IGNORECASE)

ACTIVE_SECTION_START = "## Round 6 — Active task tracker"
ACTIVE_SECTION_END_PATTERNS = ("# 📚 Round 5", "## Tiến độ Round 5")


def is_target_file(path: str) -> bool:
    return path.endswith("/todo.md") or Path(path).name == "todo.md"


def apply_edit(original: str, old: str, new: str, replace_all: bool) -> str:
    if replace_all:
        return original.replace(old, new)
    return original.replace(old, new, 1) if old in original else original + "\n" + new


def get_full_content(tool_name: str, tool_input: dict):
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


def get_active_section(content: str) -> str:
    start = content.find(ACTIVE_SECTION_START)
    if start == -1:
        return ""
    section = content[start:]
    for marker in ACTIVE_SECTION_END_PATTERNS:
        idx = section.find(marker)
        if idx != -1:
            return section[:idx]
    return section


def find_violations(section: str):
    """Return list of (task_id, result_line_truncated)."""
    violations = []
    lines = section.splitlines()
    for i, line in enumerate(lines):
        m = DONE_TASK_LINE.match(line)
        if not m:
            continue
        task_id = m.group(1)
        # Scan up to 5 sub-lines for **Kết quả:**, stop at next task / new section
        for j in range(i + 1, min(i + 6, len(lines))):
            sub = lines[j]
            if NEXT_TASK_LINE.match(sub):
                break
            stripped = sub.strip()
            if stripped.startswith("##") or stripped.startswith("###") or stripped.startswith("####"):
                break
            if RESULT_KEY in sub:
                if FORBIDDEN.search(sub):
                    text = stripped if len(stripped) <= 140 else stripped[:140] + "..."
                    violations.append((task_id, text))
                break
    return violations


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0
    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    if tool_name not in ("Edit", "Write", "MultiEdit"):
        return 0
    content = get_full_content(tool_name, tool_input)
    if content is None:
        return 0
    section = get_active_section(content)
    if not section:
        return 0
    violations = find_violations(section)
    if not violations:
        return 0

    lines = [
        "❌ todo.md task ✅ vi phạm rule '✅ = 100% scope done' (Strict Pass Review 2026-05-05):",
        "",
    ]
    for task_id, result in violations:
        lines.append(f"  {task_id}: {result}")
    lines += [
        "",
        "Rule: ✅ = mọi TC PASS, không PARTIAL/DEFER pending.",
        "  Có PARTIAL/DEFER chưa close → flip ⚠️ (cùng convention R6.7.10/R6.7.17).",
        "",
        "Convention:",
        "  ✅: PASS X/X, không bug, không pending.",
        "  ⚠️: PARTIAL/DEFER ≥1 TC, hoặc bug Open, hoặc PASS X/Y với X<Y.",
        "  🚫: blocked spec/cascade.",
        "",
        "Fix: flip ✅ → ⚠️ + bracket [~N% — ...] HOẶC rewrite Kết quả không có PARTIAL/DEFER.",
    ]
    print("\n".join(lines), file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
