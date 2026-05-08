#!/usr/bin/env python3
"""Split tasks/todo.md → 20 module files tasks/todo-<module>.md.

Idempotent: re-running overwrites module files but does NOT touch master todo.md.
Master todo.md rewrite phải làm thủ công (xem README split).
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TODO_FILE = ROOT / "tasks" / "todo.md"

# Mapping task_id → module slug. 111 task / 20 module.
TASK_TO_MODULE = {
    # Phase 0 — Pre-test
    "R7.0.1": "pre-test", "R7.0.2": "pre-test", "R7.0.3": "pre-test",
    "R7.0.4": "pre-test", "R7.0.5": "pre-test", "R7.0.6": "pre-test", "R7.0.7": "pre-test",

    # QTHT (Tier 0 DM + Tier 1 actor + Functional QTHT + Audit log accumulate)
    "R7.1.1": "qtht", "R7.1.2": "qtht", "R7.1.3": "qtht",
    "R7.1.4": "qtht", "R7.1.5": "qtht", "R7.1.6": "qtht",
    "R7.2.1": "qtht", "R7.2.9": "qtht",
    "R7.7.8": "qtht", "R7.7.8a": "qtht", "R7.7.8b": "qtht",
    "R7.7.8c": "qtht", "R7.7.8d": "qtht", "R7.7.8e": "qtht",
    "R7.5.5": "qtht",

    # TVV + CG (chung functional)
    "R7.2.5": "tvv-cg", "R7.2.6": "tvv-cg",
    "R7.4.A1": "tvv-cg", "R7.4.A1-CG": "tvv-cg", "R7.4.A2": "tvv-cg",
    "R7.7.2": "tvv-cg",

    # NHT
    "R7.2.7": "nht", "R7.7.4.5": "nht",

    # TC TV
    "R7.2.2": "tc-tv", "R7.2.3": "tc-tv", "R7.7.4.6": "tc-tv",

    # DN
    "R7.2.4": "doanh-nghiep", "R7.3.4": "doanh-nghiep",
    "R7.5.2": "doanh-nghiep", "R7.7.4": "doanh-nghiep",

    # Hỏi đáp
    "R7.3.1": "hoi-dap", "R7.3.1.MoB": "hoi-dap", "R7.3.1.TVN": "hoi-dap",
    "R7.4.A4": "hoi-dap", "R7.7.1": "hoi-dap",

    # Vụ việc
    "R7.3.2": "vu-viec",
    "R7.4.A3": "vu-viec", "R7.4.A3-PUBLIC": "vu-viec", "R7.4.A3-DN-BS": "vu-viec",
    "R7.7.3": "vu-viec", "R7.7.3-PRIVACY": "vu-viec",

    # TVCS
    "R7.3.3": "tvcs", "R7.4.A5": "tvcs", "R7.7.5": "tvcs",

    # HĐ TV
    "R7.3.14": "hop-dong-tv", "R7.7.14": "hop-dong-tv", "R7.E1": "hop-dong-tv",

    # Đào tạo (KH năm + CTĐT + Khóa học + NHCH + ĐKT + Bài giảng + Giảng viên + Học viên + Lịch học)
    "R7.3.5": "dao-tao", "R7.4.B0": "dao-tao",
    "R7.3.6": "dao-tao", "R7.4.B1": "dao-tao",
    "R7.3.15": "dao-tao", "R7.4.B7": "dao-tao", "R7.4.B11": "dao-tao", "R7.7.6": "dao-tao",
    "R7.3.8": "dao-tao", "R7.4.B5b": "dao-tao",
    "R7.3.9": "dao-tao", "R7.4.B10": "dao-tao",
    "R7.3.10": "dao-tao", "R7.3.11": "dao-tao",
    "R7.3.12": "dao-tao", "R7.3.13": "dao-tao", "R7.4.B12": "dao-tao",

    # Biểu mẫu
    "R7.3.7": "bieu-mau", "R7.4.C1": "bieu-mau", "R7.7.10": "bieu-mau",

    # Đánh giá HQ HTPL
    "R7.4.D1": "danh-gia-hq", "R7.4.D2": "danh-gia-hq",
    "R7.4.D2a": "danh-gia-hq", "R7.4.D2b": "danh-gia-hq",
    "R7.7.9": "danh-gia-hq",

    # Kho QA
    "R7.3.16": "kho-qa", "R7.4.D3": "kho-qa", "R7.4.D3.AUTO": "kho-qa",

    # Chi trả
    "R7.6.1": "chi-tra", "R7.7.12": "chi-tra",
    "R7.7.12.1": "chi-tra", "R7.7.12.2": "chi-tra",
    "R7.7.12.3": "chi-tra", "R7.7.12.4": "chi-tra",
    "R7.E3": "chi-tra",

    # TV nhanh
    "R7.6.2": "tv-nhanh", "R7.6.3": "tv-nhanh",
    "R7.7.11": "tv-nhanh", "R7.E4": "tv-nhanh",

    # CT HTPLDN
    "R7.6.4": "ct-htpldn", "R7.6.5": "ct-htpldn",
    "R7.7.15": "ct-htpldn", "R7.7.15.b": "ct-htpldn", "R7.E2": "ct-htpldn",

    # Dashboard
    "R7.5.1": "dashboard", "R7.7.7": "dashboard",

    # Báo cáo
    "R7.5.4": "bao-cao", "R7.7.13": "bao-cao",

    # Cross-cutting (SLA / API / Edge BR / Permission / Profile)
    "R7.5.3": "cross-cutting",
    "R7.7.16": "cross-cutting", "R7.7.17": "cross-cutting",
    "R7.8.1": "cross-cutting", "R7.8.2": "cross-cutting", "R7.8.3": "cross-cutting",
    "R7.8.4": "cross-cutting", "R7.8.5": "cross-cutting", "R7.8.6": "cross-cutting",
}

MODULE_TITLES = {
    "pre-test": "Pre-test (Phase 0)",
    "qtht": "QTHT — Quản trị hệ thống",
    "tvv-cg": "TVV + Chuyên gia (CG)",
    "nht": "NHT — Người hỗ trợ",
    "tc-tv": "TC TV — Tổ chức tư vấn",
    "doanh-nghiep": "Doanh nghiệp",
    "hoi-dap": "Hỏi đáp",
    "vu-viec": "Vụ việc",
    "tvcs": "TVCS — Tư vấn chuyên sâu",
    "hop-dong-tv": "HĐ TV — Hợp đồng tư vấn",
    "dao-tao": "Đào tạo (KH năm / CTĐT / Khóa học / NHCH / ĐKT / Bài giảng / Giảng viên / Học viên / Lịch học)",
    "bieu-mau": "Biểu mẫu",
    "danh-gia-hq": "Đánh giá Hiệu quả HTPL",
    "kho-qa": "Kho QA",
    "chi-tra": "Chi trả",
    "tv-nhanh": "TV nhanh",
    "ct-htpldn": "CT HTPLDN",
    "dashboard": "Dashboard",
    "bao-cao": "Báo cáo",
    "cross-cutting": "Cross-cutting (SLA / API / Edge BR / Permission / Profile)",
}

# Regex cho task header — match cả có/không có anchor `<a id="...">`.
# Dùng alternation thay character class vì ⚠️ là 2 codepoint (U+26A0 U+FE0F).
TASK_HEADER_RE = re.compile(
    r'^- (?:✅|⚠️|🚫|⏳|🟢|❌|🔵)(?:\s*<a id="[^"]+"></a>)?\s*\*\*(R7\.[A-Za-z0-9.\-]+)\*\*'
)
# Obsolete task line (strikethrough)
OBSOLETE_RE = re.compile(r'^- ~~\*\*R7\.')
# Boundary: section heading (## or ###) hoặc divider
BOUNDARY_RE = re.compile(r'^(##|---\s*$)')


def parse_tasks(content: str):
    """Parse todo.md → list of (task_id, [block_lines]).

    Một task block:
    - Bắt đầu từ line match TASK_HEADER_RE
    - Bao gồm tất cả line tiếp theo bắt đầu bằng `  ` (sub-bullet) hoặc blank
    - Kết thúc khi gặp:
      - Task header mới
      - Line không indent + không blank (vd `## Phase`, `> Note`, `---`)
      - OBSOLETE line
    """
    lines = content.split('\n')
    tasks = []
    current_id = None
    current_block = []

    def close_current():
        nonlocal current_id, current_block
        if current_id is not None:
            # Strip trailing blank lines từ block
            while current_block and current_block[-1].strip() == '':
                current_block.pop()
            tasks.append((current_id, current_block))
        current_id = None
        current_block = []

    for line in lines:
        m = TASK_HEADER_RE.match(line)
        if m:
            close_current()
            current_id = m.group(1)
            current_block = [line]
            continue

        if OBSOLETE_RE.match(line):
            close_current()
            continue

        if BOUNDARY_RE.match(line):
            close_current()
            continue

        # Continuation only nếu indent or blank
        if current_id is not None:
            if line.startswith('  ') or line.strip() == '':
                current_block.append(line)
            else:
                # Non-indent non-blank line → close task
                close_current()

    close_current()
    return tasks


def build_module_file(module: str, blocks):
    title = MODULE_TITLES[module]
    count = len(blocks)
    task_ids = ', '.join(tid for tid, _ in blocks)

    header = f"""# TODO — {title}

