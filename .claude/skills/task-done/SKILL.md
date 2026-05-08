---
name: task-done
description: |
  Slash command đóng task QA trong tasks/todo.md với cascade tự động:
  flip icon task + re-verify entity affected + update state-snapshot.md +
  flip markers downstream (✗→✓) + hook auto-flip ⏳→🟢 + recount bảng tổng + sync mục lục.
  Dùng khi user gõ `/task-done <task_id> <verdict>` (vd `/task-done R7.4.B5b ✅`).
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - AskUserQuestion
---

# /task-done — Đóng task QA + cascade tự động

## Khi nào skill này kích hoạt

User gõ một trong các lệnh:
- `/task-done` — không args, skill tự dò task + hỏi verdict (DEFAULT — easiest)
- `/task-done <ID>` — sẽ hỏi verdict
- `/task-done <ID> <verdict>` — đầy đủ, không hỏi gì
- `<ID>` format: `R\d+\.[0-9A-Za-z.\-]+` (vd R7.4.B5b)
- `<verdict>`: ✅ | ⚠️ | 🚫 hoặc pass / partial / block

## Auto-detect khi không có args

Khi user gõ `/task-done` không args:

1. Read `tasks/todo.md`, scan tất cả task line.
2. Liệt kê candidates theo priority:
   - Ưu tiên 1: task 🔵 (in-progress) — đang chạy.
   - Ưu tiên 2: task 🟢 (sẵn sàng) — vừa unblock, có thể là task mới chạy xong.
   - Ưu tiên 3: 5 task gần nhất bất kỳ icon (theo position trong file).
3. AskUserQuestion show top 5 candidates:
   ```
   Task nào bạn vừa chạy xong?
   (a) R7.4.B5b 🟢 Publish NHCH NHAP→CONG_KHAI
   (b) R7.4.D3.AUTO ⏳ Verify auto-feed Kho QA TU_DONG
   (c) R7.7.3 ⏳ Vụ việc 72 TC v3.5
   (d) R7.6.5 ⏳ Workflow CT HTPLDN GĐ2
   (e) Khác (gõ task ID)
   ```
4. User chọn → tiếp tục pipeline.
5. AskUserQuestion verdict:
   ```
   Verdict cho R7.4.B5b?
   (a) ✅ PASS clean
   (b) ⚠️ PARTIAL (sẽ hỏi N/M)
   (c) 🚫 BLOCK
   ```

## Pipeline 7 bước

### Bước 0 — Validate input

1. Parse `<task_id>` từ args, validate match regex `^R\d+\.[0-9A-Za-z.\-]+$`.
2. Parse `<verdict>` → map sang icon: `✅` | `⚠️` | `🚫`.
3. Read `tasks/todo.md` confirm task tồn tại (grep `\*\*<task_id>\*\*`).
4. Nếu task không tồn tại → STOP, báo user.

### Bước 1 — Flip icon task

1. Tìm dòng task trong todo.md. Format:
   ```
   - <icon> <a id="..."></a>**<task_id>** <description> ...
   ```
2. Đổi icon hiện tại sang verdict mới.
3. **Hỏi user `**Kết quả:**`** — nếu chưa có dòng Kết quả, prompt user 1 câu nhập.
   - Câu hỏi: "Ghi `**Kết quả:**` cho <task_id> (ví dụ: PASS 5/5 transition)?"
   - Limit ≤25 từ (hook check-todo-concise sẽ block nếu vượt).

### Bước 2 — Đọc task-effects.yaml

1. Read `tasks/task-effects.yaml`.
2. Lookup `<task_id>` → list `entities`.
3. Nếu task không có trong yaml → AskUserQuestion: "Task <ID> ảnh hưởng entity nào? (vd: HD, VV, NHCH; gõ 'none' nếu không thay đổi state)".
4. Nếu user trả lời "none" → skip Bước 3-5, jump bước 6.

### Bước 3 — Re-verify từng entity qua MCP/curl

Cho mỗi entity trong list:
1. Read `tasks/state-snapshot.md` → tìm row entity, lấy "Verify command".
2. Execute curl command (cần auth token — xem §Auth handling).
3. Parse response JSON:
   - Total count
   - State distribution (group by `trang_thai` field)
4. Cache kết quả vào memory để bước 4 dùng.

**Auth handling:**
- Thử curl với cookie hiện có (nếu có file `~/.cache/htpldn-cookie` hoặc env var).
- Nếu 401 → STOP cascade tại đây, báo user: "Auth expired, refresh token rồi retry. Task icon đã flip; downstream sẽ defer cascade."
- Tester có thể chạy lại `/task-done <ID>` sau khi refresh.

### Bước 4 — Update state-snapshot.md

Cho mỗi entity:
1. Tìm row entity trong bảng `## Bảng state thực tế`.
2. Update cột `Total` = count mới.
3. Update cột `State distribution` = string format `STATE1:N1, STATE2:N2, ...`.
4. Update header `**Last updated:** YYYY-MM-DD HH:MM (<task_id> <verdict>)`.

### Bước 5 — Cascade markers downstream

Cho mỗi entity X:
1. Grep todo.md tìm dòng có `[need: ... <X> ...]` HOẶC `[need: ... <entity_alias> ...]`.
2. Với mỗi marker `(✗ N|reason)` HOẶC `(✓ N)` reference entity X:
   - Re-evaluate điều kiện theo state mới.
   - Nếu điều kiện thoả → đổi `(✗ ...)` → `(✓ N)` với N = count mới.
   - Nếu điều kiện không thoả → giữ `(✗ N|reason)` với N + reason mới.
