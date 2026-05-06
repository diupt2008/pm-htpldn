# Workflow xử lý SRS update — Checklist 13 bước

> **Mục đích:** Áp dụng cho mỗi đợt BA/dev gửi SRS update. Bám checklist này → giảm 80% rủi ro miss/sai.
> **Ngày tạo:** 2026-05-06 | **Lý do:** Rút từ session apply SRS update 2026-05-05 (8 commit, lặp lại sai 5-7 lần).
> **Tham chiếu:** [plan.md](plan.md), [todo.md](todo.md), [_archive/](_archive/)

---

## Phần 1 — 10 bài học cốt lõi (anti-pattern cần tránh)

### A. Sycophancy có nhiều dạng
- "Bạn ĐÚNG" ngay khi user flag → phải re-verify với evidence trước.
- Đẻ thêm 3-4 option cuối turn = push consent, né quyết định.

### B. Tỏ ra cẩn thận = né responsibility
- Đẻ thêm câu hỏi BA khi data SRS đã có → verify trước, đặt câu hỏi sau.

### C. Audit không systematic ngay từ đầu
- Chỉ check file user mention → miss file khác. Phải `ls` folder + verify đầy đủ với BA.

### D. Re-verify TỪNG claim trước khi đề xuất
- Mỗi "lỗi/task/dep" phải có line cite SRS hoặc archive trước khi sửa. Tránh re-work mâu thuẫn.

### E. Rút gọn ≠ xoá history
- Format "1-line summary + link report đầy đủ" tốt hơn "1-line tóm tắt mất context".

### F. Đếm thủ công sai chắc chắn (file >50 task)
- Phải dùng `grep -cE` verify, không count tay.

### G. Đọc hook config TRƯỚC khi edit file lớn
- Format khớp hook trước khi viết → tránh block + rewrite.

### H. Verify deploy thực tế bằng MCP/curl, không accept dev claim
- Khi nghe "dev deploy xong" → đề xuất verify ngay, không assume.

### I. Status sau reset DB không phải downgrade
- Task R{old} ✅ + spec không đổi → 🟢 sẵn sàng re-test (data mất). Hệ quả tất yếu.

### J. Scope change chạm nhiều file hơn dự đoán
- Permission matrix có 3 view (by-role/by-fr/main) — đừng miss.
- Folder flow + 02-thu-tu + 01-tong-quan-nghiep-vu cần audit cross-impact.

---

## Phần 2 — Quy trình 13 bước

### A. Pre-update (BA gửi SRS update)

**1. Audit toàn folder SRS update — KHÔNG chỉ file BA mention**
```bash
ls input/srs-update-YYYY-MM-DD/
```
+ Verify với BA: "Folder đầy đủ files chưa? Có file nào sắp gửi nữa không?"

**2. So sánh TOC + line count cũ/mới mỗi file**
```bash
wc -l srs-v3/srs-fr-XX.md srs-update-.../srs-fr-XX.md
diff <(grep -nE "^##? " old) <(grep -nE "^##? " new)
```
+ Δ >50% lines = file CRITICAL → priority cao nhất.

**3. Đọc block "Lịch sử thay đổi" mỗi file** (~10-15 dòng đầu)
+ Chứa changelog dev/BA → list breaking change cụ thể.

**4. Spawn Agent grep cross-reference** trên 16 file SRS-v3 với 7 keyword:
- Entity mới + entity bỏ
- Enum đổi
- FR mới + FR bỏ
- BR đổi
- Field bỏ (vd `dia_ban_ids`)
- SM trạng thái mới
- API endpoint mới

**5. Tạo `_DELTA-MAP-FR{XX}.md` mỗi file SRS update**
- Section bắt buộc: scope đổi, module impact A/B/C/D theo Rule 4 CLAUDE.md, task QA cần update, đáp án câu hỏi cite line SRS.
- Phân loại CRITICAL/HIGH/MEDIUM/LOW — fix theo Pareto, không "all or nothing".

### B. During-update (QA edit file)

**6. List file QA cần update theo PRIORITY + commit từng nhóm**

| Priority | File | Lý do |
|---|---|---|
| P1 (nền tảng) | permission-matrix (3 view!), entity-map, seed-fixture | File chứa BR/schema, sai = phá downstream |
| P2 (dependency) | flow-module, 02-thu-tu-module, test-strategy | File reference, sai = mọi test plan dùng spec sai |
| P3 (chi tiết) | output/funtion/, output/smoke/ per module | File test case, fix khi run test thật |

→ KHÔNG mass-edit. Commit từng group để rollback dễ.

**7. Đọc hook config TRƯỚC khi edit file lớn**
```bash
ls .claude/hooks/
cat .claude/hooks/check-todo-*.py | grep -A 5 "BLOCKED\|patterns"
```
+ Format khớp hook trước khi viết.

### C. Pre-test trigger (dev deploy)

**8. Verify deploy thực tế bằng MCP/curl — KHÔNG accept dev claim**

3 lệnh chuẩn:
```bash
# Schema migration đã chạy chưa?
curl -s "/api/v1/{entity}?{enum-cũ-bỏ}=X&size=1"

# Entity mới có endpoint?
curl -s -o /dev/null -w "%{http_code}\n" "/api/v1/{entity-mới}?size=1"

# Count data cũ còn?
curl -s "/api/v1/{entity-cũ}?size=1" | jq .totalElements
```
+ Phân loại scenario A (no reset) / B (reset DB) / C (partial deploy) / MIX rõ ràng.

