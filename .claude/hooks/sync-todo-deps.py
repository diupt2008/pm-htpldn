#!/usr/bin/env python3
"""PostToolUse hook: auto-sync todo.md dep refs to match task header status.

Trigger: After Edit/Write/MultiEdit on tasks/todo.md.
Logic:
  1. Read file → build status_map từ task header lines
     (`- ICON [<a id="..."></a>]**R7.X**` → R7.X mapped to ICON).
  2. Scan ALL lines (kể cả task header line) cho 2 pattern:
     - `R7.X.Y ICON` (dep ref trong [need:...], Cần có sẵn:...)
     - `ICON [R7.X.Y]` (Mục lục table cell)
  3. Replace ICON nếu mismatch với status_map[R7.X.Y].
  4. Task header status icon (đầu dòng `- ICON ...**R7.X**`) KHÔNG bị đụng
     vì pattern dep-ref là `(R7\.X)(\s)(ICON)` — yêu cầu task ID TRƯỚC icon,
     trong khi task header có icon TRƯỚC task ID.
  5. Write file back nếu có sync; output stderr report.
Exit 0 always (informational, never blocking).

⚠️ Chỉ sync 6 status icon: 🟢🔵✅⚠️🚫⏳. KHÔNG đụng ❌ (DEV migration marker etc.).
⚠️ Dùng alternation `(?:🟢|🔵|...)` không phải char class `[🟢🔵...]`
   vì ⚠️ là 2 codepoint (U+26A0+U+FE0F), char class sẽ tách nhầm.
"""
import json
import re
import sys

ICONS_LIST = ["🟢", "🔵", "✅", "⚠️", "🚫", "⏳"]

def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception as e:
        print(f"[sync-todo-deps] cannot parse hook stdin: {e}", file=sys.stderr)
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")

    if "/tasks/todo.md" not in file_path and not file_path.endswith("/todo.md"):
        return 0

    try:
        with open(file_path, "r") as f:
            text = f.read()
    except Exception as e:
        print(f"[sync-todo-deps] cannot read {file_path}: {e}", file=sys.stderr)
        return 0

    icon_alt = "(?:" + "|".join(re.escape(i) for i in ICONS_LIST) + ")"
    task_pat = re.compile(
        rf"^-\s+({icon_alt})\s+(?:<a id=\"[^\"]+\"></a>)?\*\*(R7[\.\w-]+)\*\*"
    )
    ref_pat = re.compile(rf"(R7[\.\w-]+)(\s+)({icon_alt})")
    muc_pat = re.compile(rf"({icon_alt})(\s+)\[(R7[\.\w-]+)\]")

    lines = text.split("\n")
    status_map = {}
    for line in lines:
        m = task_pat.match(line)
        if m:
            status_map[m.group(2)] = m.group(1)

    if not status_map:
        return 0

    changes = []
    new_lines = []
    for i, line in enumerate(lines):
        line_no = i + 1

        def sync_ref(m):
            tid, ws, cur = m.group(1), m.group(2), m.group(3)
            if tid in status_map and status_map[tid] != cur:
                changes.append((line_no, tid, cur, status_map[tid], "dep-ref"))
                return f"{tid}{ws}{status_map[tid]}"
            return m.group(0)

        line = ref_pat.sub(sync_ref, line)

        def sync_muc(m):
            cur, ws, tid = m.group(1), m.group(2), m.group(3)
            if tid in status_map and status_map[tid] != cur:
                changes.append((line_no, tid, cur, status_map[tid], "muc-luc"))
                return f"{status_map[tid]}{ws}[{tid}]"
            return m.group(0)

        line = muc_pat.sub(sync_muc, line)
        new_lines.append(line)

    if not changes:
        return 0

    new_text = "\n".join(new_lines)
    try:
        with open(file_path, "w") as f:
            f.write(new_text)
    except Exception as e:
        print(f"[sync-todo-deps] cannot write {file_path}: {e}", file=sys.stderr)
        return 0

    msg = [f"[sync-todo-deps] auto-synced {len(changes)} dep marker(s) trong todo.md:"]
    for line_no, tid, old, new, kind in changes:
        msg.append(f"  L{line_no} [{kind}] {tid}: {old} → {new}")
    print("\n".join(msg), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
