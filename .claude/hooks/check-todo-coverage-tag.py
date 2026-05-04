#!/usr/bin/env python3
"""PreToolUse hook: enforce todo.md task icon ⏳/🟢/⚠️/🚫 phải có coverage tag.

Trigger: Edit/Write/MultiEdit on tasks/todo.md (any path ending with /todo.md).
Logic: parse new content lines starting with '- <icon> **<ID>**'.
       Icon ⏳/🟢/⚠️/🚫 cần coverage tag dạng `[~X% — ...]` hoặc `[need: ...]`
       hoặc `[block: ...]` hoặc `[defer: ...]` hoặc `[full 100%]`.
       Icon ✅/🔵 không bắt buộc tag (đã rõ trạng thái PASS/đang chạy).
Exit 2 = block + show stderr to Claude (per Claude Code hook spec).

Áp dụng từ 2026-04-29 theo phương án D coverage tag user yêu cầu.
"""
import json
import re
import sys

TAG_PATTERN = re.compile(r"`\[(~\d+%|need:|block:|defer:|full 100%|full)")
TASK_LINE_PATTERN = re.compile(r"^\s*-\s+(⏳|🟢|⚠️|🚫)\s+\*\*([A-Za-z0-9.\-]+)\*\*")
# Gate = synchronization point, không phải task work — không có concept coverage %.
# Loại trừ: ID dạng C1a/C1b/C2/C3/C4/C5 HOẶC line chứa "gate".
GATE_ID_PATTERN = re.compile(r"^C\d+[a-z]?$")
GATE_KEYWORD = re.compile(r"\bgate\b", re.IGNORECASE)

def extract_new_content(tool_name: str, tool_input: dict) -> str:
    if tool_name == "Write":
        return tool_input.get("content", "")
    if tool_name == "Edit":
        return tool_input.get("new_string", "")
    if tool_name == "MultiEdit":
        edits = tool_input.get("edits", [])
        return "\n".join(e.get("new_string", "") for e in edits)
    return ""

def find_violations(text: str) -> list[tuple[str, str]]:
    violations = []
    for raw_line in text.splitlines():
        m = TASK_LINE_PATTERN.match(raw_line)
        if not m:
            continue
        task_id = m.group(2)
        if GATE_ID_PATTERN.match(task_id) or GATE_KEYWORD.search(raw_line):
            continue
        if TAG_PATTERN.search(raw_line):
            continue
        violations.append((task_id, raw_line.rstrip()))
    return violations

def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception as e:
        print(f"[check-todo-coverage-tag] cannot parse hook stdin: {e}", file=sys.stderr)
        return 0

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")

    if "/tasks/todo.md" not in file_path and not file_path.endswith("/todo.md"):
        return 0

    new_text = extract_new_content(tool_name, tool_input)
    if not new_text:
        return 0

    violations = find_violations(new_text)
    if not violations:
        return 0

    lines = ["BLOCKED: task icon ⏳/🟢/⚠️/🚫 trong todo.md phải có coverage tag.", ""]
    for task_id, line in violations:
        lines.append(f"  [{task_id}] {line}")
    lines += [
        "",
        "Format tag (phương án D, memory feedback_todo_update_after_run.md §A.7):",
        "  🟢 partial    → `[~X% — reason]`     vd `[~30% — Bước 1-3 + reject]`",
        "  🟢 full       → `[full 100%]`        vd module hoàn thành",
        "  ⏳ waiting    → `[need: action cụ thể]`  vd `[need: B7 unblock + ≥3 học viên]`",
        "  🚫 blocked    → `[block: lý do]`     vd `[block: cascade A3 thiếu nút]`",
        "  🚫 defer      → `[defer: lý do]`     vd `[defer: T4.16 test API]`",
        "  ⚠️ partial    → `[~X% — reason]`     vd `[~78% — 7/9 row PASS]`",
        "",
        "Lý do: user yêu cầu áp dụng cho TẤT CẢ task, không chỉ 1 mục (2026-04-29).",
        "Ngoại lệ: task ✅/🔵 không cần tag (trạng thái đã rõ).",
    ]
    print("\n".join(lines), file=sys.stderr)
    return 2

if __name__ == "__main__":
    sys.exit(main())
