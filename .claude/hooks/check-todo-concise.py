#!/usr/bin/env python3
"""PreToolUse hook: enforce todo.md Kết quả line ≤25 từ.

Trigger: Edit/Write/MultiEdit on tasks/todo.md (any path ending with /todo.md).
Logic: parse new content lines starting with '**Kết quả' or '- **Kết quả',
       count words after the colon. Block if any line >25 từ.
Exit 2 = block + show stderr to Claude (per Claude Code hook spec).
"""
import json
import re
import sys

WORD_LIMIT = 25
TARGET_FILES = ("todo.md",)

def extract_new_content(tool_name: str, tool_input: dict) -> str:
    if tool_name == "Write":
        return tool_input.get("content", "")
    if tool_name == "Edit":
        return tool_input.get("new_string", "")
    if tool_name == "MultiEdit":
        edits = tool_input.get("edits", [])
        return "\n".join(e.get("new_string", "") for e in edits)
    return ""

def find_violations(text: str) -> list[tuple[str, int]]:
    violations = []
    pattern = re.compile(r"\*\*Kết quả[^*]*\*\*\s*(.+)")
    for raw_line in text.splitlines():
        line = raw_line.strip()
        m = pattern.search(line)
        if not m:
            continue
        body = m.group(1).strip()
        body = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", body)
        body = re.sub(r"[`*_]", "", body)
        words = [w for w in re.split(r"\s+", body) if w]
        if len(words) > WORD_LIMIT:
            violations.append((raw_line.rstrip(), len(words)))
    return violations

def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception as e:
        print(f"[check-todo-concise] cannot parse hook stdin: {e}", file=sys.stderr)
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

    lines = ["BLOCKED: todo.md Kết quả line vượt giới hạn 25 từ.", ""]
    for line, count in violations:
        lines.append(f"  [{count} từ] {line}")
    lines += [
        "",
        "Template chuẩn (đọc CLAUDE.md §Quy tắc viết todo.md):",
        "  **Kết quả:** <PASS N/N | FAIL | ⚠️ N/M | 🚫 block do X> — <≤15 từ>. [report-link]",
        "",
        "Cấm trong todo.md: pool count, endpoint, enum, network, dev claim, 2-source verify.",
        "Chi tiết → bug-report / workflow-report.",
    ]
    print("\n".join(lines), file=sys.stderr)
    return 2

if __name__ == "__main__":
    sys.exit(main())
