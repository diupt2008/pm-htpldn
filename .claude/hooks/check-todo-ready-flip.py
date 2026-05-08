#!/usr/bin/env python3
"""PostToolUse hook: flag todo.md task ⏳ có toàn bộ deps trong [need:...] là ✅
   → cần re-eval flip 🟢.

Trigger: After Edit/Write/MultiEdit on tasks/todo.md.
Logic:
  1. Read file, build status_map từ task header lines.
  2. Scan task lines `- ⏳ <a id="..."></a>**R{X}.{Y}**` có `[need: ...]`.
  3. Trong [need:...], extract token `R{X}.{Y} ICON`.
  4. Skip nếu bracket có text non-task-ref đáng kể (≥N entity / spec: / account: / verify ...).
  5. Nếu TOÀN BỘ task-ref icon là ✅ → flag stderr (warn-only, exit 0).

Áp dụng 2026-05-07: gap phát hiện R7.4.A5 stale ⏳ dù R7.2.6 ✅ + R7.3.3 ✅
  do thiếu auto re-eval downstream khi flip task seed ✅.
  Memory rule `feedback_todo_update_after_run` đơn thuần không đủ — phải hook backstop.
"""
import json
import re
import sys

ICONS_LIST = ["🟢", "🔵", "✅", "⚠️", "🚫", "⏳"]
RESIDUAL_TOLERANCE = 12  # max non-ref char trong [need:...] sau khi strip task-refs


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "")
    if "/tasks/todo.md" not in file_path and not file_path.endswith("/todo.md"):
        return 0

    try:
        with open(file_path, "r") as f:
            text = f.read()
    except Exception:
        return 0

    icon_alt = "(?:" + "|".join(re.escape(i) for i in ICONS_LIST) + ")"
    task_id_re = r"R\d+(?:\.[\w\-]+)+"

    task_pat = re.compile(
        rf"^-\s+({icon_alt})\s+(?:<a id=\"[^\"]+\"></a>)?\*\*({task_id_re})\*\*"
    )
    waiting_pat = re.compile(
        rf"^-\s+⏳\s+(?:<a id=\"[^\"]+\"></a>)?\*\*({task_id_re})\*\*([^\n]*)$",
        re.MULTILINE,
    )
    bracket_pat = re.compile(r"\[\s*need:\s*([^\]]+)\]", re.IGNORECASE)
    ref_pat = re.compile(rf"({task_id_re})\s+({icon_alt})")

    status_map = {}
    for line in text.split("\n"):
        m = task_pat.match(line)
        if m:
            status_map[m.group(2)] = m.group(1)

    if not status_map:
        return 0

    flagged = []
    for m in waiting_pat.finditer(text):
        task_id = m.group(1)
        rest = m.group(2)
        bm = bracket_pat.search(rest)
        if not bm:
            continue
        bracket_text = bm.group(1)

        refs = ref_pat.findall(bracket_text)
        if not refs:
            continue

        residual = ref_pat.sub("", bracket_text)
        residual_clean = re.sub(r"[\s\+\&;,\.]", "", residual)
        if len(residual_clean) > RESIDUAL_TOLERANCE:
            continue  # bracket có entity/spec/account note — skip để tránh false positive

        if all(icon == "✅" for _, icon in refs):
            ref_summary = " + ".join(f"{tid} ✅" for tid, _ in refs)
            flagged.append((task_id, ref_summary))

    if not flagged:
        return 0

    msg = [
        f"[check-todo-ready-flip] ⚠️ {len(flagged)} task ⏳ có deps đã đủ ✅ — cân nhắc flip 🟢:"
    ]
    for tid, refs in flagged:
        msg.append(f"  {tid}: [need: {refs}] → flip ⏳ → 🟢")
    msg += [
        "",
        "Rule: deps trong [need:...] toàn ✅ + scope ready → flip 🟢 (sẵn sàng).",
        "Ref: CLAUDE.md §Quy tắc viết todo.md · memory feedback_todo_update_after_run.",
        "(Hook warn-only, không block. Skip nếu bracket có note ≥N/spec/account.)",
    ]
    print("\n".join(msg), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
