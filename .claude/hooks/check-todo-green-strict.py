#!/usr/bin/env python3
"""PreToolUse hook: enforce todo.md task 🟢 phải full-ready, không partial-ready.

Trigger: Edit/Write/MultiEdit on tasks/todo.md.

Logic:
  1. Lấy full content sau apply edit.
  2. Trong section `## Round 6 — Active task tracker`, tìm task lines `- 🟢 **R6.X** ...`.
  3. Extract bracket `[...]` trên cùng dòng.
  4. BLOCK nếu bracket chứa:
     - phrase forbidden: "partial unblock", "partial ready", "partial scope",
       "defer khi", "defer cho", "defer until", "cascade"
     - icon upstream chưa ready: ⚠️, 🚫, ⏳

Áp dụng từ 2026-05-05 sau Strict Status Review:
  4 task fake-🟢 đã flip ⏳ — R6.5.1/R6.7.7/R6.7.13 (note "partial unblock"/"defer khi"
  + reference TVCS A5 ⚠️) + R6.E4 (note "chờ Cổng PLQG" + "data=0").
  Pattern: dùng 🟢 cho "1 phần scope unblock" thay vì "đủ scope ready" → vi phạm rule
  user CLAUDE.md "Trust state, not task icon".

Exit 2 = block + show stderr to Claude.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ICONS_BLOCKED_IN_GREEN_NOTE = ("⚠️", "🚫", "⏳")

FORBIDDEN_PATTERNS = [
    (re.compile(r"partial\s+(?:unblock|ready|scope)", re.IGNORECASE),
     "phrase 'partial unblock/ready/scope' = scope task chưa full ready"),
    (re.compile(r"defer\s+(?:khi|cho|until|sau\s+khi)", re.IGNORECASE),
     "phrase 'defer khi/cho/until' = phần scope chờ upstream"),
    (re.compile(r"\bcascade\b", re.IGNORECASE),
     "'cascade' = dep block từ upstream"),
]

GREEN_TASK_LINE = re.compile(
    r"^(\s*-\s+🟢\s+\*\*(R6\.[0-9A-Za-z.\-]+)\*\*[^\n]*)$",
    re.MULTILINE,
)
BRACKET_NOTE = re.compile(r"`\[([^\]]+)\]`")

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
    for end_marker in ACTIVE_SECTION_END_PATTERNS:
        idx = section.find(end_marker)
        if idx != -1:
            return section[:idx]
    return section


def find_violations(section: str):
    """Return list of (task_id, full_line_truncated, [reasons])."""
    violations = []
    for m in GREEN_TASK_LINE.finditer(section):
        full_line = m.group(1).strip()
        task_id = m.group(2)
        bracket_match = BRACKET_NOTE.search(full_line)
        if not bracket_match:
            continue
        bracket_text = bracket_match.group(1)
        reasons = []
        for pattern, desc in FORBIDDEN_PATTERNS:
            if pattern.search(bracket_text):
                reasons.append(desc)
        for icon in ICONS_BLOCKED_IN_GREEN_NOTE:
            if icon in bracket_text:
                reasons.append(f"icon '{icon}' trong note = upstream task chưa full ready")
        if reasons:
            truncated = full_line if len(full_line) <= 140 else full_line[:140] + "..."
            violations.append((task_id, truncated, reasons))
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
        "❌ todo.md task 🟢 vi phạm rule full-ready (Strict Status Review 2026-05-05):",
        "",
    ]
    for task_id, line, reasons in violations:
        lines.append(f"  {task_id}: {line}")
        for r in reasons:
            lines.append(f"    → {r}")
    lines += [
        "",
        "Rule (CLAUDE.md user §QA workflow rules / Trust state not task icon):",
        "  🟢 = 100% scope task ready (mọi module/state/filter/role có data đủ chạy 100% TC).",
        "  Nếu 1 phần scope chưa ready → flip ⏳ HOẶC split sub-task a/b.",
        "",
        "Cấm flip 🟢 với note chứa:",
        "  - 'partial unblock' / 'partial ready' / 'partial scope'",
        "  - 'defer khi/cho/until/sau khi'",
        "  - 'cascade'",
        "  - icon ⚠️ / 🚫 / ⏳ (reference upstream chưa full ready)",
        "",
        "Allow: bracket chỉ chứa ✅ icons + 'full ready' / 'đủ' / 'đã đủ' / 'test ngay'.",
        "",
        "Pattern lỗi gốc 2026-05-05: 4 task fake-🟢 (R6.5.1/R6.7.7/R6.7.13/R6.E4)",
        "dùng 🟢 cho '1 phần upstream unblock' thay vì 'đủ scope task ready'.",
    ]
    print("\n".join(lines), file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