**9. Frozen Round cũ + tạo Round mới với cấu trúc đúng**

- Backup `tasks/todo.md` → `_archive/round-N-frozen-YYYY-MM-DD.md`
- todo Round mới: **giữ task R{old} với history line** + tag:
  - 🔄 KEPT — spec không đổi, re-seed/re-test
  - ✏️ MODIFIED — spec đổi (note rõ chỗ nào đổi)
  - 🆕 NEW — feature SRS update
  - ❌ DROPPED — obsoleted (giữ inline để traceability, không xoá)
- Chèn task NEW vào ĐÚNG PHASE theo dependency, không tạo Phase rời.

**10. Log bug deploy gap song song chạy test**
- Task chạy được vẫn chạy
- Gap chờ dev fix → log `bug-report-deploy-gap.md` gửi dev

### D. During-test (QA chạy)

**11. Status update bằng grep, KHÔNG count thủ công**
```bash
grep -cE "^- 🟢 \\*\\*R{N}\\." todo.md
grep -cE "^- ⏳ \\*\\*R{N}\\." todo.md
grep -cE "^- 🚫 \\*\\*R{N}\\." todo.md
```

**12. Commit từng phase** với message rõ:
```
test(R{N} phase X): {mô tả} — N/M PASS, K bug logged
```

### E. Post-test

**13. Archive + bump plan version**
- Archive Round cũ vào `_archive/round-N-frozen-{date}.md` để tra ngược.
- Bump `plan.md` version + pointer đến todo mới + delta map files.
- Update `lessons-learned.md` nếu phát sinh pattern mới.

---

## Phần 3 — Anti-pattern cấm tuyệt đối

| Cấm | Lý do |
|---|---|
| ❌ "Bạn ĐÚNG" ngay khi user flag | Phải re-verify với evidence trước |
| ❌ Đẻ thêm câu hỏi BA khi data có sẵn | Né responsibility, đẩy decision |
| ❌ Cắt history khi rút gọn file | Mất context = tester phải mở archive mỗi lần |
| ❌ Đếm thủ công file >50 task | Lệch số chắc chắn — dùng grep |
| ❌ Edit file >200 dòng không đọc hook | Bị block → rewrite tốn time gấp 3 |
| ❌ Accept dev claim "deploy xong" | Phải verify MCP/curl thực tế |
| ❌ Đề xuất 3-4 option cuối turn | Push consent, né quyết định |
| ❌ Clone R{old} 1-1 vào R{new} | Noise, không lọc obsolete |
| ❌ Bê nguyên status R{old} sau reset DB | ✅ → 🟢 là hệ quả, không downgrade |
| ❌ Đề xuất "5 sửa" không cross-check mâu thuẫn | Sửa lỗi sinh lỗi mới — phải verify cohesive |

---

## Phần 4 — Áp dụng cụ thể cho project HTPLDN

### Khi nào trigger workflow này
- BA gửi folder mới `input/srs-update-YYYY-MM-DD/`
- Dev claim "deploy SRS update" + reset DB
- Round R{N} active đang chạy + có scope change lớn

### Files cố định cần check mỗi lần
- `output/permission-matrix.md` + `permission-matrix-by-fr.md` + `permission-matrix-by-role.md` (3 view!)
- `input/data/entity-map.md`
- `input/data/seed-fixture.yaml`
- `input/quy-trinh-nghiep-vu/flow-module.md`
- `input/quy-trinh-nghiep-vu/02-thu-tu-module.md`
- `input/quy-trinh-nghiep-vu/01-tong-quan-nghiep-vu.md`
- `output/test-strategy.md`
- `tasks/system-overview.md`

### Hook hiện có (đã verify)
- `check-todo-coverage-tag.py` — task icon ⏳/🟢/⚠️/🚫 phải có tag (`[~X% — ...]`, `[need: ...]`, `[block: ...]`)
- `check-todo-concise.py` — line `**Kết quả:**` phải ≤25 từ. Workaround: dùng prefix `**R6:**` cho lịch sử Round cũ
- `check-todo-pass-strict.py` — task ⏳ → ✅ phải có dep PASS thật, verify query
- `check-todo-green-strict.py` — task 🟢 chỉ khi dep upstream ✅

### Reference workflow đã chạy thành công
SRS update 2026-05-05 (8 commit baseline):
1. `5e8cd4f` apply 3 SRS update vào 5 file QA nền tảng
2. `c3483bb` thêm Round 7 PENDING todo
3. `d8e7661` R7.0.0/R7.0.5 verify scenario reset DB
4. `2f765c0` expand batch FR-03 + FR-12 + Profile + cross-cutting
5. `c582b72` self-answer 4 cross-cutting questions từ data
6. `6ef98f8` plan R7 + scenario MIX verified qua web
7. `2affbc8` redesign R7 — giữ R6 history + chèn R7 theo dependency
8. `d4e7e1b` fix 6 lỗi dependency + tách task + drop obsolete

→ Mỗi commit = 1 nhóm change. Rollback dễ.
