#!/usr/bin/env python3
"""PreToolUse hook: enforce bug-report-*.md chỉ có 6 sections cố định trong từng bug entry.

Trigger: Edit/Write/MultiEdit on file path matching `bug-report*.md` (under bug-reports/).
Logic: parse new content, scan for forbidden h3/bold-prefix sections inside bug detail.
Cấm: "Tác động", "Đề xuất fix", "Đề xuất dev fix", "SRS verification", "Phân biệt module".
Allowed h3 sections: "Mô tả", "Các bước tái hiện", "Kết quả mong đợi", "Kết quả thực tế",
                     "Bằng chứng", "So sánh".

Memory ref: feedback_bug_report_template_strict.md (2026-05-02 R11 — user nhắc lần 2).
Exit 2 = block + show stderr to Claude.
"""
import json
import re
import sys

TARGET_PATTERN = re.compile(r"bug-report[^/]*\.md$", re.IGNORECASE)

# Forbidden patterns — h3 heading OR bold-prefix line
FORBIDDEN_HEADINGS = [
    "Tác động",
    "Tác động downstream",
    "Đề xuất fix",
    "Đề xuất dev fix",
    "SRS verification",
    "Phân biệt module",
]

# Match `### Tác động ...` or `**Tác động:**` or `**Đề xuất fix:**`
FORBIDDEN_REGEX = re.compile(
    r"^(?:### |\*\*)(?:Tác động(?: downstream)?|Đề xuất(?: dev)? fix|SRS verification|Phân biệt module)(?:[:\s]|$|\*\*)",
    re.MULTILINE,
)


def extract_new_content(tool_name: str, tool_input: dict) -> str:
    if tool_name == "Write":
        return tool_input.get("content", "")
    if tool_name == "Edit":
        return tool_input.get("new_string", "")
    if tool_name == "MultiEdit":
        edits = tool_input.get("edits", [])
        return "\n".join(e.get("new_string", "") for e in edits)
    return ""


def find_violations(text: str) -> list[tuple[int, str]]:
    violations = []
    for idx, raw_line in enumerate(text.splitlines(), start=1):
        if FORBIDDEN_REGEX.search(raw_line):
            violations.append((idx, raw_line.rstrip()))
    return violations


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        sys.exit(0)

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "") or ""

    if not file_path or not TARGET_PATTERN.search(file_path):
        sys.exit(0)

    new_content = extract_new_content(tool_name, tool_input)
    if not new_content:
        sys.exit(0)

    violations = find_violations(new_content)
    if not violations:
        sys.exit(0)

    msg_lines = [
        "❌ bug-report-*.md vi phạm rule strict 6 sections (memory feedback_bug_report_template_strict).",
        "",
        "Forbidden sections detected (cấm thêm vào bug entry):",
    ]
    for line_no, raw in violations[:10]:
        msg_lines.append(f"  Line {line_no}: {raw}")
    if len(violations) > 10:
        msg_lines.append(f"  ... +{len(violations) - 10} dòng khác")
    msg_lines.extend(
        [
            "",
            "Allowed h3 sections trong bug entry:",
            "  Mô tả · Các bước tái hiện · Kết quả mong đợi · Kết quả thực tế · Bằng chứng · So sánh (optional)",
            "",
            "Cấm: Tác động · Đề xuất fix · Đề xuất dev fix · SRS verification · Phân biệt module.",
            "Fix: gộp vào Mô tả nếu cần thiết, hoặc đẩy sang workflow-test-report.md.",
            "Memory: feedback_bug_report_template_strict.md (2026-05-02 R11 — user nhắc lần 2).",
        ]
    )

    print("\n".join(msg_lines), file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