3. Edit todo.md với markers mới.

**Quy tắc parse threshold:**
- `≥N` → check `count >= N`
- `≥1 mỗi LV` → check tất cả LV có ≥1 record (cần dữ liệu per-LV — nếu state-snapshot không có, giữ nguyên marker + note "cần verify per-LV").
- `state X` → check state distribution có ≥1 record state X.
- Marker phức tạp (vd `≥3 record + 6 LV + cong_khai=1`) → giữ nguyên + AskUserQuestion confirm.

### Bước 6 — Hook auto cascade

1. Edit todo.md (chỉ cần save lại, các bước 4-5 đã edit).
2. Hook PostToolUse `auto-rescan-todo.py` tự fire:
   - Flip ⏳→🟢 cho task có markers `(✓ ...)` đủ.
   - Recount bảng tổng Tổng row.
3. Hook PostToolUse `sync-todo-deps.py` tự fire:
   - Sync mục lục cells icon theo task list.

### Bước 7 — Báo cáo user

Output template:
```
✅ Task <ID> closed (<verdict>)

📊 Entity changes:
  - <entity>: <old_total> → <new_total> (<state distribution>)
  - ...

🔄 Markers updated (downstream):
  - <task_id_1>: (✗ N) → (✓ N')
  - <task_id_2>: (✗ ...) giữ nguyên — cần verify per-LV
  - ...

🟢 Auto-unblocked (⏳→🟢):
  - <task_id_3>
  - ...

📋 Bảng tổng: <19> 🟢 + <0> 🔵 + <40> ✅ + <18> ⚠️ + <8> 🚫 + <24> ⏳ = <109>

⚠️ Cần làm thêm (manual):
  - <bất kỳ task nào marker không tự verify được — list ra để tester check>
```

## Edge cases

### Case 1: Verdict ⚠️ partial

Hỏi thêm: "Task ⚠️ partial — entity state có advance hoàn toàn không, hay 1 phần?"
- "Hoàn toàn" → cascade như ✅
- "1 phần" → AskUserQuestion: "Bao nhiêu record advance state X? (vd: 7/8)" → update state-snapshot theo số tester nhập.

### Case 2: Verdict 🚫 block

- KHÔNG advance state-snapshot (entity không thay đổi).
- KHÔNG cascade markers.
- Chỉ flip icon + ghi Kết quả.

### Case 3: Task chưa có anchor `<a id="...">`

- Tạo anchor mới (lowercase, dấu `.` → `-`): `<a id="r7-4-b5b"></a>`.
- Đảm bảo mục lục cell match anchor.

### Case 4: Auth expired giữa cascade

- Lưu progress hiện tại (entity nào đã verify xong) vào temp file `tasks/.task-done-state.json`.
- Báo user refresh + retry `/task-done <ID> --resume`.

### Case 5: Task có conflict bug-line

- Nếu task có dòng `**Bug:**` X/Y đóng và verdict = ✅ → check `X == Y` (all closed). Nếu X < Y → cảnh báo "Còn bug Open, verdict ✅ phù hợp?" (do tester quyết).

## Examples

### Ex 1: Đóng task happy path

```
User: /task-done R7.4.B5b ✅
Skill:
  1. Flip 🟢→✅ R7.4.B5b
  2. Đọc yaml: entities=[NHCH]
  3. Curl /api/v1/ngan-hang-cau-hois → count=5, state=CONG_KHAI:5
  4. Update state-snapshot NHCH row: 5 NHAP → 5 CONG_KHAI
  5. Grep markers NHCH: R7.4.B10 marker `(✗ 5 ALL VO_HIEU_HOA)` → check NHAP=0 → vẫn ✗ (R7.4.B10 cần NHAP)
  6. Save todo → hook flip ⏳→🟢 nếu có
  7. Output report.
```

### Ex 2: Verdict ⚠️ partial

```
User: /task-done R7.4.D3 ⚠️
Skill:
  1. AskUserQuestion: "PARTIAL N/M? (vd: 7/8)"
  User: "7/8 — T8 fail"
  2. Flip 🟢→⚠️
  3. Update state-snapshot Kho_QA: CHO_DUYET 9 → 1 + DA_DUYET +8 (theo input user)
  4. Cascade markers...
```

### Ex 3: Task không trong yaml

```
User: /task-done R7.0.10 ✅
Skill:
  1. Lookup yaml: not found
  2. AskUserQuestion: "R7.0.10 ảnh hưởng entity nào?"
  User: "none — chỉ smoke test"
  3. Flip icon, skip cascade, jump bước 7.
```

## Constraints

- **KHÔNG flip 🟢→✅** nếu task có dòng `**Bug:**` X/Y với X < Y mà không có user confirm.
- **KHÔNG update state-snapshot** với entity không có trong bảng (báo user thêm row trước).
- **KHÔNG cascade khi verdict 🚫** (entity không thay đổi).
- **Tôn trọng hook output** — sau khi save todo, đọc stderr hook để confirm flip ⏳→🟢 đã fire.
- **Không silent fail** — nếu bước nào fail, báo user rõ ràng + state đã làm tới đâu.

## Maintenance

- Thêm task mới vào `tasks/task-effects.yaml` khi tạo task có state change.
- Khi entity mới được thêm vào state-snapshot.md → đảm bảo có "Verify command" cột.
- Skill version: 1.0.0 (2026-05-08).