> File module của [`todo.md`](todo.md) master. Tổng **{count} task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** {task_ids}

---

## Tasks

"""
    body = "\n".join("\n".join(block) for _, block in blocks)
    return header + body + "\n"


def main():
    if not TODO_FILE.exists():
        print(f"ERROR: {TODO_FILE} không tồn tại", file=sys.stderr)
        sys.exit(1)

    content = TODO_FILE.read_text(encoding='utf-8')
    all_tasks = parse_tasks(content)

    print(f"Parsed: {len(all_tasks)} tasks")

    # Verify coverage
    parsed_ids = {tid for tid, _ in all_tasks}
    expected_ids = set(TASK_TO_MODULE.keys())

    missing_in_parse = expected_ids - parsed_ids
    extra_in_parse = parsed_ids - expected_ids

    if missing_in_parse:
        print(f"WARN: {len(missing_in_parse)} task ID expected nhưng không parse được: {sorted(missing_in_parse)}")
    if extra_in_parse:
        print(f"WARN: {len(extra_in_parse)} task ID parse được nhưng không có trong mapping: {sorted(extra_in_parse)}")

    # Group by module
    by_module = {}
    for tid, block in all_tasks:
        if tid not in TASK_TO_MODULE:
            continue
        module = TASK_TO_MODULE[tid]
        by_module.setdefault(module, []).append((tid, block))

    # Write
    total_written = 0
    for module in sorted(by_module.keys()):
        blocks = by_module[module]
        out_path = ROOT / "tasks" / f"todo-{module}.md"
        out_path.write_text(build_module_file(module, blocks), encoding='utf-8')
        total_written += len(blocks)
        print(f"  todo-{module}.md: {len(blocks)} tasks")

    print(f"Total written: {total_written} tasks")
    if total_written != len(parsed_ids & expected_ids):
        print("WARN: count mismatch", file=sys.stderr)


if __name__ == "__main__":
    main()
