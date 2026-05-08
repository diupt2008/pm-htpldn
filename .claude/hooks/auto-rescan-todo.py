#!/usr/bin/env python3
"""PostToolUse hook: auto re-scan todo.md sau Edit/Write — flip ⏳→🟢 khi dep PASS.

Trigger: PostToolUse Edit/Write/MultiEdit on tasks/todo.md HOẶC tasks/todo-<module>.md.

Lưu ý sau split (2026-05-08): hook scan single file → status_map chỉ gồm task TRONG
cùng file. Dep cross-module (vd R7.4.A4 ở hoi-dap.md ref R7.2.3 ở tc-tv.md) sẽ KHÔNG
auto-flip — cần update tay. Phase 2 có thể rewrite scan toàn bộ todo*.md để cover.

Logic an toàn (CHỈ flip ⏳→🟢):
  1. Đọc file todo.md từ disk (sau khi Edit đã apply).
  2. Parse mọi task line `- <icon> **R{N}.X.Y** ...` toàn file → state map task_id → icon.
     (Round-agnostic: regex R\d+\. — backward compat R6 + R7 + future rounds.)
  3. Với mỗi task ⏳:
     - Extract `R\d+\\.[0-9A-Za-z.-]+` IDs trong bracket `[need: ...]` cùng dòng.
     - Skip nếu bracket có marker `(✗ ...)` — dep state KHÔNG thoả (vd `(✗ HD=0)`).
     - Skip nếu bracket chứa ⚠️/🚫/⏳ icon — dep partial/block.
     - Skip nếu bracket có keyword phi-task ("BA confirm", "dev seed", "deadline",
       "external", "chưa trigger", "spec contradiction") — không tự resolve được.
     - PASS condition (chọn 1 trong 3):
       (a) bracket có ≥1 ID + TẤT CẢ task IDs là ✅ + KHÔNG có `(✗`.
       (b) bracket KHÔNG có ID nhưng có ≥1 marker `(✓ ...)` + KHÔNG có `(✗`.
       (c) bracket vừa có ID + state markers — task IDs ✅ AND markers `(✓` only.
  4. Nếu có flip → recount bảng tổng (auto-detect "Tổng Round N" hoặc "Tổng" row) → ghi file.
  5. Print summary stderr cho user thấy.

KHÔNG flip: 🟢→✅, ⚠️→✅, 🚫→🟢 (tester tự quyết). Chỉ unblock ⏳ khi dep ready.

Update 2026-05-07: round-agnostic + state marker (✓/✗) support.
Áp dụng từ 2026-05-05 sau Strict Status Review.
"""
from __future__ import annotations

import json
import re
import sys

ICONS = ("✅", "🟢", "🔵", "⚠️", "🚫", "⏳")

# Round-agnostic task ID: R6.X.Y, R7.4.A1, R8.3.16-mob, ...
TASK_ID_RE = r"R\d+\.[0-9A-Za-z.\-]+"

TASK_LINE = re.compile(
    rf"^(\s*-\s+)(✅|🟢|🔵|⚠️|🚫|⏳)(\s+(?:<a id=\"[^\"]+\"></a>)?\*\*({TASK_ID_RE})\*\*[^\n]*)$",
    re.MULTILINE,
)
# Hỗ trợ cả `[...]` và backtick `[...]` — bracket dep notation
BRACKET_NOTE = re.compile(r"`?\[([^\]]+)\]`?")
DEP_ID = re.compile(TASK_ID_RE)
# State markers — verified true (✓) / false (✗) state count
MARKER_OK = re.compile(r"\(\s*✓[^)]*\)")
MARKER_FAIL = re.compile(r"\(\s*✗[^)]*\)")
NON_TASK_CONSTRAINT = re.compile(
    r"BA confirm|dev seed|deadline|thời gian|external|chưa trigger|"
    r"file dummy|API mock|Cổng PLQG|LGSP|DVC|spec contradiction|"
    r"chờ BA|endpoint deploy|sandbox|VNeID Tier",
    re.IGNORECASE,
)
BLOCKING_ICONS_IN_BRACKET = ("⚠️", "🚫", "⏳")

# Round-agnostic summary row — match "Tổng Round N" hoặc "Tổng" (cuối bảng)
SUMMARY_ROW = re.compile(
    r"(\|\s*\*\*Tổng(?:\s+Round\s+\d+)?\*\*\s*\|[^|]*\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*\s*"
    r"\|\s*\*\*)(\d+)(\*\*)"
)


TARGET_FILE_RE = re.compile(r"/tasks/todo(?:-[\w-]+)?\.md$")


def is_target_file(path: str) -> bool:
    return bool(TARGET_FILE_RE.search(path))


def get_active_section_bounds(content: str):
    """Round-agnostic: scan toàn file. Skip header (trước task line đầu tiên)
    để tránh parse Mục lục table."""
    first_task = TASK_LINE.search(content)
    if first_task is None:
        return None, None
    return first_task.start(), len(content)


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
    """Check if a ⏳ task line is eligible for ⏳→🟢 flip.

    Pass condition (cần CẢ 2):
      1. KHÔNG có marker `(✗ ...)` trong bracket — state mismatch.
      2. KHÔNG có blocking icon (⚠️/🚫/⏳) ngoài task header chính.
      3. KHÔNG có non-task constraint phi-resolvable.
      4. Có ≥1 dep evidence:
         - Task IDs trong bracket: TẤT CẢ đều ✅, HOẶC
         - Marker `(✓ ...)` xuất hiện: ≥1 marker ✓ + zero ✗.
    """
    bracket_match = BRACKET_NOTE.search(line)
    if not bracket_match:
        return False
    bracket = bracket_match.group(1)

    # HARD BLOCK: marker (✗ ...) — state KHÔNG thoả
    if MARKER_FAIL.search(bracket):
        return False

    # Block if bracket has any non-✅ icon
    for icon in BLOCKING_ICONS_IN_BRACKET:
        if icon in bracket:
            return False

    # Block if bracket has non-task constraint
    if NON_TASK_CONSTRAINT.search(bracket):
        return False

    dep_ids = DEP_ID.findall(bracket)
    has_ok_marker = bool(MARKER_OK.search(bracket))

    # Cần ≥1 evidence type
    if not dep_ids and not has_ok_marker:
        return False

    # Nếu có task IDs — tất cả phải ✅
    if dep_ids:
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
        # Column order in current todo.md (R7+): Tổng | 🟢 | 🔵 | ✅ | ⚠️ | 🚫 | ⏳
        # (Legacy R6 order was: Tổng | ✅ | 🟢 | 🔵 | ...)
        # Groups: 1=prefix, 2=total, 3=sep, 4=N1, 5=sep, 6=N2, ..., 14=N7, 15=trailing **
        return (
            m.group(1) + str(total) + m.group(3)
            + str(counts["🟢"]) + m.group(5)
            + str(counts["🔵"]) + m.group(7)
            + str(counts["✅"]) + m.group(9)
            + str(counts["⚠️"]) + m.group(11)
            + str(counts["🚫"]) + m.group(13)
            + str(counts["⏳"]) + m.group(15)
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
