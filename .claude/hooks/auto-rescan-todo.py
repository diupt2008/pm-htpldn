#!/usr/bin/env python3
"""PostToolUse hook: auto re-scan todo.md sau Edit/Write — flip ⏳→🟢 khi dep PASS.

Trigger: PostToolUse Edit/Write/MultiEdit on tasks/todo.md.

Logic an toàn (CHỈ flip ⏳→🟢):
  1. Đọc file todo.md từ disk (sau khi Edit đã apply).
  2. Parse mọi task line `- <icon> **R6.X.Y** ...` trong section
     `## Round 6 — Active task tracker` → state map task_id → icon.
  3. Với mỗi task ⏳:
     - Extract `R6\\.[0-9A-Za-z.-]+` IDs trong bracket `[need: ...]` cùng dòng.
     - Nếu KHÔNG có ID nào → skip (không auto-resolve được).
     - Nếu bracket chứa ⚠️/🚫/⏳ icon → skip (dep partial/block).
     - Nếu bracket chứa keyword constraint phi-task ("≥", "BA confirm",
       "dev seed", "deadline", "thời gian", "external", "chưa trigger") → skip.
     - Nếu TẤT CẢ R6 IDs trong bracket có state ✅ → flip ⏳→🟢.
  4. Nếu có flip → recount bảng `**Tổng Round 6**` → ghi file.
  5. Print summary stderr cho user thấy.

KHÔNG flip: 🟢→✅, ⚠️→✅, 🚫→🟢 (tester tự quyết). Chỉ unblock ⏳ khi dep ready.

Áp dụng từ 2026-05-05 sau Strict Status Review.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ICONS = ("✅", "🟢", "🔵", "⚠️", "🚫", "⏳")

TASK_LINE = re.compile(
    r"^(\s*-\s+)(✅|🟢|🔵|⚠️|🚫|⏳)(\s+\*\*(R6\.[0-9A-Za-z.\-]+)\*\*[^\n]*)$",
    re.MULTILINE,
)
BRACKET_NOTE = re.compile(r"`\[([^\]]+)\]`")
DEP_ID = re.compile(r"R6\.[0-9A-Za-z.\-]+")
NON_TASK_CONSTRAINT = re.compile(
    r"≥|BA confirm|dev seed|deadline|thời gian|external|chưa trigger|"
    r"file dummy|API mock|Cổng PLQG|LGSP|DVC|spec contradiction",
    re.IGNORECASE,
)
BLOCKING_ICONS_IN_BRACKET = ("⚠️", "🚫", "⏳")

ACTIVE_SECTION_START = "## Round 6 — Active task tracker"
ACTIVE_SECTION_END_PATTERNS = ("# 📚 Round 5", "## Tiến độ Round 5")

SUMMARY_ROW = re.compile(
    r"(\|\s*\*\*Tổng Round 6\*\*\s*\|[^|]*\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*)"
)


def is_target_file(path: str) -> bool:
    return path.endswith("/todo.md") or Path(path).name == "todo.md"


def get_active_section_bounds(content: str):
    start = content.find(ACTIVE_SECTION_START)
    if start == -1:
        return None, None
    section_end = len(content)
    for marker in ACTIVE_SECTION_END_PATTERNS:
        idx = content.find(marker, start)
        if idx != -1:
            section_end = idx
            break
    return start, section_end


def parse_state_map(content: str, start: int, end: int) -> dict:
    section = content[start:end]
    state_map = {}
    for m in TASK_LINE.finditer(section):
        icon = m.group(2)
        task_id = m.group(4)
        if task_id not in state_map:  # first occurrence wins
            state_map[task_id] = icon
    return state_map


def can_auto_flip(line: str, state_map: dict) -> bool:
    """Check if a ⏳ task line is eligible for ⏳→🟢 flip."""
    bracket_match = BRACKET_NOTE.search(line)
    if not bracket_match:
        return False
    bracket = bracket_match.group(1)

    # Block if bracket has any non-✅ icon
    for icon in BLOCKING_ICONS_IN_BRACKET:
        if icon in bracket:
            return False

    # Block if bracket has non-task constraint
    if NON_TASK_CONSTRAINT.search(bracket):
        return False

    # Extract R6 IDs
    dep_ids = DEP_ID.findall(bracket)
    if not dep_ids:
        return False

    # All deps must be ✅
    for dep in dep_ids:
        if state_map.get(dep) != "✅":
            return False

    return True


def flip_task_lines(content: str, start: int, end: int, state_map: dict):
    """Return (new_content, flipped_list)."""
    flipped = []

    def replace(m: re.Match) -> str:
        prefix = m.group(1)
        icon = m.group(2)
        rest = m.group(3)
        task_id = m.group(4)
        if icon != "⏳":
            return m.group(0)
        full_line = m.group(0)
        if can_auto_flip(full_line, state_map):
            flipped.append(task_id)
            return f"{prefix}🟢{rest}"
        return full_line

    section = content[start:end]
    new_section = TASK_LINE.sub(replace, section)
    new_content = content[:start] + new_section + content[end:]
    return new_content, flipped


def recount_summary(content: str) -> str:
    """Recount icon trong active section + update SUMMARY_ROW."""
    start, end = get_active_section_bounds(content)
    if start is None:
        return content
    section = content[start:end]
    counts = {icon: 0 for icon in ICONS}
    seen = set()
    for m in TASK_LINE.finditer(section):
        icon = m.group(2)
        task_id = m.group(4)
        if task_id in seen:
            continue
        seen.add(task_id)
        counts[icon] += 1
    total = sum(counts[i] for i in ICONS)

    def replace_summary(m: re.Match) -> str:
        return (
            m.group(1) + str(total) + m.group(3)
            + str(counts["✅"]) + m.group(5)
            + str(counts["🟢"]) + m.group(7)
            + str(counts["🔵"]) + m.group(9)
            + str(counts["⚠️"]) + m.group(11)
            + str(counts["🚫"]) + m.group(13)
            + str(counts["⏳"]) + m.group(14)
        )

    return SUMMARY_ROW.sub(replace_summary, content, count=1)


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    if tool_name not in ("Edit", "Write", "MultiEdit"):
        return 0

    file_path = tool_input.get("file_path", "")
    if not is_target_file(file_path):
        return 0

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        return 0

    start, end = get_active_section_bounds(content)
    if start is None:
        return 0

    state_map = parse_state_map(content, start, end)
    new_content, flipped = flip_task_lines(content, start, end, state_map)

    if not flipped:
        return 0

    new_content = recount_summary(new_content)

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
    except Exception as e:
        print(f"[auto-rescan-todo] write fail: {e}", file=sys.stderr)
        return 0

    msg = (
        f"🔄 auto-rescan-todo: flip {len(flipped)} task ⏳→🟢 "
        f"(dep ✅ đủ): {', '.join(flipped)}\n"
        f"   → todo.md updated + bảng tổng recount."
    )
    print(msg, file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
